// Abstraction layer over price data sources. Adds graceful fallback to mock
// whenever the live source fails (CORS, network, parse errors, unsupported
// market). Source selection is persisted in localStorage and surfaced via
// `?source=stooq` URL param for shareable demos.

import * as mock from './sources/mock.js';
import * as stooq from './sources/stooq.js';

const SOURCES = { mock, stooq };
const KEY = 'tossinvest:source';
const VALID = ['mock', 'stooq'];

export function getSource() {
  const param = new URLSearchParams(location.search).get('source');
  if (VALID.includes(param)) return param;
  const stored = localStorage.getItem(KEY);
  return VALID.includes(stored) ? stored : 'mock';
}

export function setSource(name) {
  if (!VALID.includes(name)) return;
  localStorage.setItem(KEY, name);
}

export function cycleSource() {
  const next = VALID[(VALID.indexOf(getSource()) + 1) % VALID.length];
  setSource(next);
  return next;
}

let lastUsed = getSource();
export function getLastUsedSource() {
  return lastUsed;
}

const subs = new Set();
export function onSourceChange(fn) {
  subs.add(fn);
  return () => subs.delete(fn);
}

function setLastUsed(name) {
  if (lastUsed === name) return;
  lastUsed = name;
  subs.forEach(fn => {
    try {
      fn(name);
    } catch (e) {
      console.warn('[source] subscriber failed:', e.message);
    }
  });
}

async function tryWithFallback(method, ...args) {
  const preferred = getSource();
  if (preferred !== 'mock') {
    try {
      const result = await SOURCES[preferred][method](...args);
      setLastUsed(preferred);
      return { result, source: preferred };
    } catch (e) {
      console.warn(`[source] ${preferred}.${method} failed → mock fallback:`, e.message);
    }
  }
  const result = await SOURCES.mock[method](...args);
  setLastUsed('mock');
  return { result, source: 'mock' };
}

export async function getQuote(stock) {
  return tryWithFallback('getQuote', stock);
}

export async function getSeries(stock, range) {
  return tryWithFallback('getSeries', stock, range);
}

export function sourceLabel(name = lastUsed) {
  return SOURCES[name]?.label ?? name;
}

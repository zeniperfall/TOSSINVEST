// Stooq adapter. Returns data in the shape the rest of the app expects.
// CSV docs: https://stooq.com  (q/l = light quote, q/d/l = daily history)
//
// Light quote:  https://stooq.com/q/l/?s=nvda.us&i=d&f=sd2t2ohlcv&e=csv
//   columns: Symbol,Date,Time,Open,High,Low,Close,Volume
// Daily series: https://stooq.com/q/d/l/?s=nvda.us&i=d&d1=20240101&d2=20260428
//   columns: Date,Open,High,Low,Close,Volume

const BASE = 'https://stooq.com';

export function symbolFor(stock) {
  if (!stock) return null;
  if (stock.market === '나스닥') return stock.ticker.toLowerCase() + '.us';
  if (stock.market === '코스피') return stock.ticker + '.kr';
  return null;
}

export function parseQuoteCsv(text) {
  const lines = text.trim().split(/\r?\n/);
  if (lines.length < 2) throw new Error('empty quote csv');
  const cols = lines[1].split(',');
  if (cols.length < 8) throw new Error('quote csv malformed');
  const [, date, time, open, high, low, close, volume] = cols;
  const price = parseFloat(close);
  const o = parseFloat(open);
  if (!isFinite(price) || !isFinite(o)) throw new Error('quote csv N/D');
  return {
    date,
    time,
    open: o,
    high: parseFloat(high),
    low: parseFloat(low),
    price,
    volume: parseInt(volume, 10) || 0,
  };
}

export function parseSeriesCsv(text) {
  const lines = text.trim().split(/\r?\n/).slice(1); // skip header
  const out = [];
  for (const l of lines) {
    const [date, open, high, low, close, volume] = l.split(',');
    const price = parseFloat(close);
    if (!isFinite(price)) continue;
    out.push({
      date: new Date(date),
      open: parseFloat(open),
      high: parseFloat(high),
      low: parseFloat(low),
      price,
      volume: parseInt(volume, 10) || 0,
    });
  }
  if (out.length === 0) throw new Error('series csv empty');
  return out;
}

function fmtDate(d) {
  return (
    d.getUTCFullYear().toString() +
    String(d.getUTCMonth() + 1).padStart(2, '0') +
    String(d.getUTCDate()).padStart(2, '0')
  );
}

export async function getQuote(stock) {
  const sym = symbolFor(stock);
  if (!sym) throw new Error('unsupported market: ' + stock.market);
  const url = `${BASE}/q/l/?s=${sym}&i=d&f=sd2t2ohlcv&e=csv`;
  const r = await fetch(url, { credentials: 'omit' });
  if (!r.ok) throw new Error('http ' + r.status);
  return parseQuoteCsv(await r.text());
}

export async function getSeries(stock, range) {
  const sym = symbolFor(stock);
  if (!sym) throw new Error('unsupported market: ' + stock.market);
  const days = { '1D': 7, '1W': 14, '1M': 60, '3M': 120, '1Y': 380, '5Y': 1850, ALL: 9000 }[range];
  // Stooq daily history doesn't support intraday; for 1D we fall back to 7 days of daily.
  const interval = days <= 365 ? 'd' : days <= 1850 ? 'w' : 'm';
  const today = new Date();
  const start = new Date(today.getTime() - days * 86400000);
  const url =
    `${BASE}/q/d/l/?s=${sym}&i=${interval}` + `&d1=${fmtDate(start)}&d2=${fmtDate(today)}`;
  const r = await fetch(url, { credentials: 'omit' });
  if (!r.ok) throw new Error('http ' + r.status);
  return parseSeriesCsv(await r.text());
}

export const label = 'Stooq';

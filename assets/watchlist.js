// Watchlist persistence backed by localStorage.
// Default seeded with a few popular codes so first-time users see content.

const KEY = 'tossinvest:watchlist';
const DEFAULTS = ['NAS0221219002', 'NASTSLA', 'NASMETA'];

export function getWatchlist() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw === null) {
      // Seed once.
      localStorage.setItem(KEY, JSON.stringify(DEFAULTS));
      return [...DEFAULTS];
    }
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [...DEFAULTS];
  }
}

export function isWatched(code) {
  return getWatchlist().includes(code);
}

export function toggleWatched(code) {
  const list = getWatchlist();
  const next = list.includes(code) ? list.filter(c => c !== code) : [...list, code];
  localStorage.setItem(KEY, JSON.stringify(next));
  notify();
  return next.includes(code);
}

const subscribers = new Set();
export function subscribe(fn) {
  subscribers.add(fn);
  return () => subscribers.delete(fn);
}
function notify() {
  subscribers.forEach(fn => {
    try {
      fn(getWatchlist());
    } catch (e) {
      console.error('watchlist subscriber error', e);
    }
  });
}

// Sync changes across tabs.
window.addEventListener?.('storage', e => {
  if (e.key === KEY) notify();
});

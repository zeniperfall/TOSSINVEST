// Price alert notifications. Each alert: { code, target, direction }.
// Triggered when a live tick crosses the target in the requested direction.

const KEY = 'tossinvest:alerts';
const subs = new Set();

export function getAlerts() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function save(alerts) {
  localStorage.setItem(KEY, JSON.stringify(alerts));
  subs.forEach(fn => fn(alerts));
}

export function addAlert(alert) {
  const next = [...getAlerts(), alert];
  save(next);
  return next;
}

export function removeAlert(code, target) {
  const next = getAlerts().filter(a => !(a.code === code && a.target === target));
  save(next);
  return next;
}

export function subscribe(fn) {
  subs.add(fn);
  return () => subs.delete(fn);
}

export async function ensurePermission() {
  if (!('Notification' in window)) return 'unsupported';
  if (Notification.permission === 'granted') return 'granted';
  if (Notification.permission === 'denied') return 'denied';
  const result = await Notification.requestPermission();
  return result;
}

export function notify(title, body, opts = {}) {
  if (!('Notification' in window) || Notification.permission !== 'granted') return;
  try {
    new Notification(title, { body, icon: './assets/icon.svg', ...opts });
  } catch (e) {
    console.warn('[notification] failed:', e.message);
  }
}

// Returns true if `currentPrice` newly crossed `target` from the previous tick.
export function crossed(prev, current, target, direction) {
  if (direction === 'above') return prev < target && current >= target;
  if (direction === 'below') return prev > target && current <= target;
  return false;
}

// Lightweight client-side error reporter. Batches window errors and unhandled
// promise rejections; flushes to console (and optionally sendBeacon) on visibility
// change or every 10s. Designed to be drop-in replaceable with Sentry/GlitchTip.

const ENDPOINT = null; // e.g. 'https://errors.example.com/ingest'
const FLUSH_INTERVAL = 10_000;
const MAX_BUFFER = 50;

const buffer = [];
let flushTimer = null;

function push(entry) {
  buffer.push({
    ...entry,
    ts: Date.now(),
    url: location.href,
    ua: navigator.userAgent,
  });
  if (buffer.length >= MAX_BUFFER) flush();
}

function flush() {
  if (buffer.length === 0) return;
  const batch = buffer.splice(0, buffer.length);
  console.warn('[errors] flushing', batch.length, 'entries', batch);
  if (ENDPOINT && navigator.sendBeacon) {
    try {
      navigator.sendBeacon(ENDPOINT, JSON.stringify(batch));
    } catch (e) {
      console.warn('[errors] sendBeacon failed:', e.message);
    }
  }
}

window.addEventListener('error', e => {
  push({
    type: 'error',
    message: e.message,
    filename: e.filename,
    line: e.lineno,
    col: e.colno,
    stack: e.error?.stack,
  });
});

window.addEventListener('unhandledrejection', e => {
  push({
    type: 'unhandledrejection',
    message: String(e.reason?.message ?? e.reason),
    stack: e.reason?.stack,
  });
});

document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden') flush();
});

flushTimer = setInterval(flush, FLUSH_INTERVAL);

// Test hook: expose a manual capture for callers that want to log handled errors.
window.__captureError = function (err, context = {}) {
  push({ type: 'captured', message: err?.message ?? String(err), stack: err?.stack, context });
};

export function _testReset() {
  buffer.length = 0;
  if (flushTimer) clearInterval(flushTimer);
  flushTimer = setInterval(flush, FLUSH_INTERVAL);
}

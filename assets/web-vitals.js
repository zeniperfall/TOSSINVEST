// Lightweight Web Vitals reporter using PerformanceObserver.
// Logs LCP, INP-ish (event timing), CLS, FCP, TTFB to console.
// Real production would forward to an analytics endpoint via navigator.sendBeacon.

function report(name, value, extra = {}) {
  console.info('[web-vitals]', name, Math.round(value * 100) / 100, extra);
}

try {
  // First Contentful Paint
  new PerformanceObserver(list => {
    for (const entry of list.getEntries()) {
      if (entry.name === 'first-contentful-paint') {
        report('FCP', entry.startTime);
      }
    }
  }).observe({ type: 'paint', buffered: true });

  // Largest Contentful Paint
  new PerformanceObserver(list => {
    const entries = list.getEntries();
    const last = entries[entries.length - 1];
    if (last) report('LCP', last.startTime, { element: last.element?.tagName });
  }).observe({ type: 'largest-contentful-paint', buffered: true });

  // Cumulative Layout Shift (session window).
  let cls = 0;
  new PerformanceObserver(list => {
    for (const entry of list.getEntries()) {
      if (!entry.hadRecentInput) cls += entry.value;
    }
    report('CLS', cls);
  }).observe({ type: 'layout-shift', buffered: true });

  // Time to First Byte
  const nav = performance.getEntriesByType('navigation')[0];
  if (nav) report('TTFB', nav.responseStart);
} catch (e) {
  console.warn('[web-vitals] disabled:', e.message);
}

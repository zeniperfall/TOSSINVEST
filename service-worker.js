// Tiny offline-first service worker. Caches the app shell and serves it
// from cache, falling back to network for everything else.

const CACHE = 'tossinvest-v1';
const SHELL = [
  './',
  './home.html',
  './index.html',
  './portfolio.html',
  './search.html',
  './history.html',
  './styles.css',
  './script.js',
  './manifest.webmanifest',
  './assets/icon.svg',
  './assets/data.js',
  './assets/theme.js',
  './assets/live.js',
  './assets/watchlist.js',
  './assets/autocomplete.js',
  './assets/web-vitals.js',
  './assets/notification.js',
  './assets/pwa.js',
  './assets/home.js',
  './assets/portfolio.js',
  './assets/search.js',
  './assets/history.js',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then(cache => cache.addAll(SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches
      .keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    caches.match(req).then(cached => {
      if (cached) return cached;
      return fetch(req)
        .then(res => {
          // Cache successful same-origin GETs.
          if (res.ok) {
            const copy = res.clone();
            caches.open(CACHE).then(cache => cache.put(req, copy));
          }
          return res;
        })
        .catch(() => caches.match('./home.html'));
    })
  );
});

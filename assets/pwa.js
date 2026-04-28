// Register the service worker. Quietly no-op in environments without SW
// (older browsers, file://, or when blocked).

if ('serviceWorker' in navigator && location.protocol !== 'file:') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./service-worker.js').catch(err => {
      console.warn('[pwa] sw registration failed:', err.message);
    });
  });
}

// Surface the install prompt button when the browser fires beforeinstallprompt.
let deferredPrompt = null;
window.addEventListener('beforeinstallprompt', e => {
  e.preventDefault();
  deferredPrompt = e;
  document.querySelectorAll('[data-pwa-install]').forEach(btn => {
    btn.hidden = false;
    btn.addEventListener(
      'click',
      async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        await deferredPrompt.userChoice;
        deferredPrompt = null;
        btn.hidden = true;
      },
      { once: true }
    );
  });
});

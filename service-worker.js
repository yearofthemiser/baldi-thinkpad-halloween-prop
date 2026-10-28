// Increment the name for each release to retire the old offline copy.
const CACHE_NAME = 'thinkpad-cosplay-v3-audio';
const REQUIRED = [
  './', './index.html', './style.css', './script.js', './manifest.json',
  './assets/thinkpad-loop.wav'
];
// These are optional: the user might have renamed/replaced visual files.
const OPTIONAL = [
  './assets/background.png', './assets/baldi-angry.png',
  './assets/corrupted-problem.svg',
  './assets/icon-192.png', './assets/icon-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll(REQUIRED);
    await Promise.all(OPTIONAL.map(async file => {
      try {
        const response = await fetch(file);
        if (response.ok) await cache.put(file, response);
      } catch (_) { /* Custom visual files may not exist. */ }
    }));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const names = await caches.keys();
    await Promise.all(names.filter(name => name !== CACHE_NAME).map(name => caches.delete(name)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET' || new URL(event.request.url).origin !== self.location.origin) return;
  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    if (event.request.mode === 'navigate') {
      // Prefer updated files online; keep a copy for the offline cosplay prop.
      try {
        const response = await fetch(event.request);
        if (response.ok) await cache.put(event.request, response.clone());
        return response;
      } catch (_) {
        return await cache.match(event.request) || await cache.match('./index.html');
      }
    }
    const existing = await cache.match(event.request);
    if (existing) return existing;
    const response = await fetch(event.request);
    if (response.ok) cache.put(event.request, response.clone()).catch(() => {});
    return response;
  })());
});

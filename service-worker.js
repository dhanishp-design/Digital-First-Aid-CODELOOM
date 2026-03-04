const CACHE_NAME = 'first-aid-assist-v13';
const ASSETS = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './images/cpr.png',
  './images/burn.png',
  './images/bleeding.png',
  './images/choking.png',
  './images/cpr_step1.png',
  './images/cpr_step2.png',
  './images/cpr_step3.png',
  './images/cpr_step4.png',
  './images/burns_step1.png',
  './images/burns_step2.png',
  './images/burns_step3.png',
  './images/burns_step4.png',
  './images/bleed_step1.png',
  './images/bleed_step2.png',
  './images/bleed_step3.png',
  './images/chok_step1.png',
  './images/chok_step2.png',
  './images/chok_step3.png',
  './images/chok_step4.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request))
  );
});

// Kids Brain Games service worker: caches every game so the whole collection plays offline.
// When you add a game or change any file: add new files to FILES and bump VERSION.
const VERSION = 'v11';
const CACHE = 'kids-brain-games-' + VERSION;
const FILES = [
  './',
  './index.html',
  './manifest.webmanifest',
  './shared/profiles.js',
  './fonts/baloo2-600.woff2',
  './fonts/baloo2-800.woff2',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/maskable-512.png',
  './icons/apple-touch-icon.png',
  './thumbs/rocket-star-catcher.jpg',
  './rocket-star-catcher/',
  './rocket-star-catcher/index.html',
  './rocket-star-catcher/icon.png',
  './thumbs/block-quest.jpg',
  './block-quest/',
  './block-quest/index.html',
  './block-quest/icon.png',
  './thumbs/brickville.jpg',
  './brickville/',
  './brickville/index.html',
  './brickville/icon.png',
  './thumbs/flip-find.jpg',
  './flip-find/',
  './flip-find/index.html',
  './flip-find/icon.png',
  './thumbs/clue-club.jpg',
  './clue-club/',
  './clue-club/index.html',
  './clue-club/icon.png'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k.startsWith('kids-brain-games-') && k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  // Pages: network first so updates show up, cached copy when offline.
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req).then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(req, copy));
        return res;
      }).catch(() => caches.match(req, { ignoreSearch: true }))
    );
    return;
  }
  // Everything else: cache first, then network (and keep a copy).
  e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(res => {
    if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
    return res;
  })));
});

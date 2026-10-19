// Siteyi internet olmadan da açabilmek için basit önbellek.
// Önce önbellekten gösterir, arkada güncel halini indirir.
var CACHE = "yks-calisma-v1";
var DOSYALAR = [
  "./", "index.html", "style.css", "app.js", "config.js", "questions.js",
  "manifest.json", "icon-192.png", "icon-512.png", "apple-touch-icon.png"
];

self.addEventListener("install", function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(DOSYALAR); }));
  self.skipWaiting();
});

self.addEventListener("activate", function (e) {
  e.waitUntil(
    caches.keys().then(function (adlar) {
      return Promise.all(adlar.filter(function (a) { return a !== CACHE; }).map(function (a) { return caches.delete(a); }));
    })
  );
  self.clients.claim();
});

self.addEventListener("fetch", function (e) {
  if (e.request.method !== "GET") return;
  e.respondWith(
    caches.open(CACHE).then(function (c) {
      return c.match(e.request).then(function (cached) {
        var ag = fetch(e.request).then(function (r) {
          if (r && r.ok) c.put(e.request, r.clone());
          return r;
        }).catch(function () { return cached; });
        return cached || ag;
      });
    })
  );
});

// Çevrimdışı çalışma ve güncelleme.
// Her yayında SURUM değişir (app.js içindeki SURUM ile aynı olmalı): yeni sürüm kendi
// önbelleğine indirilir, hazır olunca uygulama "Yeni sürüm hazır" bildirimi gösterir.
var SURUM = "1.1.6";
var CACHE = "yks-calisma-" + SURUM;
// Ders içerik dosyaları (data/*.js) ilk kullanımda önbelleğe girer; yeni içerik
// dosyası eklenince buraya da yazmak çevrimdışı ilk açılışı garantiler.
var KABUK = [
  "./", "index.html", "style.css", "app.js", "config.js", "karakter.js", "data/index.js", "data/biyoloji-ayt.js", "data/biyoloji-tyt.js", "data/sosyal-tyt.js", "data/turkce-tyt.js", "data/harita.js", "data/mola.js", "data/ulkeler.js", "data/turkiye-yer.js", "data/dunya-yer.js",
  "manifest.json", "icon-192.png", "icon-512.png", "apple-touch-icon.png"
];

self.addEventListener("install", function (e) {
  // cache:"reload": tarayıcının eski kopyası yerine sunucudaki güncel dosya indirilir
  e.waitUntil(caches.open(CACHE).then(function (c) {
    return Promise.all(KABUK.map(function (u) {
      return fetch(new Request(u, { cache: "reload" })).then(function (r) {
        if (!r.ok) throw new Error(u + " indirilemedi");
        return c.put(u, r);
      });
    }));
  }));
  // skipWaiting bilerek yok: kullanıcı "Yenile" deyince devreye girer.
});

self.addEventListener("message", function (e) {
  if (e.data && e.data.type === "SKIP_WAITING") self.skipWaiting();
});

self.addEventListener("activate", function (e) {
  e.waitUntil(
    caches.keys().then(function (adlar) {
      return Promise.all(adlar.filter(function (a) { return a !== CACHE; }).map(function (a) { return caches.delete(a); }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener("fetch", function (e) {
  var r = e.request;
  if (r.method !== "GET" || new URL(r.url).origin !== location.origin) return;
  e.respondWith(
    caches.open(CACHE).then(function (c) {
      return c.match(r, { ignoreSearch: true }).then(function (cached) {
        if (cached) return cached;
        return fetch(r).then(function (yanit) {
          if (yanit && yanit.ok) c.put(r, yanit.clone());
          return yanit;
        }).catch(function () {
          return r.mode === "navigate" ? c.match("index.html") : Response.error();
        });
      });
    })
  );
});

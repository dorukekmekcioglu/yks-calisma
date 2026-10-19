(function () {
  "use strict";

  var SURUM = "1.0 (geliştirme)";
  var sayfa = document.getElementById("sayfa");

  /* ---------- yerel kayıt (localStorage yoksa sessizce bellekte kalır) ---------- */
  var kayit = {
    oku: function (anahtar, varsayilan) {
      try {
        var v = localStorage.getItem(anahtar);
        return v == null ? varsayilan : JSON.parse(v);
      } catch (e) { return varsayilan; }
    },
    yaz: function (anahtar, deger) {
      try { localStorage.setItem(anahtar, JSON.stringify(deger)); } catch (e) {}
    }
  };

  /* ---------- küçük yardımcılar ---------- */
  function h(etiket, ozellik) {
    var el = document.createElement(etiket);
    ozellik = ozellik || {};
    Object.keys(ozellik).forEach(function (k) {
      var v = ozellik[k];
      if (k === "class") el.className = v;
      else if (k.slice(0, 2) === "on") el.addEventListener(k.slice(2), v);
      else if (v !== false && v != null) el.setAttribute(k, v);
    });
    for (var i = 2; i < arguments.length; i++) ekle(el, arguments[i]);
    return el;
  }
  function ekle(el, c) {
    if (c == null || c === false) return;
    if (Array.isArray(c)) { c.forEach(function (x) { ekle(el, x); }); return; }
    el.appendChild(c.nodeType ? c : document.createTextNode(String(c)));
  }
  function rastgele(dizi) { return dizi[Math.floor(Math.random() * dizi.length)]; }

  function selam() {
    var s = new Date().getHours();
    var g = s < 6 ? "İyi geceler" : s < 12 ? "Günaydın" : s < 18 ? "İyi günler" : "İyi akşamlar";
    return g + (window.ISIM ? ", " + window.ISIM : "");
  }

  // Sevgilinin notları öncelikli: üçte iki olasılıkla onlardan biri seçilir.
  function motivasyonNotu() {
    var liste = window.MOTIVASYON || [];
    if (!liste.length) return null;
    var onun = liste.filter(function (n) { return n.sevgili; });
    var havuz = onun.length && Math.random() < 0.67 ? onun : liste;
    return rastgele(havuz);
  }

  function notKarti() {
    var n = motivasyonNotu();
    if (!n) return null;
    return h("div", { class: "kart not-kart" },
      h("p", null, n.metin),
      n.sevgili ? h("span", { class: "imza" }, "💗") : null);
  }

  function yakinda(ikon, baslik, metin) {
    return h("div", { class: "kart yakinda" },
      h("div", { class: "ikon", "aria-hidden": "true" }, ikon),
      h("h2", null, baslik),
      h("p", null, metin));
  }

  /* ---------- tema ---------- */
  function temaUygula(t) {
    if (t === "acik" || t === "koyu") document.documentElement.dataset.tema = t;
    else delete document.documentElement.dataset.tema;
    kayit.yaz("yks-tema", t);
  }

  /* ---------- küçük mesaj ---------- */
  var mesajZamani;
  function mesaj(metin) {
    var eski = document.querySelector(".mesaj");
    if (eski) eski.remove();
    var el = h("div", { class: "mesaj", role: "status" }, metin);
    document.body.appendChild(el);
    clearTimeout(mesajZamani);
    mesajZamani = setTimeout(function () { el.remove(); }, 2600);
  }

  /* ---------- TYT | AYT → ders → konu ---------- */
  function dersListesi() {
    var sinav = kayit.oku("yks-sinav", "tyt");
    var kutu = h("div");
    var sekme = h("div", { class: "sinav-sekme", role: "tablist" });

    function ciz() {
      kutu.replaceChildren();
      Array.prototype.forEach.call(sekme.children, function (b) {
        b.setAttribute("aria-selected", String(b.dataset.sinav === sinav));
      });
      DERSLER.filter(function (d) { return d.sinav === sinav; }).forEach(function (d) {
        var konular = KONULAR.filter(function (k) { return k.ders === d.id && k.sinav === sinav; });
        var liste = h("div", { class: "konular" }, konular.map(konuSatiri));
        if (!konular.length) liste.appendChild(h("p", { class: "kucuk", style: "padding:6px 10px 12px" }, "Bu dersin konuları yakında eklenecek."));
        kutu.appendChild(h("details", { class: "ders" },
          h("summary", null,
            h("span", { class: "ikon", "aria-hidden": "true" }, d.ikon),
            d.ad,
            h("span", { class: "say" }, konular.length ? konular.length + " konu" : "")),
          liste));
      });
    }

    [["tyt", "TYT"], ["ayt", "AYT"]].forEach(function (s) {
      sekme.appendChild(h("button", {
        type: "button", role: "tab", "data-sinav": s[0],
        onclick: function () { sinav = s[0]; kayit.yaz("yks-sinav", sinav); ciz(); }
      }, s[1]));
    });
    ciz();
    return h("div", null, sekme, kutu);
  }

  function konuSatiri(k) {
    var yuzde = 0; // gerçek ilerleme adım 5'te (Leitner) gelecek
    return h("a", { class: "konu", href: "#/konu/" + k.id },
      h("div", { class: "ust-satir" },
        h("span", { class: "ad" }, k.ad),
        k.hazir ? null : h("span", { class: "hazirlaniyor" }, "hazırlanıyor")),
      h("div", { class: "cubuk", "aria-hidden": "true" }, h("i", { style: "width:" + yuzde + "%" })));
  }

  /* ---------- ders dosyası: derse girilince yüklenir ---------- */
  var yuklenenler = {};
  function dersYukle(dosya) {
    if (!yuklenenler[dosya]) {
      yuklenenler[dosya] = new Promise(function (coz) {
        var bos = { maddeler: [], sorular: [] };
        if (window.ICERIK && window.ICERIK[dosya]) return coz(window.ICERIK[dosya]);
        var el = document.createElement("script");
        el.src = "data/" + dosya + ".js";
        el.onload = function () { coz((window.ICERIK && window.ICERIK[dosya]) || bos); };
        el.onerror = function () { delete yuklenenler[dosya]; coz(bos); }; // dosya henüz yok
        document.head.appendChild(el);
      });
    }
    return yuklenenler[dosya];
  }
  window.icerikKaydet = function (dosya, veri) {
    window.ICERIK = window.ICERIK || {};
    window.ICERIK[dosya] = { maddeler: veri.maddeler || [], sorular: veri.sorular || [] };
  };

  function ozetBolumu(maddeler) {
    var gruplar = [], harita = {};
    maddeler.forEach(function (m) {
      if (!harita[m.baslik]) { harita[m.baslik] = []; gruplar.push(m.baslik); }
      harita[m.baslik].push(m);
    });
    return gruplar.map(function (b) {
      return h("section", { class: "kart ozet" },
        h("h2", null, b),
        h("ul", null, harita[b].map(function (m) { return h("li", null, m.bilgi); })));
    });
  }

  function calisBolumu(sorular) {
    return h("div", { class: "kart" },
      h("h2", null, "Bu konudan yeni test"),
      h("p", { class: "alt" }, sorular.length + " soru hazır."),
      h("button", { class: "dugme", type: "button", style: "margin-top:16px",
        onclick: function () { mesaj("Test akışı bir sonraki adımda hazır olacak 🌿"); } }, "Teste başla"));
  }

  function tekrarBolumu() {
    return yakinda("🌤️", "Şimdilik tekrar bekleyen yok",
      "Bu konudan öğrendiklerin tekrar zamanı gelince burada görünecek.");
  }

  /* ---------- sayfalar ---------- */
  var sayfalar = {
    ana: function () {
      var bekleyen = 0; // tekrarı gelen madde sayısı; Leitner (adım 5) gelince dolacak
      var bugun = h("div", { class: "kart bugun" },
        h("h2", null, "Bugün"),
        h("p", { class: "sayi" }, String(bekleyen), h("small", null, "madde seni bekliyor")),
        h("p", { class: "alt" }, bekleyen
          ? "Kısa bir turda hepsine göz atabilirsin."
          : "Şimdilik tekrar bekleyen yok. İstersen yeni bir şeylere bakalım."),
        h("button", { class: "dugme", type: "button", onclick: function () { mesaj("Kısa tur, test akışıyla birlikte birazdan hazır 🌿"); } },
          "Kısa bir tur ", h("span", { class: "kucuk", style: "color:inherit;opacity:.8" }, "· 2-3 dk")));

      var hizli = h("div", { class: "hizli" },
        h("button", { class: "dugme", type: "button", onclick: function () { mesaj("Karışık test, test akışıyla birlikte birazdan hazır 🌿"); } }, "20 soruluk karışık test"),
        h("button", { class: "dugme ikincil", type: "button", onclick: function () { mesaj("Özelleştirme birazdan hazır 🌿"); } }, "Özelleştir"));

      return [
        h("header", { class: "ust" },
          h("p", { class: "selam" }, selam()),
          h("h1", null, "Bugün biraz tekrar?")),
        bugun,
        hizli,
        h("div", { style: "margin-top:12px" }, notKarti()),
        h("h2", { class: "bolum-baslik" }, "Dersler"),
        dersListesi()
      ];
    },
    konu: function (arg) {
      var k = KONULAR.filter(function (x) { return x.id === arg[0]; })[0];
      var geri = h("a", { class: "geri", href: "#/" }, "‹ Dersler");
      if (!k) return [geri, h("header", { class: "ust" }, h("h1", null, "Konu bulunamadı"))];

      var sekmeler = [["ozet", "Özet"], ["calis", "Çalış"], ["tekrar", "Tekrar"]];
      var secili = arg[1] === "calis" || arg[1] === "tekrar" ? arg[1] : "ozet";
      var icerik = h("div", { class: "konu-icerik" }, h("p", { class: "kucuk" }, "Yükleniyor…"));
      var cubuk = h("div", { class: "sekme-cubuk", role: "tablist" }, sekmeler.map(function (s) {
        return h("a", { href: "#/konu/" + k.id + "/" + s[0], role: "tab", "aria-selected": String(secili === s[0]) }, s[1]);
      }));

      dersYukle(k.dosya).then(function (veri) {
        var maddeler = veri.maddeler.filter(function (m) { return m.konu === k.id; });
        var sorular = veri.sorular.filter(function (q) { return q.konu === k.id; });
        icerik.replaceChildren();
        if (!maddeler.length && !sorular.length) {
          ekle(icerik, yakinda("🌿", "Bu konu hazırlanıyor", "İçerik kaynaklardan hazırlanınca burada olacak."));
        } else if (secili === "ozet") ekle(icerik, ozetBolumu(maddeler));
        else if (secili === "calis") ekle(icerik, calisBolumu(sorular));
        else ekle(icerik, tekrarBolumu());
      });

      return [
        geri,
        h("header", { class: "ust" },
          h("h1", null, k.ad),
          h("div", { class: "cubuk", "aria-hidden": "true" }, h("i", { style: "width:0%" }))),
        cubuk,
        icerik
      ];
    },
    mola: function () {
      return [
        h("header", { class: "ust" }, h("h1", null, "Mola")),
        yakinda("☕", "Kafa dağıtma köşesi",
          "Başkentler, haritada ülke bulma ve Türkiye illeri buraya gelecek.")
      ];
    },
    "gozden-gecir": function () {
      return [
        h("header", { class: "ust" }, h("h1", null, "Gözden Geçir")),
        yakinda("📒", "Tekrar edeceklerim ve favoriler",
          "Tekrar listesi, favoriler ve sade istatistikler buraya gelecek.")
      ];
    },
    profil: function () {
      var secili = kayit.oku("yks-tema", "sistem");
      var secenekler = [["acik", "Açık"], ["koyu", "Koyu"], ["sistem", "Sistem"]];
      var grup = h("div", { class: "secim", role: "group", "aria-label": "Tema" });
      secenekler.forEach(function (s) {
        grup.appendChild(h("button", {
          type: "button",
          "aria-pressed": String(secili === s[0]),
          onclick: function () {
            temaUygula(s[0]);
            Array.prototype.forEach.call(grup.children, function (b) { b.setAttribute("aria-pressed", "false"); });
            this.setAttribute("aria-pressed", "true");
          }
        }, s[1]));
      });
      return [
        h("header", { class: "ust" }, h("h1", null, "Profil")),
        h("div", { class: "kart" },
          h("h2", null, "Görünüm"),
          h("p", { class: "alt" }, "Açık, koyu ya da telefonun ayarına göre."),
          h("div", { style: "margin-top:14px" }, grup)),
        h("p", { class: "surum" }, "Sürüm " + SURUM)
      ];
    }
  };

  /* ---------- yönlendirme (#/mola gibi adresler; geri tuşu çalışır) ---------- */
  function rota() {
    var yol = (location.hash.replace(/^#\/?/, "") || "ana").split("/");
    var ad = sayfalar[yol[0]] ? yol[0] : "ana";
    document.querySelectorAll(".sekmeler a").forEach(function (a) {
      if (a.dataset.sekme === (ad === "konu" ? "ana" : ad)) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });
    var eskiMesaj = document.querySelector(".mesaj");
    if (eskiMesaj) eskiMesaj.remove();
    sayfa.replaceChildren();
    ekle(sayfa, sayfalar[ad](yol.slice(1)));
    // animasyonu her geçişte yeniden oynat
    sayfa.style.animation = "none"; void sayfa.offsetWidth; sayfa.style.animation = "";
    window.scrollTo(0, 0);
  }

  window.addEventListener("hashchange", rota);
  rota();
})();

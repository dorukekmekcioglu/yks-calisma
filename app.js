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

  function calisBolumu(sorular, konuAd) {
    return h("div", { class: "kart" },
      h("h2", null, "Bu konudan yeni test"),
      h("p", { class: "alt" }, sorular.length + " soru hazır."),
      h("button", { class: "dugme", type: "button", style: "margin-top:16px",
        onclick: function () { modSec(function (mod) { testBaslat(konuAd, sorular, mod); }); } }, "Teste başla"));
  }

  function tekrarBolumu() {
    return yakinda("🌤️", "Şimdilik tekrar bekleyen yok",
      "Bu konudan öğrendiklerin tekrar zamanı gelince burada görünecek.");
  }

  /* ---------- test akışı ---------- */
  var HARFLER = ["A", "B", "C", "D", "E"];
  var T = null; // süren test; yalnızca bellekte

  function karistir(dizi) {
    var a = dizi.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  // sabit:false olan sorularda şıklar karışır; öncüllü ve sabit olanlarda sıra korunur
  function soruHazirla(q) {
    var sira = [0, 1, 2, 3, 4];
    if (q.sabit === false) sira = karistir(sira);
    return { q: q, sira: sira, dogruYeri: sira.indexOf(q.dogru) };
  }

  function titret(ms) { try { if (navigator.vibrate) navigator.vibrate(ms); } catch (e) {} }

  // Mod her testin başında seçilir.
  function modSec(baslat) {
    var perde = h("div", { class: "perde", onclick: function (e) { if (e.target === perde) perde.remove(); } },
      h("div", { class: "sheet", role: "dialog", "aria-label": "Test modu" },
        h("h2", null, "Nasıl çözmek istersin?"),
        h("button", { class: "mod-secenek", type: "button", onclick: function () { perde.remove(); baslat("anlik"); } },
          h("b", null, "Anlık geri bildirim"),
          h("span", null, "Her sorudan sonra cevabı ve dipnotu görürsün.")),
        h("button", { class: "mod-secenek", type: "button", onclick: function () { perde.remove(); baslat("sonda"); } },
          h("b", null, "Sonda toplu sonuç"),
          h("span", null, "Önce hepsini çöz, sonuçları sonunda gör.")),
        h("button", { class: "link-dugme", type: "button", onclick: function () { perde.remove(); } }, "Vazgeç")));
    document.body.appendChild(perde);
  }

  function testGit() {
    if (location.hash === "#/test") rota(); else location.hash = "#/test";
  }

  function testBaslat(baslik, sorular, mod) {
    if (!sorular.length) { mesaj("Burada henüz soru yok, yakında 🌿"); return; }
    T = { baslik: baslik, mod: mod, liste: sorular.map(soruHazirla), i: 0, secim: [] };
    testGit();
  }

  // Ders dosyalarının hepsini yükleyip (olmayanlar sessizce atlanır) soru toplar.
  function sorulariTopla(filtre, adet, sonra) {
    var dosyalar = [];
    KONULAR.forEach(function (k) { if (dosyalar.indexOf(k.dosya) < 0) dosyalar.push(k.dosya); });
    Promise.all(dosyalar.map(dersYukle)).then(function (hepsi) {
      var sorular = [];
      hepsi.forEach(function (v) { sorular = sorular.concat(v.sorular.filter(filtre || function () { return true; })); });
      sonra(karistir(sorular).slice(0, adet));
    });
  }

  function testGorunum() {
    var kap = h("div", { class: "test-kap" });
    document.body.classList.add("testte");

    function ciz() {
      kap.replaceChildren();
      window.scrollTo(0, 0);
      if (T.i >= T.liste.length) { sonucCiz(kap); return; }
      var s = T.liste[T.i], q = s.q;
      var cevaplandi = T.secim[T.i] != null;
      var kilitli = T.mod === "anlik" && cevaplandi;

      var ust = h("div", { class: "test-ust" },
        h("button", { class: "kapat", type: "button", "aria-label": "Testten çık", onclick: function () { location.hash = "#/"; } }, "✕"),
        h("div", { class: "ilerleme" },
          h("span", null, (T.i + 1) + " / " + T.liste.length),
          h("div", { class: "cubuk", "aria-hidden": "true" }, h("i", { style: "width:" + (T.i / T.liste.length * 100) + "%" }))));

      var soru = h("div", { class: "soru-alani" },
        h("p", { class: "soru-metin" }, q.soru),
        q.oncul ? h("ul", { class: "oncul" }, q.oncul.map(function (o) { return h("li", null, o); })) : null);

      var secenekler = h("div", { class: "secenekler" }, s.sira.map(function (orj, poz) {
        var sinif = "secenek";
        if (kilitli) {
          if (poz === s.dogruYeri) sinif += " dogru";
          else if (poz === T.secim[T.i]) sinif += " tekrar";
        } else if (cevaplandi && poz === T.secim[T.i]) sinif += " secili";
        return h("button", { class: sinif, type: "button", disabled: kilitli ? "" : false,
          onclick: function () {
            if (kilitli) return;
            T.secim[T.i] = poz;
            if (T.mod === "anlik") titret(poz === s.dogruYeri ? 12 : 25);
            ciz();
          } },
          h("span", { class: "harf" }, HARFLER[poz]),
          h("span", { class: "metin" }, q.secenekler[orj]));
      }));

      var alt = h("div", { class: "alt-alan" });
      if (kilitli) {
        var dogruMu = T.secim[T.i] === s.dogruYeri;
        alt.appendChild(h("div", { class: "geri-bildirim " + (dogruMu ? "iyi" : "tekrar") },
          h("b", null, dogruMu ? "Güzel, bu pekişti 🌿" : "Bunu tekrar listene ekledik, birlikte pekiştireceğiz."),
          q.dipnot ? h("p", null, q.dipnot) : null));
      }
      alt.appendChild(secenekler);
      if (cevaplandi) {
        alt.appendChild(h("button", { class: "dugme", type: "button", onclick: function () { T.i++; ciz(); } },
          T.i === T.liste.length - 1 ? "Bitir" : "Devam"));
      }

      kap.appendChild(ust); kap.appendChild(soru); kap.appendChild(alt);
    }
    ciz();
    return kap;
  }

  function askNotu(oran) {
    var basamak = oran < 40 ? "dusuk" : oran < 75 ? "orta" : "yuksek";
    var liste = (window.ASK_NOTLARI && window.ASK_NOTLARI[basamak]) || [];
    return liste.length ? rastgele(liste) : null;
  }

  function sonucCiz(kap) {
    var n = T.liste.length, dogru = 0, yanlislar = [];
    T.liste.forEach(function (s, i) {
      if (T.secim[i] === s.dogruYeri) dogru++; else yanlislar.push(s);
    });
    var oran = n ? dogru / n * 100 : 0;
    var mod = T.mod;
    var not = askNotu(oran);

    // yanlışın en çok olduğu konu: özetine geçiş için
    var sayac = {}, enCok = null;
    yanlislar.forEach(function (s) { sayac[s.q.konu] = (sayac[s.q.konu] || 0) + 1; });
    Object.keys(sayac).forEach(function (k) { if (!enCok || sayac[k] > sayac[enCok]) enCok = k; });
    var konu = enCok && KONULAR.filter(function (k) { return k.id === enCok; })[0];

    kap.appendChild(h("header", { class: "ust" }, h("p", { class: "selam" }, T.baslik), h("h1", null, "Tur tamam 🌿")));

    kap.appendChild(h("div", { class: "kart sonuc" },
      h("p", { class: "buyuk" }, dogru + " / " + n),
      h("p", null, dogru + " soru pekişti" + (yanlislar.length ? ", " + yanlislar.length + " soru tekrar listesine eklendi." : "."))));

    if (not) {
      kap.appendChild(h("div", { class: "ask-karti" },
        h("span", { class: "kalp k1", "aria-hidden": "true" }, "💗"),
        h("span", { class: "kalp k2", "aria-hidden": "true" }, "💕"),
        h("span", { class: "kalp k3", "aria-hidden": "true" }, "💖"),
        h("span", { class: "kalp k4", "aria-hidden": "true" }, "💗"),
        h("p", null, not)));
    }

    if (yanlislar.length) {
      kap.appendChild(h("h2", { class: "bolum-baslik" }, "Tekrar edeceklerim"));
      yanlislar.forEach(function (s) {
        kap.appendChild(h("div", { class: "kart tekrar-kart" },
          h("p", { class: "soru-ozet" }, s.q.soru),
          h("p", { class: "dogru-cevap" }, "Doğrusu: " + HARFLER[s.dogruYeri] + ") " + s.q.secenekler[s.sira[s.dogruYeri]]),
          s.q.dipnot ? h("p", { class: "kucuk" }, s.q.dipnot) : null));
      });
    }

    var dugmeler = h("div", { class: "sonuc-dugmeler" });
    if (yanlislar.length) {
      dugmeler.appendChild(h("button", { class: "dugme", type: "button", onclick: function () {
        testBaslat("Hızlı tekrar", yanlislar.map(function (s) { return s.q; }), mod);
      } }, "Bunları hemen tekrar et"));
    }
    if (konu) dugmeler.appendChild(h("a", { class: "dugme ikincil", href: "#/konu/" + konu.id + "/ozet" }, "“" + konu.ad + "” özetine bak"));
    dugmeler.appendChild(h("a", { class: "dugme ikincil", href: "#/" }, "Ana sayfaya dön"));
    kap.appendChild(dugmeler);
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
        h("button", { class: "dugme", type: "button", onclick: function () { modSec(function (mod) { sorulariTopla(null, 8, function (l) { testBaslat("Kısa bir tur", l, mod); }); }); } },
          "Kısa bir tur ", h("span", { class: "kucuk", style: "color:inherit;opacity:.8" }, "· 2-3 dk")));

      var hizli = h("div", { class: "hizli" },
        h("button", { class: "dugme", type: "button", onclick: function () { modSec(function (mod) { sorulariTopla(null, 20, function (l) { testBaslat("Karışık test", l, mod); }); }); } }, "20 soruluk karışık test"),
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
        else if (secili === "calis") ekle(icerik, calisBolumu(sorular, k.ad));
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
    test: function () {
      if (!T) { location.replace("#/"); return null; }
      return testGorunum();
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
    if (ad !== "test") { T = null; document.body.classList.remove("testte"); }
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

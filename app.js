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

  /* ---------- sayfalar ---------- */
  var sayfalar = {
    ana: function () {
      return [
        h("header", { class: "ust" },
          h("p", { class: "selam" }, selam()),
          h("h1", null, "Bugün biraz tekrar?")),
        notKarti(),
        h("h2", { class: "bolum-baslik" }, "Yakında burada"),
        yakinda("🌿", "Bugün kartı ve Kısa bir tur",
          "Sıradaki adımda burası dolacak: tekrarı gelenler, hızlı test ve dersler.")
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
      if (a.dataset.sekme === ad) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });
    sayfa.replaceChildren();
    ekle(sayfa, sayfalar[ad](yol.slice(1)));
    // animasyonu her geçişte yeniden oynat
    sayfa.style.animation = "none"; void sayfa.offsetWidth; sayfa.style.animation = "";
    window.scrollTo(0, 0);
  }

  window.addEventListener("hashchange", rota);
  rota();
})();

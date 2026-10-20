(function () {
  "use strict";

  var SURUM = "1.0-dev10"; // sw.js içindeki SURUM ile aynı tutulur
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
      h("p", null, n.metin, n.sevgili ? " 💗" : ""));
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
    var yuzde = konuYuzde(k.id);
    return h("a", { class: "konu", href: "#/konu/" + k.id },
      h("div", { class: "ust-satir" },
        h("span", { class: "ad" }, k.ad, rozetVarMi(k.id) ? h("span", { class: "rozet", title: "Bu konuda ustalaştın" }, "🏅") : null),
        k.hazir ? null : h("span", { class: "hazirlaniyor" }, "hazırlanıyor")),
      h("div", { class: "cubuk", "aria-hidden": "true" }, h("i", { style: "width:" + yuzde + "%" })));
  }

  /* ---------- Leitner ve yerel ilerleme ---------- */
  // Her bilgi maddesinin bir kutusu (k: 1-5) ve sonraki tekrar günü (s) var.
  // Doğruda bir üst kutu, yanlışta 1. kutu. 5. kutuda doğru yapılırsa "kalıcı" olur.
  var ARALIK = [1, 2, 4, 8, 16];
  var ilerleme = kayit.oku("yks-ilerleme", {});   // { ögeId: {k, s, d, y, t, n, kalici} }
  var toplamlar = kayit.oku("yks-toplam", {});    // { konuId: öge sayısı }
  var gecmis = kayit.oku("yks-gecmis", {});       // { "2026-10-20": {c: çözülen, d: doğru} }

  function bugunNo() {
    var d = new Date();
    return Math.floor((d.getTime() - d.getTimezoneOffset() * 60000) / 86400000);
  }
  function bugunAnahtar() {
    var d = new Date();
    return d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2);
  }
  // Bir sorunun bağlı olduğu bilgi maddeleri; bağlı madde yoksa sorunun kendisi izlenir.
  function ogeIdleri(q) { return q.maddeler && q.maddeler.length ? q.maddeler : [q.id]; }

  function cevapIsle(q, dogruMu) {
    var g = bugunNo();
    ogeIdleri(q).forEach(function (id) {
      var r = ilerleme[id];
      if (!r) {
        r = { k: 1, s: g + ARALIK[0], d: 0, y: 0, t: false, n: q.konu };
        if (dogruMu) r.d++; else { r.y++; r.t = true; }
      } else if (!dogruMu) {
        r.y++; r.t = true; r.k = 1; r.kalici = false; r.s = g + 1;
      } else {
        r.d++;
        if (r.s <= g || r.t) { // yalnızca tekrar zamanı gelmişse (ya da tekrar listesindeyse) kutu atlar
          if (r.k >= 5) { r.kalici = true; r.s = g + 30; }
          else { r.k++; r.s = g + ARALIK[r.k - 1]; }
        }
        r.t = false;
      }
      r.n = q.konu;
      ilerleme[id] = r;
    });
    var a = bugunAnahtar(), gun = gecmis[a] || { c: 0, d: 0 };
    gun.c++; if (dogruMu) gun.d++;
    gecmis[a] = gun;
    kayit.yaz("yks-ilerleme", ilerleme);
    kayit.yaz("yks-gecmis", gecmis);
  }

  function bekleyenIdler(konuId) {
    var g = bugunNo();
    return Object.keys(ilerleme).filter(function (id) {
      var r = ilerleme[id];
      return r.s <= g && (!konuId || r.n === konuId);
    });
  }

  // Ders dosyası yüklenince konuların öğe sayısını kaydeder (ana sayfa ilerlemesi için).
  function toplamlariGuncelle(veri) {
    var konular = {};
    function say(konu, id) { (konular[konu] = konular[konu] || {})[id] = 1; }
    veri.maddeler.forEach(function (m) { say(m.konu, m.id); });
    veri.sorular.forEach(function (q) { ogeIdleri(q).forEach(function (id) { say(q.konu, id); }); });
    var degisti = false;
    Object.keys(konular).forEach(function (k) {
      var n = Object.keys(konular[k]).length;
      if (toplamlar[k] !== n) { toplamlar[k] = n; degisti = true; }
    });
    if (degisti) kayit.yaz("yks-toplam", toplamlar);
  }

  function konuYuzde(konuId) {
    var tp = toplamlar[konuId] || 0, n = 0;
    if (!tp) return 0;
    Object.keys(ilerleme).forEach(function (id) {
      var r = ilerleme[id];
      if (r.n === konuId && (r.k >= 4 || r.kalici)) n++;
    });
    return Math.min(100, Math.round(n / tp * 100));
  }
  function rozetVarMi(konuId) { return konuYuzde(konuId) >= 80; }

  /* ---------- ders dosyası: derse girilince yüklenir ---------- */
  var yuklenenler = {};
  function dersYukle(dosya) {
    if (!yuklenenler[dosya]) {
      yuklenenler[dosya] = new Promise(function (coz) {
        var bos = { maddeler: [], sorular: [], testler: [], semalar: {} };
        if (window.ICERIK && window.ICERIK[dosya]) { toplamlariGuncelle(window.ICERIK[dosya]); return coz(window.ICERIK[dosya]); }
        var el = document.createElement("script");
        el.src = "data/" + dosya + ".js";
        el.onload = function () {
          var v = (window.ICERIK && window.ICERIK[dosya]) || bos;
          toplamlariGuncelle(v); coz(v);
        };
        el.onerror = function () { coz(bos); }; // dosya henüz yok; tekrar denenmez
        document.head.appendChild(el);
      });
    }
    return yuklenenler[dosya];
  }
  window.icerikKaydet = function (dosya, veri) {
    window.ICERIK = window.ICERIK || {};
    window.ICERIK[dosya] = { maddeler: veri.maddeler || [], sorular: veri.sorular || [], testler: veri.testler || [], semalar: veri.semalar || {} };
  };

  /* ---------- Özet: bölümler ve kart akışı ---------- */
  var ozetDurum = kayit.oku("yks-ozet", {}); // { konuId: { maddeId: "b" (biliyorum) | "t" (tekrar bak) } }
  function ozetKaydet() { kayit.yaz("yks-ozet", ozetDurum); }

  function bolumlereAyir(maddeler) {
    var liste = [], harita = {};
    maddeler.forEach(function (m) {
      if (!harita[m.baslik]) { harita[m.baslik] = { ad: m.baslik, maddeler: [] }; liste.push(harita[m.baslik]); }
      harita[m.baslik].maddeler.push(m);
    });
    return liste;
  }

  // "Tekrar bak" denen madde yarın tekrar listesine düşer (yalnızca soruyla bağlı maddeler).
  function maddeTekrar(id, konu) {
    var g = bugunNo(), r = ilerleme[id] || { k: 1, d: 0, y: 0 };
    r.t = true; r.k = 1; r.s = g + 1; r.kalici = false; r.n = konu;
    ilerleme[id] = r;
    kayit.yaz("yks-ilerleme", ilerleme);
  }

  function ozetBolumu(maddeler, sorular, semalar, k, arg) {
    var bolumler = bolumlereAyir(maddeler);
    var durum = ozetDurum[k.id] = ozetDurum[k.id] || {};
    if (arg[2] === "liste") return ozetListe(bolumler, k);
    var no = arg[2] != null ? parseInt(arg[2], 10) : -1;
    if (no >= 0 && bolumler[no]) return kartAkisi(bolumler, no, sorular, semalar, k, durum);

    var satirlar = bolumler.map(function (b, i) {
      var bil = b.maddeler.filter(function (m) { return durum[m.id] === "b"; }).length;
      var tek = b.maddeler.filter(function (m) { return durum[m.id] === "t"; }).length;
      var ek = bil + tek ? " · " + bil + " oturdu" + (tek ? ", " + tek + " tekrar" : "") : "";
      return h("a", { class: "test-satir ozet-satir", href: "#/konu/" + k.id + "/ozet/" + i },
        h("span", { class: "no kartno", "aria-hidden": "true" }, "▤"),
        h("span", { class: "bilgi" }, h("b", null, b.ad), h("small", null, b.maddeler.length + " kart" + ek)),
        bil + tek === b.maddeler.length ? h("span", { class: "tik", "aria-hidden": "true" }, "✓") : null);
    });
    return h("div", null,
      h("p", { class: "kucuk", style: "margin:0 4px 12px" }, "Bir bölüm seç, kartları tek tek gez. Bildiğine “Yess!”, oturmayana “Tam oturmadı sanki?” de."),
      h("div", { class: "test-liste" }, satirlar),
      h("a", { class: "link-dugme", href: "#/konu/" + k.id + "/ozet/liste" }, "Tek sayfa olarak oku"));
  }

  function ozetListe(bolumler, k) {
    return h("div", null,
      h("a", { class: "geri", href: "#/konu/" + k.id + "/ozet" }, "‹ Bölümler"),
      bolumler.map(function (b) {
        return h("section", { class: "kart ozet" }, h("h2", null, b.ad),
          h("ul", null, b.maddeler.map(function (m) { return h("li", null, m.bilgi); })));
      }));
  }

  // Bilgisayarda: ← tam oturmadı, → yess! (kart ekranındayken)
  document.addEventListener("keydown", function (e) {
    if (e.target && /input|textarea|select/i.test(e.target.tagName)) return;
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    var kart = document.querySelector(".bilgi-kart.kaydir");
    var dugmeler = document.querySelectorAll(".kart-dugmeler .dugme");
    if (!kart || dugmeler.length < 2) return;
    dugmeler[e.key === "ArrowRight" ? 1 : 0].click();
  });

  // Kartı sağa (biliyorum) ya da sola (tekrar bak) kaydırma. Parmakla, fareyle ve kalemle çalışır.
  function kaydirmaBagla(el, bitti) {
    var x0 = null, y0 = 0, dx = 0, yatay = false, bitirildi = false;
    function eslik() { return Math.min(110, Math.max(70, el.offsetWidth * 0.28)); }
    el.addEventListener("dragstart", function (e) { e.preventDefault(); });
    el.addEventListener("pointerdown", function (e) {
      if (e.button != null && e.button > 0) return;
      if (e.pointerType === "mouse") e.preventDefault(); // fareyle sürüklerken metin seçilmesin
      x0 = e.clientX; y0 = e.clientY; dx = 0; yatay = false;
      try { el.setPointerCapture(e.pointerId); } catch (x) {}
    });
    el.addEventListener("pointermove", function (e) {
      if (x0 == null || bitirildi) return;
      var ddx = e.clientX - x0, ddy = e.clientY - y0;
      if (!yatay) {
        if (Math.abs(ddx) < 8 && Math.abs(ddy) < 8) return;
        if (Math.abs(ddy) > Math.abs(ddx)) { x0 = null; return; } // dikey kaydırma: sayfa kayar
        yatay = true; el.classList.add("suruklenir");
      }
      dx = ddx;
      el.style.transform = "translateX(" + dx + "px) rotate(" + (dx / 28) + "deg)";
      var oran = Math.min(1, Math.abs(dx) / eslik());
      el.style.setProperty("--sag", dx > 0 ? oran : 0);
      el.style.setProperty("--sol", dx < 0 ? oran : 0);
    });
    function birak() {
      if (x0 == null) return;
      var gec = yatay && Math.abs(dx) >= eslik();
      x0 = null;
      if (!yatay) return;
      el.classList.remove("suruklenir");
      if (gec) {
        bitirildi = true;
        var yon = dx > 0 ? "sag" : "sol";
        el.style.transform = "translateX(" + (dx > 0 ? 130 : -130) + "%) rotate(" + (dx > 0 ? 12 : -12) + "deg)";
        el.style.opacity = "0";
        setTimeout(function () { bitti(yon); }, 160);
      } else {
        el.style.transform = ""; el.style.setProperty("--sag", 0); el.style.setProperty("--sol", 0);
      }
    }
    el.addEventListener("pointerup", birak);
    el.addEventListener("pointercancel", birak);
  }

  function kartAkisi(bolumler, no, sorular, semalar, k, durum) {
    var b = bolumler[no];
    var idler = {}, bagli = {};
    b.maddeler.forEach(function (m) { idler[m.id] = 1; });
    sorular.forEach(function (q) { ogeIdleri(q).forEach(function (id) { bagli[id] = 1; }); });

    function maddeKartlari(liste) {
      var out = [];
      liste.forEach(function (m) {
        out.push({ tur: "madde", m: m });
        if (m.sema && semalar[m.sema]) out.push({ tur: "sema", ad: m.sema });
      });
      return out;
    }
    var kartlar = maddeKartlari(b.maddeler);
    // bölüm sonunda mini sorular (kısa bölümde 1, uzunda 2)
    var adaylar = karistir(sorular.filter(function (q) { return ogeIdleri(q).some(function (id) { return idler[id]; }); }));
    adaylar.slice(0, b.maddeler.length > 5 ? 2 : 1).forEach(function (q) { kartlar.push({ tur: "soru", q: q, s: soruHazirla(q), secim: null }); });

    var i = 0;
    for (var j = 0; j < kartlar.length; j++) {
      if (kartlar[j].tur === "madde" && !durum[kartlar[j].m.id]) { i = j; break; }
    }
    var kap = h("div", { class: "kart-kap" });

    function ilerle() { i++; ciz(); }
    var kilit = false;
    function isaretle(m, deger) {
      if (kilit) return; kilit = true; // kart uçarken ikinci işaret sayılmasın
      durum[m.id] = deger; ozetKaydet();
      if (deger === "t" && bagli[m.id]) maddeTekrar(m.id, k.id);
      ilerle();
    }

    function ciz() {
      kilit = false;
      kap.replaceChildren();
      window.scrollTo(0, 0);
      var ust = h("div", { class: "kart-ust" },
        h("a", { class: "geri", href: "#/konu/" + k.id + "/ozet" }, "‹ Bölümler"),
        h("span", { class: "kucuk" }, b.ad + (i < kartlar.length ? " · " + (i + 1) + "/" + kartlar.length : "")));
      kap.appendChild(ust);
      kap.appendChild(h("div", { class: "cubuk", "aria-hidden": "true" }, h("i", { style: "width:" + Math.min(100, i / kartlar.length * 100) + "%" })));

      if (i >= kartlar.length) { bitis(); return; }
      var kart = kartlar[i];

      if (kart.tur === "madde") {
        var m = kart.m;
        var kartEl = h("div", { class: "bilgi-kart kaydir" },
          h("span", { class: "damga sol", "aria-hidden": "true" }, "Tam oturmadı"),
          h("span", { class: "damga sag", "aria-hidden": "true" }, "Yess!"),
          h("p", { class: "bilgi" }, m.bilgi),
          m.ipucu ? h("div", { class: "not ipucu" }, h("b", null, "💡 İpucu"), h("span", null, m.ipucu)) : null,
          m.karisma ? h("div", { class: "not karisma" }, h("b", null, "🔎 Sık karıştırılır"), h("span", null, m.karisma)) : null);
        kaydirmaBagla(kartEl, function (yon) { isaretle(m, yon === "sag" ? "b" : "t"); });
        kap.appendChild(kartEl);
        kap.appendChild(h("p", { class: "kucuk kaydir-not" }, "← Tam oturmadı  ·  Yess! →"));
        kap.appendChild(h("div", { class: "kart-dugmeler" },
          h("button", { class: "dugme ikincil", type: "button", onclick: function () { isaretle(m, "t"); } }, "Tam oturmadı sanki?"),
          h("button", { class: "dugme", type: "button", onclick: function () { isaretle(m, "b"); } }, "Yess!")));
        if (i > 0) kap.appendChild(h("button", { class: "link-dugme", type: "button", onclick: function () { i--; ciz(); } }, "‹ Önceki kart"));
      } else if (kart.tur === "sema") {
        var sm = semalar[kart.ad];
        var kutu = h("div", { class: "sema" });
        kutu.innerHTML = sm.svg; // yalnızca kendi yazdığımız SVG
        kap.appendChild(h("div", { class: "bilgi-kart" }, h("p", { class: "kucuk" }, "Şema · " + sm.baslik), kutu));
        kap.appendChild(h("div", { class: "kart-dugmeler" }, h("button", { class: "dugme", type: "button", onclick: ilerle }, "Devam")));
        if (i > 0) kap.appendChild(h("button", { class: "link-dugme", type: "button", onclick: function () { i--; ciz(); } }, "‹ Önceki kart"));
      } else {
        var s = kart.s, q = kart.q, cevaplandi = kart.secim != null;
        kap.appendChild(h("div", { class: "soru-alani" },
          h("p", { class: "kucuk" }, "Mini soru · az önce okuduklarından"),
          h("p", { class: "soru-metin" }, q.soru),
          q.oncul ? h("ul", { class: "oncul" }, q.oncul.map(function (o) { return h("li", null, o); })) : null));
        var alt = h("div", { class: "alt-alan" });
        if (cevaplandi) {
          var dogruMu = kart.secim === s.dogruYeri;
          alt.appendChild(h("div", { class: "geri-bildirim " + (dogruMu ? "iyi" : "tekrar") },
            h("b", null, dogruMu ? "Güzel, bu pekişti 🌿" : "Bunu tekrar listene ekledik, birlikte pekiştireceğiz."),
            q.dipnot ? h("p", null, q.dipnot) : null));
        }
        alt.appendChild(h("div", { class: "secenekler" }, s.sira.map(function (orj, poz) {
          var sinif = "secenek";
          if (cevaplandi) { if (poz === s.dogruYeri) sinif += " dogru"; else if (poz === kart.secim) sinif += " tekrar"; }
          return h("button", { class: sinif, type: "button", disabled: cevaplandi ? "" : false,
            onclick: function () {
              if (cevaplandi) return;
              kart.secim = poz; titret(poz === s.dogruYeri ? 12 : 25);
              cevapIsle(q, poz === s.dogruYeri); ciz();
            } },
            h("span", { class: "harf" }, HARFLER[poz]), h("span", { class: "metin" }, q.secenekler[orj]));
        })));
        if (cevaplandi) alt.appendChild(h("button", { class: "dugme", type: "button", onclick: ilerle }, "Devam"));
        kap.appendChild(alt);
        if (i > 0) kap.appendChild(h("button", { class: "link-dugme", type: "button", onclick: function () { i--; ciz(); } }, "‹ Önceki kart"));
      }
    }

    function bitis() {
      var bil = b.maddeler.filter(function (m) { return durum[m.id] === "b"; }).length;
      var tek = b.maddeler.filter(function (m) { return durum[m.id] === "t"; });
      var dugmeler = h("div", { class: "sonuc-dugmeler" });
      if (tek.length) {
        dugmeler.appendChild(h("button", { class: "dugme", type: "button", onclick: function () {
          kartlar = maddeKartlari(tek); i = 0; ciz();
        } }, "Oturmayanları tekrar gör (" + tek.length + ")"));
      }
      if (no + 1 < bolumler.length) dugmeler.appendChild(h("a", { class: "dugme" + (tek.length ? " ikincil" : ""), href: "#/konu/" + k.id + "/ozet/" + (no + 1) }, "Sonraki bölüm ›"));
      dugmeler.appendChild(h("a", { class: "dugme ikincil", href: "#/konu/" + k.id + "/calis" }, "Teste geç"));
      dugmeler.appendChild(h("a", { class: "dugme ikincil", href: "#/konu/" + k.id + "/ozet" }, "Bölümlere dön"));
      kap.appendChild(h("div", { class: "kart sonuc", style: "margin-top:16px" },
        h("h2", null, "Bölüm tamam 🌿"),
        h("p", { class: "alt" }, bil + " kart oturdu" + (tek.length ? ", " + tek.length + " kart tekrar listende." : "."))));
      kap.appendChild(dugmeler);
    }

    ciz();
    return kap;
  }

  function calisBolumu(sorular, konuAd, testler) {
    function baslat(baslik, liste, testId) {
      modSec(function (mod) { testBaslat(baslik, liste, mod, false, testId); });
    }
    var karisik = h("button", { class: "dugme ikincil", type: "button", style: "margin-top:12px",
      onclick: function () { baslat(konuAd + " · karışık", karistir(sorular)); } }, "Hepsini karışık çöz · " + sorular.length + " soru");
    if (!testler.length) {
      return h("div", { class: "kart" },
        h("h2", null, "Bu konudan yeni test"),
        h("p", { class: "alt" }, sorular.length + " soru hazır."),
        h("button", { class: "dugme", type: "button", style: "margin-top:16px", onclick: function () { baslat(konuAd, sorular); } }, "Teste başla"));
    }
    var sonuclar = kayit.oku("yks-testler", {});
    var satirlar = testler.map(function (t, i) {
      var liste = t.sorular.map(function (id) { return sorular.filter(function (q) { return q.id === id; })[0]; }).filter(Boolean);
      var son = sonuclar[t.id];
      return h("button", { class: "test-satir", type: "button", onclick: function () { baslat(konuAd + " · " + t.ad, liste, t.id); } },
        h("span", { class: "no", "aria-hidden": "true" }, String(i + 1)),
        h("span", { class: "bilgi" },
          h("b", null, t.ad),
          h("small", null, liste.length + " soru" + (son ? " · son tur " + son.d + "/" + son.n : ""))),
        son ? h("span", { class: "tik", "aria-hidden": "true" }, "✓") : null);
    });
    return h("div", null, h("div", { class: "test-liste" }, satirlar), karisik);
  }

  function tekrarBolumu(k, sorular) {
    var idler = bekleyenIdler(k.id);
    var secilen = [];
    idler.forEach(function (id) {
      var q = sorular.filter(function (x) { return ogeIdleri(x).indexOf(id) >= 0; })[0];
      if (q && secilen.indexOf(q) < 0) secilen.push(q);
    });
    if (!secilen.length) {
      return yakinda("🌤️", "Şimdilik tekrar bekleyen yok",
        "Bu konudan öğrendiklerin tekrar zamanı gelince burada görünecek.");
    }
    return h("div", { class: "kart" },
      h("h2", null, secilen.length + " madde seni bekliyor"),
      h("p", { class: "alt" }, "Birkaç soruyla hepsini tazeleyelim."),
      h("button", { class: "dugme", type: "button", style: "margin-top:16px",
        onclick: function () { modSec(function (mod) { testBaslat(k.ad + " · tekrar", secilen, mod); }); } }, "Tekrar et"));
  }

  /* ---------- test akışı ---------- */
  var HARFLER = ["A", "B", "C", "D", "E"];
  var T = null; // süren test; yalnızca bellekte
  var sonSayfa = "#/"; // teste girilmeden önceki sayfa: X ile oraya dönülür

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

  function testBaslat(baslik, sorular, mod, kisa, testId) {
    if (!sorular.length) { mesaj("Burada henüz soru yok, yakında 🌿"); return; }
    T = { baslik: baslik, mod: mod, liste: sorular.map(soruHazirla), i: 0, secim: [], kayitli: [], kisa: !!kisa, testId: testId || null };
    if (kisa) yarimKaydet();
    testGit();
  }

  // Ders dosyalarının hepsini yükleyip (olmayanlar sessizce atlanır) karışık soru listesi verir.
  function tumSorular(sonra) {
    var dosyalar = [];
    KONULAR.forEach(function (k) { if (dosyalar.indexOf(k.dosya) < 0) dosyalar.push(k.dosya); });
    Promise.all(dosyalar.map(dersYukle)).then(function (hepsi) {
      var sorular = [];
      hepsi.forEach(function (v) { sorular = sorular.concat(v.sorular); });
      sonra(karistir(sorular));
    });
  }

  // Kısa bir tur: önce tekrarı gelen maddeler, boşluk kalırsa hiç görülmemiş sorular.
  function kisaTurSorulari(hepsi, adet) {
    var secilen = [];
    karistir(bekleyenIdler()).forEach(function (id) {
      if (secilen.length >= adet) return;
      var adaylar = hepsi.filter(function (q) { return ogeIdleri(q).indexOf(id) >= 0 && secilen.indexOf(q) < 0; });
      if (adaylar.length) secilen.push(rastgele(adaylar));
    });
    hepsi.forEach(function (q) {
      if (secilen.length < adet && secilen.indexOf(q) < 0 && ogeIdleri(q).every(function (id) { return !ilerleme[id]; })) secilen.push(q);
    });
    if (secilen.length < Math.min(adet, 5)) { // yeterli yoksa, tur boş kalmasın diye kalanlardan tamamla
      hepsi.forEach(function (q) { if (secilen.length < adet && secilen.indexOf(q) < 0) secilen.push(q); });
    }
    return secilen;
  }

  /* ---------- yarım kalan kısa tur ---------- */
  function yarimKaydet() {
    if (!T || !T.kisa) return;
    kayit.yaz("yks-yarim", {
      baslik: T.baslik, mod: T.mod, i: T.i, secim: T.secim, kayitli: T.kayitli,
      liste: T.liste.map(function (s) { return { id: s.q.id, sira: s.sira }; })
    });
  }
  function yarimTemizle() { try { localStorage.removeItem("yks-yarim"); } catch (e) {} }
  function yarimDevam() {
    var y = kayit.oku("yks-yarim", null);
    if (!y) return;
    tumSorular(function (hepsi) {
      var liste = [];
      y.liste.forEach(function (o) {
        var q = hepsi.filter(function (x) { return x.id === o.id; })[0];
        if (q) liste.push({ q: q, sira: o.sira, dogruYeri: o.sira.indexOf(q.dogru) });
      });
      if (liste.length !== y.liste.length || y.i >= liste.length) { yarimTemizle(); mesaj("Yarım kalan tur bulunamadı, yeni bir tane başlatalım 🌿"); return; }
      T = { baslik: y.baslik, mod: y.mod, liste: liste, i: y.i, secim: y.secim || [], kayitli: y.kayitli || [], kisa: true };
      testGit();
    });
  }

  // Cevap, ilk kez kilitlendiği anda yerel kayda işlenir (aynı soru iki kez sayılmaz).
  function cevabiKaydet(i) {
    if (T.kayitli[i] || T.secim[i] == null) return;
    T.kayitli[i] = true;
    cevapIsle(T.liste[i].q, T.secim[i] === T.liste[i].dogruYeri);
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
        h("button", { class: "kapat", type: "button", "aria-label": "Testten çık", onclick: function () { location.hash = sonSayfa || "#/"; } }, "✕"),
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
            if (T.mod === "anlik") { titret(poz === s.dogruYeri ? 12 : 25); cevabiKaydet(T.i); yarimKaydet(); }
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
        alt.appendChild(h("button", { class: "dugme", type: "button", onclick: function () { cevabiKaydet(T.i); T.i++; yarimKaydet(); ciz(); } },
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
    if (T.kisa) yarimTemizle();
    var n = T.liste.length, dogru = 0, yanlislar = [];
    T.liste.forEach(function (s, i) {
      if (T.secim[i] === s.dogruYeri) dogru++; else yanlislar.push(s);
    });
    var oran = n ? dogru / n * 100 : 0;
    if (T.testId && !T.sonucKaydedildi) {
      T.sonucKaydedildi = true;
      var tum = kayit.oku("yks-testler", {});
      tum[T.testId] = { d: dogru, n: n, g: bugunAnahtar() };
      kayit.yaz("yks-testler", tum);
    }
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
      var bekleyen = bekleyenIdler().length;
      var yarim = kayit.oku("yks-yarim", null);
      var bugunC = (gecmis[bugunAnahtar()] || { c: 0 }).c;

      // 1) selamlama + not
      var gece = karakterGece();
      var karakter = h("div", { class: "karakter " + (gece ? "gece" : "gunduz"), "aria-hidden": "true" });
      karakter.innerHTML = karakterSvg(gece); // kendi çizdiğimiz SVG
      var hero = h("section", { class: "hero" },
        h("div", { class: "hero-ust" },
          h("div", { class: "hero-yazi" },
            h("p", { class: "selam" }, selam()),
            h("h1", null, "Bugün biraz tekrar?")),
          karakter),
        notKarti());

      // 2) ilerleme: üç sade sayı + yumuşak çubuk (kart sayısı ders dosyaları yüklenince dolar)
      var cubukEl = h("i", { style: "width:0%" });
      var cubukYazi = h("span", null, "");
      var cubukKutu = h("div", { class: "ilerleme-alt", hidden: "" },
        h("div", { class: "ilerleme-yazi" }, h("span", null, "Oturan kartlar"), cubukYazi),
        h("div", { class: "cubuk", "aria-hidden": "true" }, cubukEl));
      var ilerlemeKart = h("section", { class: "kart ilerleme-kart" },
        h("h2", null, "İlerleme"),
        h("div", { class: "sayilar" },
          h("div", { class: "sayi-kutu" }, h("b", null, String(bugunC)), h("span", null, "bugün çözülen soru")),
          h("div", { class: "sayi-kutu" }, h("b", null, String(bekleyen)), h("span", null, "tekrarı bekleyen"))),
        cubukKutu);
      function ilerlemeDoldur() {
        var oturan = 0;
        Object.keys(ozetDurum).forEach(function (kid) {
          Object.keys(ozetDurum[kid]).forEach(function (m) { if (ozetDurum[kid][m] === "b") oturan++; });
        });
        var toplam = 0;
        Object.keys(toplamlar).forEach(function (kid) { toplam += toplamlar[kid]; });
        if (toplam) {
          cubukKutu.hidden = false;
          cubukYazi.textContent = oturan + " / " + toplam;
          cubukEl.style.width = Math.min(100, Math.round(oturan / toplam * 100)) + "%";
        }
      }
      ilerlemeDoldur();
      var dosyalar = [];
      KONULAR.forEach(function (k) { if (k.hazir && dosyalar.indexOf(k.dosya) < 0) dosyalar.push(k.dosya); });
      Promise.all(dosyalar.map(dersYukle)).then(ilerlemeDoldur);

      // 3) kısa tur
      var tur = h("section", { class: "tur" },
        yarim ? h("button", { class: "dugme buyuk", type: "button", onclick: yarimDevam },
          "Kaldığın yerden devam et ", h("span", { class: "kucuk", style: "color:inherit;opacity:.85" }, "· " + yarim.i + "/" + yarim.liste.length)) : null,
        h("button", { class: yarim ? "dugme buyuk ikincil" : "dugme buyuk", type: "button", onclick: function () {
          modSec(function (mod) { tumSorular(function (hepsi) { testBaslat("Kısa bir tur", kisaTurSorulari(hepsi, 8), mod, true); }); });
        } }, yarim ? "Yeni bir kısa tur" : "Kısa bir tura başla"),
        h("p", { class: "tur-alt" }, "2-3 dakika · önce tekrarı gelenler"));

      // 4) daha fazlası
      var hizli = h("div", { class: "hizli" },
        h("button", { class: "dugme ikincil", type: "button", onclick: function () { modSec(function (mod) { tumSorular(function (hepsi) { testBaslat("Karışık test", hepsi.slice(0, 20), mod); }); }); } }, "20 soruluk karışık test"),
        h("button", { class: "dugme ikincil", type: "button", onclick: function () { mesaj("Özelleştirme birazdan hazır 🌿"); } }, "Özelleştir"));

      return [
        hero,
        ilerlemeKart,
        tur,
        hizli,
        h("h2", { class: "bolum-baslik" }, "Dersler"),
        dersListesi()
      ];
    },
    konu: function (arg) {
      var k = KONULAR.filter(function (x) { return x.id === arg[0]; })[0];
      var geri = h("a", { class: "geri", href: "#/" }, "‹ Dersler");
      if (!k) return [geri, h("header", { class: "ust" }, h("h1", null, "Konu bulunamadı"))];

      var sekmeler = [["ozet", "Özet", "kart"], ["calis", "Test", "test"], ["tekrar", "Tekrar", "tekrar"]];
      var aciklama = { ozet: "Kart kart gez, bildiklerini ayır.", calis: "Sorularla bilgini sına.", tekrar: "Sırası gelen maddeleri tazele." };
      var secili = arg[1] === "calis" || arg[1] === "tekrar" ? arg[1] : "ozet";
      var icerik = h("div", { class: "konu-icerik" }, h("p", { class: "kucuk" }, "Yükleniyor…"));
      var cubuk = h("div", { class: "sekme-cubuk", role: "tablist" }, sekmeler.map(function (s) {
        return h("a", { href: "#/konu/" + k.id + "/" + s[0], role: "tab", "data-tur": s[2], "aria-selected": String(secili === s[0]) }, s[1]);
      }));
      var tanim = h("p", { class: "sekme-tanim", "data-tur": secili === "calis" ? "test" : secili === "ozet" ? "kart" : "tekrar" }, aciklama[secili]);

      dersYukle(k.dosya).then(function (veri) {
        var maddeler = veri.maddeler.filter(function (m) { return m.konu === k.id; });
        var sorular = veri.sorular.filter(function (q) { return q.konu === k.id; });
        icerik.replaceChildren();
        if (!maddeler.length && !sorular.length) {
          ekle(icerik, yakinda("🌿", "Bu konu hazırlanıyor", "İçerik kaynaklardan hazırlanınca burada olacak."));
        } else if (secili === "ozet") ekle(icerik, ozetBolumu(maddeler, sorular, veri.semalar || {}, k, arg));
        else if (secili === "calis") ekle(icerik, calisBolumu(sorular, k.ad, veri.testler.filter(function (t) { return t.konu === k.id; })));
        else ekle(icerik, tekrarBolumu(k, sorular));
      });

      // Kart akışında konu başlığı ve sekmeler gizlenir: kart ve düğmeler ekrana sığsın.
      if (secili === "ozet" && /^\d+$/.test(arg[2] || "")) return [icerik];
      return [
        geri,
        h("header", { class: "ust" },
          h("h1", null, k.ad),
          h("div", { class: "cubuk", "aria-hidden": "true" }, h("i", { style: "width:" + konuYuzde(k.id) + "%" })),
          rozetVarMi(k.id) ? h("p", { class: "kucuk", style: "margin-top:8px" }, "🏅 Bu konuda ustalaştın") : null),
        cubuk,
        tanim,
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
    if (ad !== "test") { T = null; document.body.classList.remove("testte"); sonSayfa = location.hash || "#/"; }
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

  /* ---------- güncelleme: "Yeni sürüm hazır" ve "Yenilikler" ---------- */
  // Anahtar: sürümün ana numarası ("1.0-dev10" için "1.0"). Her yayında buraya madde eklenir.
  var YENILIKLER = {
    "1.0": [
      "Yepyeni, sade ve sıcak bir görünüm",
      "Konulara göre özet kartları, testler ve tekrar: kartları sağa-sola kaydır",
      "Anlık geri bildirimli ya da sonda sonuçlu testler",
      "Unutmadan tekrar: öğrendiklerin doğru zamanda karşına çıkar"
    ]
  };

  function yenilikleriGoster() {
    var onceki = kayit.oku("yks-gorulen-surum", null);
    kayit.yaz("yks-gorulen-surum", SURUM);
    if (!onceki || onceki === SURUM) return; // ilk kurulumda gösterilmez
    var liste = YENILIKLER[SURUM.split("-")[0]];
    if (!liste) return;
    var perde = h("div", { class: "perde" },
      h("div", { class: "sheet", role: "dialog", "aria-label": "Yenilikler" },
        h("h2", null, "Yenilikler 💗"),
        h("ul", { class: "yenilik-liste" }, liste.map(function (m) { return h("li", null, m); })),
        h("button", { class: "dugme", type: "button", onclick: function () { perde.remove(); } }, "Tamam")));
    document.body.appendChild(perde);
  }

  function guncellemeBildir(bekleyen) {
    if (document.querySelector(".guncelleme")) return;
    var cubuk = h("div", { class: "guncelleme", role: "status" },
      h("span", null, "Yeni sürüm hazır 💗"),
      h("button", { type: "button", class: "yenile", onclick: function () { bekleyen.postMessage({ type: "SKIP_WAITING" }); } }, "Yenile"),
      h("button", { type: "button", class: "sonra", "aria-label": "Sonra", onclick: function () { cubuk.remove(); } }, "✕"));
    document.body.appendChild(cubuk);
  }

  if ("serviceWorker" in navigator) {
    var yenileniyor = false;
    navigator.serviceWorker.addEventListener("controllerchange", function () {
      if (yenileniyor || !navigator.serviceWorker.controller) return;
      yenileniyor = true;
      location.reload();
    });
    window.addEventListener("load", function () {
      navigator.serviceWorker.register("sw.js").then(function (reg) {
        if (reg.waiting && navigator.serviceWorker.controller) guncellemeBildir(reg.waiting);
        reg.addEventListener("updatefound", function () {
          var yeni = reg.installing;
          if (!yeni) return;
          yeni.addEventListener("statechange", function () {
            if (yeni.state === "installed" && navigator.serviceWorker.controller) guncellemeBildir(yeni);
          });
        });
        // Uygulama arka plandan açılınca yeni sürüm var mı diye bakar.
        document.addEventListener("visibilitychange", function () {
          if (document.visibilityState === "visible") reg.update().catch(function () {});
        });
      }).catch(function () {});
    });
  }
  yenilikleriGoster();
})();

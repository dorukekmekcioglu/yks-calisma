(function () {
  "use strict";

  var SURUM = "1.1.2"; // sw.js içindeki SURUM ile aynı tutulur
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
  // Soru metnindeki biçim işaretleri: __sözcük__ altı çizili, **sözcük** kalın. Güvenli: yalnız textContent ile kurulur.
  function bicimli(metin) {
    var parca = document.createDocumentFragment();
    String(metin).split(/(__[^_]+(?:_[^_]+)*__|\*\*[^*]+\*\*)/).forEach(function (p) {
      if (!p) return;
      if (p.length > 4 && p.slice(0, 2) === "__" && p.slice(-2) === "__") { var u = document.createElement("u"); u.textContent = p.slice(2, -2); parca.appendChild(u); }
      else if (p.length > 4 && p.slice(0, 2) === "**" && p.slice(-2) === "**") { var b = document.createElement("strong"); b.textContent = p.slice(2, -2); parca.appendChild(b); }
      else parca.appendChild(document.createTextNode(p));
    });
    return parca;
  }
  function rastgele(dizi) { return dizi[Math.floor(Math.random() * dizi.length)]; }

  function selam() {
    var s = new Date().getHours();
    var g = s < 6 ? "İyi geceler" : s < 12 ? "Günaydın" : s < 18 ? "İyi günler" : "İyi akşamlar";
    var isim = kayit.oku("yks-isim", "") || window.ISIM;
    return g + (isim ? ", " + isim : "");
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

  /* ---------- soru görselleri: harita (Türkiye, dünya), işaretli noktalar, ızgara ---------- */
  var haritaSozu = null;
  function haritaYukle() {
    if (window.HARITALAR) return Promise.resolve();
    if (!haritaSozu) {
      haritaSozu = new Promise(function (coz) {
        var el = document.createElement("script");
        el.src = "data/harita.js";
        el.onload = el.onerror = function () { coz(); };
        document.head.appendChild(el);
      });
    }
    return haritaSozu;
  }
  var SVGNS = "http://www.w3.org/2000/svg";
  function svgEl(ad, ozellik, metin) {
    var e = document.createElementNS(SVGNS, ad);
    Object.keys(ozellik || {}).forEach(function (k) { e.setAttribute(k, ozellik[k]); });
    if (metin != null) e.textContent = metin;
    return e;
  }
  // g: { harita: "turkiye"|"dunya", izgara: { paralel: [..], meridyen: [..] }, noktalar: [{ e: "K", lon, lat }],
  //      cizgiler: [{ nokta: [[lon,lat],..], ad }] }
  function haritaCiz(g) {
    var hr = window.HARITALAR && window.HARITALAR[g.harita];
    if (!hr) return null;
    var X = function (lon) { return (lon - hr.lon0) * hr.sx; };
    var Y = function (lat) { return (hr.lat0 - lat) * hr.sy; };
    var sv = svgEl("svg", { viewBox: "0 0 " + hr.w + " " + hr.h, role: "img", "aria-label": "Harita" });
    sv.appendChild(svgEl("rect", { width: hr.w, height: hr.h, rx: 12, fill: "var(--yuzey-2)" }));
    if (hr.komsu) sv.appendChild(svgEl("path", { d: hr.komsu, fill: "var(--cizgi)", stroke: "var(--yuzey)", "stroke-width": ".8" }));
    sv.appendChild(svgEl("path", { d: hr.yol, fill: g.harita === "turkiye" ? "var(--vurgu-acik)" : "var(--cizgi)", stroke: g.harita === "turkiye" ? "var(--vurgu)" : "var(--soluk)", "stroke-width": g.harita === "turkiye" ? "1.4" : ".5", "stroke-linejoin": "round" }));
    var iz = g.izgara || {};
    (iz.paralel || []).forEach(function (la) {
      sv.appendChild(svgEl("line", { x1: 0, x2: hr.w, y1: Y(la), y2: Y(la), stroke: "var(--soluk)", "stroke-width": ".8", "stroke-dasharray": "4 4", opacity: ".7" }));
      sv.appendChild(svgEl("text", { x: 6, y: Y(la) - 4, "font-size": "13", fill: "var(--soluk)" }, Math.abs(la) + "°" + (la < 0 ? "G" : la > 0 ? "K" : "")));
    });
    (iz.meridyen || []).forEach(function (lo) {
      sv.appendChild(svgEl("line", { x1: X(lo), x2: X(lo), y1: 0, y2: hr.h, stroke: "var(--soluk)", "stroke-width": ".8", "stroke-dasharray": "4 4", opacity: ".7" }));
      sv.appendChild(svgEl("text", { x: X(lo) + 3, y: hr.h - 6, "font-size": "13", fill: "var(--soluk)" }, Math.abs(lo) + "°" + (lo < 0 ? "B" : lo > 0 ? "D" : "")));
    });
    (g.cizgiler || []).forEach(function (c) {
      var d = c.nokta.map(function (p, i) { return (i ? "L" : "M") + X(p[0]).toFixed(1) + " " + Y(p[1]).toFixed(1); }).join("");
      sv.appendChild(svgEl("path", { d: d, fill: "none", stroke: "var(--tekrar)", "stroke-width": "3", "stroke-linecap": "round", "stroke-linejoin": "round" }));
    });
    (g.noktalar || []).forEach(function (n) {
      var x = X(n.lon), y = Y(n.lat);
      sv.appendChild(svgEl("circle", { cx: x, cy: y, r: 11, fill: "var(--vurgu)", stroke: "var(--yuzey)", "stroke-width": "2" }));
      sv.appendChild(svgEl("text", { x: x, y: y + 5, "font-size": "14", "font-weight": "700", "text-anchor": "middle", fill: "var(--vurgu-yazi)" }, n.e));
    });
    return sv;
  }
  // g.iklimler: [{ e: "K", s: [12 aylık sıcaklık °C], y: [12 aylık yağış mm] }]  (1-4 grafik)
  var AYLAR = ["O", "Ş", "M", "N", "M", "H", "T", "A", "E", "E", "K", "A"];
  function iklimCiz(g) {
    var L = g.iklimler, tek = L.length === 1;
    var pw = tek ? 330 : 190, ph = tek ? 200 : 150, kol = tek ? 1 : 2;
    var sat = Math.ceil(L.length / kol);
    var sv = svgEl("svg", { viewBox: "0 0 " + pw * kol + " " + ph * sat, role: "img", "aria-label": "İklim grafiği" });
    sv.appendChild(svgEl("rect", { width: pw * kol, height: ph * sat, rx: 12, fill: "var(--yuzey-2)" }));
    L.forEach(function (c, i) {
      var ox = (i % kol) * pw, oy = Math.floor(i / kol) * ph;
      var sol = 34, sag = 34, ust = tek ? 26 : 24, alt = 22;
      var W = pw - sol - sag, H = ph - ust - alt;
      var tmin = Math.floor(Math.min.apply(null, c.s) / 10) * 10, tmax = Math.ceil(Math.max.apply(null, c.s) / 10) * 10;
      if (tmin > 0) tmin = 0; if (tmax - tmin < 20) tmax = tmin + 20;
      var ymax = Math.max.apply(null, c.y), ytop = ymax <= 100 ? 100 : Math.ceil(ymax / 100) * 100;
      var TY = function (t) { return oy + ust + H - (t - tmin) / (tmax - tmin) * H; };
      var PY = function (p) { return oy + ust + H - p / ytop * H; };
      var fs = tek ? 11 : 9;
      sv.appendChild(svgEl("text", { x: ox + pw / 2, y: oy + 15, "font-size": tek ? 12 : 11, "font-weight": "700", "text-anchor": "middle", fill: "var(--yazi)" }, c.e || ""));
      for (var t = tmin; t <= tmax; t += 10) {
        sv.appendChild(svgEl("line", { x1: ox + sol, x2: ox + sol + W, y1: TY(t), y2: TY(t), stroke: "var(--cizgi)", "stroke-width": ".6" }));
        sv.appendChild(svgEl("text", { x: ox + sol - 4, y: TY(t) + 3, "font-size": fs, "text-anchor": "end", fill: "var(--soluk)" }, String(t)));
      }
      var adim = ytop / ((tmax - tmin) / 10);
      for (var k = 0; k <= (tmax - tmin) / 10; k++) {
        sv.appendChild(svgEl("text", { x: ox + sol + W + 4, y: TY(tmin + k * 10) + 3, "font-size": fs, fill: "var(--soluk)" }, String(Math.round(k * adim))));
      }
      var bw = W / 12;
      c.y.forEach(function (p, j) {
        var yy = PY(p * (ytop / ytop));
        sv.appendChild(svgEl("rect", { x: ox + sol + j * bw + bw * .18, y: yy, width: bw * .64, height: Math.max(0, oy + ust + H - yy), fill: "#8fb8d8", opacity: ".85" }));
      });
      var d = c.s.map(function (v, j) { return (j ? "L" : "M") + (ox + sol + j * bw + bw / 2).toFixed(1) + " " + TY(v).toFixed(1); }).join("");
      sv.appendChild(svgEl("path", { d: d, fill: "none", stroke: "#d9774e", "stroke-width": "2.2", "stroke-linejoin": "round", "stroke-linecap": "round" }));
      c.s.forEach(function (v, j) { sv.appendChild(svgEl("circle", { cx: ox + sol + j * bw + bw / 2, cy: TY(v), r: 2.2, fill: "#d9774e" })); });
      AYLAR.forEach(function (a, j) { sv.appendChild(svgEl("text", { x: ox + sol + j * bw + bw / 2, y: oy + ph - 7, "font-size": fs, "text-anchor": "middle", fill: "var(--soluk)" }, a)); });
      sv.appendChild(svgEl("text", { x: ox + sol - 4, y: oy + ust - 6, "font-size": fs - 1, "text-anchor": "end", fill: "#d9774e" }, "°C"));
      sv.appendChild(svgEl("text", { x: ox + sol + W + 4, y: oy + ust - 6, "font-size": fs - 1, fill: "#5b8db8" }, "mm"));
    });
    return sv;
  }
  function gorselKutu(q) {
    if (!q.gorsel) return null;
    var kutu = h("div", { class: "soru-gorsel" });
    if (q.gorsel.iklimler) { kutu.appendChild(iklimCiz(q.gorsel)); return kutu; }
    if (q.gorsel.svg) { kutu.innerHTML = q.gorsel.svg; return kutu; } // yalnızca kendi çizdiğimiz SVG
    haritaYukle().then(function () {
      var sv = haritaCiz(q.gorsel);
      if (sv) kutu.appendChild(sv);
    });
    return kutu;
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
  // "Oturan" bilgi: özette "Yess!" denen ya da testlerde tekrar tekrar doğru yapılan maddeler.
  function oturanSay(konuId) {
    var kume = {};
    Object.keys(ozetDurum).forEach(function (kid) {
      if (konuId && kid !== konuId) return;
      Object.keys(ozetDurum[kid]).forEach(function (m) { if (ozetDurum[kid][m] === "b") kume[m] = 1; });
    });
    Object.keys(ilerleme).forEach(function (id) {
      var r = ilerleme[id];
      if (konuId && r.n !== konuId) return;
      if (!r.t && (r.k >= 3 || r.kalici)) kume[id] = 1;
    });
    return Object.keys(kume).length;
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
    // 3 karttan az olan bölümler, yan yana olanlarla ortak bir bölümde toplanır.
    var sonuc = [], grup = null;
    function grubuBitir() {
      if (!grup) return;
      if (grup.maddeler.length < 3 && sonuc.length) {
        var onceki = sonuc[sonuc.length - 1];
        onceki.maddeler = onceki.maddeler.concat(grup.maddeler);
        if (onceki.parca) { onceki.parca += grup.parca; onceki.ad = onceki.ilk + " (+" + (onceki.parca - 1) + " başlık)"; }
      } else {
        if (grup.parca > 1) grup.ad = grup.ilk + " (+" + (grup.parca - 1) + " başlık)";
        sonuc.push(grup);
      }
      grup = null;
    }
    liste.forEach(function (b) {
      if (b.maddeler.length >= 3) { grubuBitir(); sonuc.push(b); return; }
      if (!grup) grup = { ad: b.ad, ilk: b.ad, parca: 0, maddeler: [] };
      grup.parca++;
      grup.maddeler = grup.maddeler.concat(b.maddeler);
      if (grup.maddeler.length >= 3) grubuBitir();
    });
    grubuBitir();
    return sonuc;
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
          h("p", { class: "soru-metin" }, bicimli(q.soru)),
          q.oncul ? h("ul", { class: "oncul" }, q.oncul.map(function (o) { return h("li", null, bicimli(o)); })) : null,
          gorselKutu(q)));
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
            h("span", { class: "harf" }, HARFLER[poz]), h("span", { class: "metin" }, bicimli(q.secenekler[orj])));
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

  // Soruyu bulmaya yetecek bilgiyi panoya kopyalar; kullanıcı bunu geliştiriciye iletir.
  function sorunBildir(q) {
    var metin = "Soru sorunu\nKimlik: " + q.id + "\nSoru: " + q.soru + "\n" +
      q.secenekler.map(function (x, i) { return HARFLER[i] + ") " + x; }).join("\n") +
      "\nKayıtlı doğru: " + HARFLER[q.dogru] + "\nSürüm: " + SURUM;
    function bitti() { mesaj("Soru bilgisi kopyalandı. Bana yapıştırman yeterli 🌿"); }
    try {
      navigator.clipboard.writeText(metin).then(bitti, function () { prompt("Bunu kopyala:", metin); });
    } catch (e) { prompt("Bunu kopyala:", metin); }
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
        h("p", { class: "soru-metin" }, bicimli(q.soru)),
        q.oncul ? h("ul", { class: "oncul" }, q.oncul.map(function (o) { return h("li", null, bicimli(o)); })) : null,
        gorselKutu(q));

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
          h("span", { class: "metin" }, bicimli(q.secenekler[orj])));
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
        alt.appendChild(h("button", { class: "link-dugme kucuk-baglanti", type: "button", onclick: function () { sorunBildir(q); } }, "Bu soruda bir sorun var"));
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
          h("p", { class: "soru-ozet" }, bicimli(s.q.soru)),
          h("p", { class: "dogru-cevap" }, "Doğrusu: " + HARFLER[s.dogruYeri] + ") ", bicimli(s.q.secenekler[s.sira[s.dogruYeri]])),
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

  /* ---------- Mola: başkent bul ---------- */
  function molaMenu(kap) {
    kap.replaceChildren();
    var kita = kayit.oku("yks-mola-kita", "hepsi");
    var kitaGrup = h("div", { class: "etiketler" });
    function kitaCiz() {
      kitaGrup.replaceChildren();
      (window.MOLA_KITALAR || []).forEach(function (x) {
        kitaGrup.appendChild(h("button", { class: "etiket secilebilir", type: "button", "aria-pressed": String(kita === x[0]),
          onclick: function () { kita = x[0]; kayit.yaz("yks-mola-kita", kita); kitaCiz(); } }, x[1]));
      });
    }
    kitaCiz();
    function oyunKart(ikon, baslik, alt, yon) {
      return h("button", { class: "oyun-kart", type: "button", onclick: function () { molaTur(kap, yon, kita); } },
        h("span", { class: "oyun-ikon", "aria-hidden": "true" }, ikon),
        h("span", { class: "oyun-metin" }, h("b", null, baslik), h("small", null, alt)));
    }
    kap.appendChild(h("p", { class: "kucuk", style: "margin:0 4px 14px" }, "Haritalarla rahat bir köşe. Süre yok, puan yok; haritayı sürükleyip + − ile yakınlaştırabilirsin."));
    kap.appendChild(h("h2", { class: "bolum-baslik" }, "Bölge seç"));
    kap.appendChild(kitaGrup);
    kap.appendChild(h("h2", { class: "bolum-baslik" }, "Oyunlar"));
    kap.appendChild(oyunKart("🏛️", "Başkent bul", "Ülkenin başkentini seç", "ub"));
    kap.appendChild(oyunKart("🌍", "Hangi ülke?", "Başkentin hangi ülkenin olduğunu seç", "bu"));
    kap.appendChild(h("button", { class: "oyun-kart", type: "button", onclick: function () { molaHarita(kap, "ad", kita); } },
      h("span", { class: "oyun-ikon", "aria-hidden": "true" }, "🗺️"),
      h("span", { class: "oyun-metin" }, h("b", null, "Haritada hangisi?"), h("small", null, "Renkli ülkenin adını seç"))));
    kap.appendChild(h("button", { class: "oyun-kart", type: "button", onclick: function () { molaHarita(kap, "dokun", kita); } },
      h("span", { class: "oyun-ikon", "aria-hidden": "true" }, "👆"),
      h("span", { class: "oyun-metin" }, h("b", null, "Haritada göster"), h("small", null, "Adı verilen ülkeye dokun"))));
    // Türkiye yer şekilleri
    var trTur = kayit.oku("yks-mola-trtur", "hepsi");
    var trGrup = h("div", { class: "etiketler" });
    function trCiz() {
      trGrup.replaceChildren();
      (window.TR_TURLER || [["hepsi", "Hepsi"], ["dag", "Dağlar"], ["ova", "Ovalar"], ["plato", "Platolar"], ["gol", "Göller"], ["akarsu", "Akarsular"]]).forEach(function (x) {
        trGrup.appendChild(h("button", { class: "etiket secilebilir", type: "button", "aria-pressed": String(trTur === x[0]),
          onclick: function () { trTur = x[0]; kayit.yaz("yks-mola-trtur", trTur); trCiz(); } }, x[1]));
      });
    }
    trCiz();
    kap.appendChild(h("h2", { class: "bolum-baslik" }, "Türkiye'nin yer şekilleri"));
    kap.appendChild(trGrup);
    kap.appendChild(h("button", { class: "oyun-kart", type: "button", onclick: function () { molaTurkiye(kap, "ad", trTur); } },
      h("span", { class: "oyun-ikon", "aria-hidden": "true" }, "⛰️"),
      h("span", { class: "oyun-metin" }, h("b", null, "İşaretli yer hangisi?"), h("small", null, "Haritadaki yerin adını seç"))));
    kap.appendChild(h("button", { class: "oyun-kart", type: "button", onclick: function () { molaTurkiye(kap, "dokun", trTur); } },
      h("span", { class: "oyun-ikon", "aria-hidden": "true" }, "📍"),
      h("span", { class: "oyun-metin" }, h("b", null, "Haritada göster"), h("small", null, "Adı verilen yere dokun"))));
    // Dünya: boğaz, deniz, körfez, ada, yarımada
    var dTur = kayit.oku("yks-mola-dtur", "hepsi");
    var dGrup = h("div", { class: "etiketler" });
    function dCiz() {
      dGrup.replaceChildren();
      (window.DUNYA_TURLER || [["hepsi", "Hepsi"], ["bogaz", "Boğaz ve kanallar"], ["deniz", "Denizler"], ["korfez", "Körfezler"], ["ada", "Adalar"], ["yarimada", "Yarımadalar"], ["col", "Çöller"], ["dag", "Dağlar"]]).forEach(function (x) {
        dGrup.appendChild(h("button", { class: "etiket secilebilir", type: "button", "aria-pressed": String(dTur === x[0]),
          onclick: function () { dTur = x[0]; kayit.yaz("yks-mola-dtur", dTur); dCiz(); } }, x[1]));
      });
    }
    dCiz();
    kap.appendChild(h("h2", { class: "bolum-baslik" }, "Dünya haritasında yerler"));
    kap.appendChild(dGrup);
    kap.appendChild(h("button", { class: "oyun-kart", type: "button", onclick: function () { molaYer(kap, "ad", dTur, YER_CFG.dunya); } },
      h("span", { class: "oyun-ikon", "aria-hidden": "true" }, "🌊"),
      h("span", { class: "oyun-metin" }, h("b", null, "İşaretli yer hangisi?"), h("small", null, "Haritadaki yerin adını seç"))));
    kap.appendChild(h("button", { class: "oyun-kart", type: "button", onclick: function () { molaYer(kap, "dokun", dTur, YER_CFG.dunya); } },
      h("span", { class: "oyun-ikon", "aria-hidden": "true" }, "📍"),
      h("span", { class: "oyun-metin" }, h("b", null, "Haritada göster"), h("small", null, "Adı verilen yere dokun"))));
    kap.appendChild(h("p", { class: "kucuk", style: "margin:14px 4px 0" }, "Konumlar yaklaşıktır; dokunma oyununda biraz pay verilir."));
  }

  function molaTur(kap, yon, kita) {
    var tum = (window.MOLA_ULKELER || []);
    var havuz = tum.filter(function (u) { return kita === "hepsi" || u[2] === kita; });
    if (havuz.length < 5) havuz = tum;
    var N = Math.min(10, havuz.length);
    var sorular = karistir(havuz).slice(0, N).map(function (u) {
      var yanit = yon === "ub" ? u[1] : u[0];
      var digerleri = karistir(havuz.filter(function (x) { return x !== u && (yon === "ub" ? x[1] : x[0]) !== yanit; })).slice(0, 4)
        .map(function (x) { return yon === "ub" ? x[1] : x[0]; });
      var sec = karistir([yanit].concat(digerleri));
      return { u: u, yanit: yanit, sec: sec, soru: yon === "ub" ? u[0] + " ülkesinin başkenti neresidir?" : u[1] + " hangi ülkenin başkentidir?" };
    });
    var i = 0, dogru = 0, kacan = [];
    function ciz() {
      kap.replaceChildren();
      if (i >= N) { sonuc(); return; }
      var s = sorular[i], secildi = null;
      var secenekKutu = h("div", { class: "secenekler" });
      var geri = h("div", { class: "geri-yer" });
      var devam = h("button", { class: "dugme", type: "button", hidden: "", onclick: function () { i++; ciz(); } }, i === N - 1 ? "Bitir" : "Devam");
      s.sec.forEach(function (m, p) {
        var b = h("button", { class: "secenek", type: "button", onclick: function () {
          if (secildi !== null) return;
          secildi = p; titret(m === s.yanit ? 12 : 25);
          Array.prototype.forEach.call(secenekKutu.children, function (bb, q) {
            bb.disabled = true;
            if (s.sec[q] === s.yanit) bb.classList.add("dogru");
            else if (q === p) bb.classList.add("tekrar");
          });
          if (m === s.yanit) { dogru++; geri.textContent = "Güzel 🌿"; }
          else { kacan.push(s); geri.textContent = "Doğrusu: " + s.yanit; }
          devam.hidden = false;
        } }, h("span", { class: "harf", "aria-hidden": "true" }, HARFLER[p]), h("span", { class: "metin" }, m));
        secenekKutu.appendChild(b);
      });
      kap.appendChild(h("div", { class: "mola-ust" },
        h("button", { class: "kapat", type: "button", "aria-label": "Keşfe dön", onclick: function () { molaMenu(kap); } }, "✕"),
        h("span", { class: "kucuk" }, (i + 1) + " / " + N)));
      kap.appendChild(h("div", { class: "kart mola-soru" }, h("p", { class: "soru-metin" }, s.soru)));
      kap.appendChild(secenekKutu);
      kap.appendChild(geri);
      kap.appendChild(devam);
    }
    function sonuc() {
      kap.replaceChildren();
      kap.appendChild(h("div", { class: "kart" },
        h("h2", null, N + " sorudan " + dogru + "'i oturdu"),
        h("p", { class: "alt" }, kacan.length ? "Şunlara bir daha göz atalım:" : "Hepsi yerli yerinde, harika 🌿")));
      if (kacan.length) {
        kap.appendChild(h("div", { class: "kart" }, kacan.map(function (s) {
          return h("p", { class: "kacan" }, h("b", null, s.u[0]), " → ", s.u[1]);
        })));
      }
      kap.appendChild(h("button", { class: "dugme", type: "button", onclick: function () { molaTur(kap, yon, kita); } }, "Bir tur daha"));
      kap.appendChild(h("button", { class: "dugme ikincil", type: "button", onclick: function () { molaMenu(kap); } }, "Keşif menüsü"));
    }
    ciz();
  }

  /* ---------- harita yakınlaştırma: + / − düğmeleri, sürükleme, iki parmakla büyütme, fare tekerleği ---------- */
  function yakinlastirmaBagla(kutu, sv, tam) { // tam: [x, y, genişlik, yükseklik] (en geniş görünüm)
    var vb = sv.getAttribute("viewBox").split(" ").map(Number), ilk = vb.slice();
    var asp = vb[3] / vb[2], enGenis = Math.min(tam[2], tam[3] / asp), enDar = enGenis / 10;
    var ptr = {}, bastir = false, hareket = 0;
    function uygula() {
      vb[2] = Math.max(enDar, Math.min(enGenis, vb[2])); vb[3] = vb[2] * asp;
      vb[0] = Math.max(tam[0], Math.min(tam[0] + tam[2] - vb[2], vb[0]));
      vb[1] = Math.max(tam[1], Math.min(tam[1] + tam[3] - vb[3], vb[1]));
      sv.setAttribute("viewBox", vb.map(function (x) { return +x.toFixed(2); }).join(" "));
    }
    function olc() { var r = sv.getBoundingClientRect(); return { r: r, o: Math.max(vb[2] / r.width, vb[3] / r.height) }; }
    function yakin(faktor, cx, cy) {
      var m = olc(), ox = (m.r.width - vb[2] / m.o) / 2, oy = (m.r.height - vb[3] / m.o) / 2;
      var px = vb[0] + (cx - m.r.left - ox) * m.o, py = vb[1] + (cy - m.r.top - oy) * m.o;
      var nw = Math.max(enDar, Math.min(enGenis, vb[2] / faktor)), oran = nw / vb[2];
      vb[0] = px - (px - vb[0]) * oran; vb[1] = py - (py - vb[1]) * oran; vb[2] = nw;
      uygula();
    }
    function merkez(f) { var r = sv.getBoundingClientRect(); yakin(f, r.left + r.width / 2, r.top + r.height / 2); }
    sv.style.touchAction = "none";
    sv.addEventListener("click", function (e) { if (bastir) { e.stopPropagation(); e.preventDefault(); bastir = false; } }, true);
    sv.addEventListener("wheel", function (e) { e.preventDefault(); yakin(e.deltaY < 0 ? 1.25 : 0.8, e.clientX, e.clientY); }, { passive: false });
    sv.addEventListener("pointerdown", function (e) {
      bastir = false; hareket = 0; ptr[e.pointerId] = { x: e.clientX, y: e.clientY };
      function tasi(ev) {
        var p = ptr[ev.pointerId]; if (!p) return;
        var idler = Object.keys(ptr);
        if (idler.length === 1) {
          var dx = ev.clientX - p.x, dy = ev.clientY - p.y; hareket += Math.abs(dx) + Math.abs(dy);
          if (hareket > 8) { bastir = true; var m = olc(); vb[0] -= dx * m.o; vb[1] -= dy * m.o; uygula(); }
        } else if (idler.length === 2) {
          var d0 = Math.hypot(ptr[idler[0]].x - ptr[idler[1]].x, ptr[idler[0]].y - ptr[idler[1]].y);
          ptr[ev.pointerId] = { x: ev.clientX, y: ev.clientY };
          var d1 = Math.hypot(ptr[idler[0]].x - ptr[idler[1]].x, ptr[idler[0]].y - ptr[idler[1]].y);
          bastir = true;
          if (d0 > 0) yakin(d1 / d0, (ptr[idler[0]].x + ptr[idler[1]].x) / 2, (ptr[idler[0]].y + ptr[idler[1]].y) / 2);
          return;
        }
        ptr[ev.pointerId] = { x: ev.clientX, y: ev.clientY };
      }
      function bitir(ev) { delete ptr[ev.pointerId]; if (!Object.keys(ptr).length) { document.removeEventListener("pointermove", tasi); document.removeEventListener("pointerup", bitir); document.removeEventListener("pointercancel", bitir); } }
      document.addEventListener("pointermove", tasi); document.addEventListener("pointerup", bitir); document.addEventListener("pointercancel", bitir);
    });
    kutu.classList.add("yakinlastirilir");
    kutu.appendChild(h("div", { class: "zoom-dugmeler" },
      h("button", { type: "button", "aria-label": "Yakınlaştır", onclick: function () { merkez(1.6); } }, "+"),
      h("button", { type: "button", "aria-label": "Uzaklaştır", onclick: function () { merkez(0.625); } }, "−"),
      h("button", { type: "button", "aria-label": "Sıfırla", onclick: function () { vb = ilk.slice(); uygula(); } }, "⟲")));
  }
  // Ekrandaki dokunma noktasını SVG koordinatına çevirir (güncel viewBox'a göre).
  function svNokta(sv, e) {
    var b = sv.viewBox.baseVal, r = sv.getBoundingClientRect(), o = Math.max(b.width / r.width, b.height / r.height);
    return [b.x + (e.clientX - r.left - (r.width - b.width / o) / 2) * o, b.y + (e.clientY - r.top - (r.height - b.height / o) / 2) * o];
  }

  /* ---------- Mola: haritada ülke ---------- */
  var KITA_KUTU = { // [boylam0, boylam1, enlem0, enlem1]
    hepsi: [-170, 180, -58, 84], av: [-25, 45, 34, 72], as: [25, 150, -11, 58], af: [-20, 52, -36, 38],
    ka: [-140, -50, 6, 72], ga: [-83, -33, -57, 14], ok: [110, 180, -48, 0]
  };
  var ulkeSozu = null;
  function ulkeYukle() {
    if (window.ULKE_HARITA) return Promise.resolve();
    if (!ulkeSozu) {
      ulkeSozu = new Promise(function (coz) {
        var el = document.createElement("script");
        el.src = "data/ulkeler.js";
        el.onload = el.onerror = function () { coz(); };
        document.head.appendChild(el);
      });
    }
    return ulkeSozu;
  }

  function molaHarita(kap, mod, kita) {
    kap.replaceChildren();
    kap.appendChild(h("p", { class: "kucuk" }, "Harita hazırlanıyor…"));
    ulkeYukle().then(function () {
      var H = window.ULKE_HARITA;
      if (!H) { kap.replaceChildren(); kap.appendChild(h("p", { class: "kucuk" }, "Harita yüklenemedi, biraz sonra tekrar dene.")); return; }
      var esik = mod === "dokun" ? 6 : 1.5;
      var kitaSec = kita === "hepsi" ? null : kita;
      var havuz = H.adli.filter(function (u) { return (!kitaSec || u[1] === kitaSec) && u[2] >= (kitaSec ? esik : esik * 3); });
      if (havuz.length < 6) havuz = H.adli.filter(function (u) { return u[2] >= esik * 2; });
      var N = Math.min(10, havuz.length);
      var kutu = KITA_KUTU[kitaSec || "hepsi"];
      var vb = [(kutu[0] + 180) * 2, (84 - kutu[3]) * 2, (kutu[1] - kutu[0]) * 2, (kutu[3] - kutu[2]) * 2].join(" ");
      var sorular = karistir(havuz).slice(0, N);
      var i = 0, dogru = 0, kacan = [];

      function haritaKur(hedef, tikla) {
        var sv = svgEl("svg", { viewBox: vb, class: "ulke-harita", role: "img", "aria-label": "Dünya haritası" });
        sv.appendChild(svgEl("rect", { x: 0, y: 0, width: H.w, height: H.h, fill: "var(--yuzey-2)" }));
        sv.appendChild(svgEl("path", { d: H.arka, fill: "var(--cizgi)", stroke: "var(--yuzey)", "stroke-width": ".4" }));
        var yollar = {};
        H.adli.forEach(function (u) {
          var p = svgEl("path", { d: u[3], class: "ulke", fill: "var(--cizgi)", stroke: "var(--yuzey)", "stroke-width": ".4", "stroke-linejoin": "round" });
          if (tikla) p.addEventListener("click", function () { tikla(u, p); });
          yollar[u[0]] = p; sv.appendChild(p);
        });
        if (hedef && mod === "ad") yollar[hedef[0]].setAttribute("fill", "var(--vurgu)");
        return { sv: sv, yollar: yollar };
      }

      function ciz() {
        kap.replaceChildren();
        if (i >= N) { sonuc(); return; }
        var u = sorular[i], bitti = false;
        var geri = h("div", { class: "geri-yer" });
        var devam = h("button", { class: "dugme", type: "button", hidden: "", onclick: function () { i++; ciz(); } }, i === N - 1 ? "Bitir" : "Devam");
        var ust = h("div", { class: "mola-ust" },
          h("button", { class: "kapat", type: "button", "aria-label": "Keşfe dön", onclick: function () { molaMenu(kap); } }, "✕"),
          h("span", { class: "kucuk" }, (i + 1) + " / " + N));
        kap.appendChild(ust);

        if (mod === "ad") {
          var diger = karistir(havuz.filter(function (x) { return x !== u; })).slice(0, 4).map(function (x) { return x[0]; });
          var sec = karistir([u[0]].concat(diger));
          var hr = haritaKur(u, null);
          kap.appendChild(h("div", { class: "kart mola-soru" }, h("p", { class: "soru-metin" }, "Renkli ülke hangisi?")));
          var kutuAd = h("div", { class: "harita-kutu" }, hr.sv); kap.appendChild(kutuAd); yakinlastirmaBagla(kutuAd, hr.sv, [0, 0, H.w, H.h]);
          var secenekKutu = h("div", { class: "secenekler" });
          sec.forEach(function (m, p) {
            secenekKutu.appendChild(h("button", { class: "secenek", type: "button", onclick: function () {
              if (bitti) return; bitti = true; titret(m === u[0] ? 12 : 25);
              Array.prototype.forEach.call(secenekKutu.children, function (bb, q) {
                bb.disabled = true;
                if (sec[q] === u[0]) bb.classList.add("dogru"); else if (q === p) bb.classList.add("tekrar");
              });
              if (m === u[0]) { dogru++; geri.textContent = "Güzel 🌿"; } else { kacan.push(u); geri.textContent = "Doğrusu: " + u[0]; }
              devam.hidden = false;
            } }, h("span", { class: "harf", "aria-hidden": "true" }, HARFLER[p]), h("span", { class: "metin" }, m)));
          });
          kap.appendChild(secenekKutu);
        } else {
          kap.appendChild(h("div", { class: "kart mola-soru" }, h("p", { class: "soru-metin" }, "Haritada " + u[0] + " nerede?")));
          var hr2 = haritaKur(u, function (secilen, yol) {
            if (bitti) return; bitti = true; titret(secilen === u ? 12 : 25);
            if (secilen === u) { dogru++; yol.setAttribute("fill", "var(--iyi)"); geri.textContent = "Güzel 🌿"; }
            else {
              kacan.push(u); yol.setAttribute("fill", "var(--tekrar-acik)");
              hr2.yollar[u[0]].setAttribute("fill", "var(--iyi)");
              geri.textContent = "Burası " + secilen[0]; // dokunduğu ülke; doğrusu yeşil gösterilir
              geri.textContent += ". " + u[0] + " yeşil işaretli yer.";
            }
            devam.hidden = false;
          });
          var kutuDokun = h("div", { class: "harita-kutu" }, hr2.sv); kap.appendChild(kutuDokun); yakinlastirmaBagla(kutuDokun, hr2.sv, [0, 0, H.w, H.h]);
        }
        kap.appendChild(geri);
        kap.appendChild(devam);
      }

      function sonuc() {
        kap.replaceChildren();
        kap.appendChild(h("div", { class: "kart" },
          h("h2", null, N + " sorudan " + dogru + "'i oturdu"),
          h("p", { class: "alt" }, kacan.length ? "Şunlara bir daha göz atalım:" : "Hepsi yerli yerinde, harika 🌿")));
        if (kacan.length) kap.appendChild(h("div", { class: "kart" }, kacan.map(function (x) { return h("p", { class: "kacan" }, h("b", null, x[0])); })));
        kap.appendChild(h("button", { class: "dugme", type: "button", onclick: function () { molaHarita(kap, mod, kita); } }, "Bir tur daha"));
        kap.appendChild(h("button", { class: "dugme ikincil", type: "button", onclick: function () { molaMenu(kap); } }, "Keşif menüsü"));
      }
      ciz();
    });
  }

  /* ---------- Mola: Türkiye yer şekilleri ---------- */
  var yerSozleri = {};
  function yerYukle(cfg) {
    if (window[cfg.degisken]) return haritaYukle();
    if (!yerSozleri[cfg.dosya]) {
      yerSozleri[cfg.dosya] = new Promise(function (coz) {
        var el = document.createElement("script");
        el.src = "data/" + cfg.dosya + ".js";
        el.onload = el.onerror = function () { coz(); };
        document.head.appendChild(el);
      });
    }
    return yerSozleri[cfg.dosya].then(haritaYukle);
  }
  var YER_CFG = {
    turkiye: { harita: "turkiye", degisken: "TR_YERLER", dosya: "turkiye-yer", k: 0.78, nokta: 11, cizgi: 5,
      isim: { dag: "dağ", ova: "ova", plato: "plato", gol: "göl", akarsu: "akarsu" } },
    dunya: { y0: 12, yh: 284, harita: "dunya", degisken: "DUNYA_YERLER", dosya: "dunya-yer", k: 0.8, nokta: 6, cizgi: 3,
      isim: { bogaz: "boğaz", deniz: "deniz", korfez: "körfez", ada: "ada", yarimada: "yarımada", col: "çöl", dag: "dağ" } }
  };
  function molaTurkiye(kap, mod, tur) { molaYer(kap, mod, tur, YER_CFG.turkiye); }

  function molaYer(kap, mod, tur, cfg) {
    var TR_ISIM = cfg.isim;
    kap.replaceChildren();
    kap.appendChild(h("p", { class: "kucuk" }, "Harita hazırlanıyor…"));
    yerYukle(cfg).then(function () {
      var hr = window.HARITALAR && window.HARITALAR[cfg.harita], tum = window[cfg.degisken];
      if (!hr || !tum) { kap.replaceChildren(); kap.appendChild(h("p", { class: "kucuk" }, "Harita yüklenemedi, biraz sonra tekrar dene.")); return; }
      var havuz = tum.filter(function (y) { return tur === "hepsi" || y[1] === tur; });
      var N = Math.min(10, havuz.length);
      var sorular = karistir(havuz).slice(0, N);
      var X = function (lon) { return (lon - hr.lon0) * hr.sx; };
      var Y = function (lat) { return (hr.lat0 - lat) * hr.sy; };
      var i = 0, dogru = 0, kacan = [];

      function cizgiMi(y) { return Array.isArray(y[2][0]); }
      function uzaklik(y, lon, lat) { // derece (boylam enleme göre küçültülmüş)
        var k = cfg.k;
        function nok(a, b) { return Math.sqrt(Math.pow((a[0] - b[0]) * k, 2) + Math.pow(a[1] - b[1], 2)); }
        if (!cizgiMi(y)) return nok(y[2], [lon, lat]);
        var en = 1e9;
        for (var q = 0; q < y[2].length - 1; q++) {
          var a = y[2][q], b = y[2][q + 1];
          var ax = a[0] * k, ay = a[1], bx = b[0] * k, by = b[1], px = lon * k, py = lat;
          var dx = bx - ax, dy = by - ay, t = dx || dy ? ((px - ax) * dx + (py - ay) * dy) / (dx * dx + dy * dy) : 0;
          t = Math.max(0, Math.min(1, t));
          en = Math.min(en, Math.sqrt(Math.pow(px - (ax + t * dx), 2) + Math.pow(py - (ay + t * dy), 2)));
        }
        return en;
      }
      function haritaCizTR(y, goster, renk) {
        var trMi = cfg.harita === "turkiye";
        var sv = svgEl("svg", { viewBox: "0 " + (cfg.y0 || 0) + " " + hr.w + " " + (cfg.yh || hr.h), class: "ulke-harita", role: "img", "aria-label": trMi ? "Türkiye haritası" : "Dünya haritası" });
        sv.appendChild(svgEl("rect", { width: hr.w, height: hr.h, fill: "var(--yuzey-2)" }));
        if (hr.komsu) sv.appendChild(svgEl("path", { d: hr.komsu, fill: "var(--cizgi)", stroke: "var(--yuzey)", "stroke-width": ".8" }));
        if (trMi) sv.appendChild(svgEl("path", { d: hr.yol, fill: "var(--vurgu-acik)", stroke: "var(--vurgu)", "stroke-width": "1.2", "stroke-linejoin": "round" }));
        else sv.appendChild(svgEl("path", { d: hr.yol, fill: "var(--cizgi)", stroke: "var(--soluk)", "stroke-width": ".4", "stroke-linejoin": "round" }));
        if (goster) isaretle(sv, y, renk || "var(--vurgu)");
        return sv;
      }
      function isaretle(sv, y, renk) {
        if (cizgiMi(y)) {
          var d = y[2].map(function (p, q) { return (q ? "L" : "M") + X(p[0]).toFixed(1) + " " + Y(p[1]).toFixed(1); }).join("");
          sv.appendChild(svgEl("path", { d: d, fill: "none", stroke: "var(--yuzey)", "stroke-width": cfg.cizgi + 4, "stroke-linecap": "round", "stroke-linejoin": "round", opacity: ".7" }));
          sv.appendChild(svgEl("path", { d: d, fill: "none", stroke: renk, "stroke-width": cfg.cizgi, "stroke-linecap": "round", "stroke-linejoin": "round" }));
        } else {
          sv.appendChild(svgEl("circle", { cx: X(y[2][0]), cy: Y(y[2][1]), r: cfg.nokta, fill: renk, stroke: "var(--yuzey)", "stroke-width": cfg.nokta > 8 ? 3 : 2 }));
        }
      }

      function ciz() {
        kap.replaceChildren();
        if (i >= N) { sonuc(); return; }
        var y = sorular[i], bitti = false;
        var geri = h("div", { class: "geri-yer" });
        var devam = h("button", { class: "dugme", type: "button", hidden: "", onclick: function () { i++; ciz(); } }, i === N - 1 ? "Bitir" : "Devam");
        kap.appendChild(h("div", { class: "mola-ust" },
          h("button", { class: "kapat", type: "button", "aria-label": "Keşfe dön", onclick: function () { molaMenu(kap); } }, "✕"),
          h("span", { class: "kucuk" }, (i + 1) + " / " + N)));
        if (mod === "ad") {
          var ayni = havuz.filter(function (x) { return x !== y && x[1] === y[1]; });
          if (ayni.length < 4) ayni = tum.filter(function (x) { return x !== y && x[1] === y[1]; });
          var sec = karistir([y[0]].concat(karistir(ayni).slice(0, 4).map(function (x) { return x[0]; })));
          kap.appendChild(h("div", { class: "kart mola-soru" }, h("p", { class: "soru-metin" }, "İşaretli " + TR_ISIM[y[1]] + " hangisi?")));
          var svA = haritaCizTR(y, true), kutuA = h("div", { class: "harita-kutu" }, svA); kap.appendChild(kutuA);
          yakinlastirmaBagla(kutuA, svA, [0, cfg.y0 || 0, hr.w, cfg.yh || hr.h]);
          var kutu = h("div", { class: "secenekler" });
          sec.forEach(function (m, p) {
            kutu.appendChild(h("button", { class: "secenek", type: "button", onclick: function () {
              if (bitti) return; bitti = true; titret(m === y[0] ? 12 : 25);
              Array.prototype.forEach.call(kutu.children, function (bb, q) {
                bb.disabled = true;
                if (sec[q] === y[0]) bb.classList.add("dogru"); else if (q === p) bb.classList.add("tekrar");
              });
              if (m === y[0]) { dogru++; geri.textContent = "Güzel 🌿"; } else { kacan.push(y); geri.textContent = "Doğrusu: " + y[0]; }
              devam.hidden = false;
            } }, h("span", { class: "harf", "aria-hidden": "true" }, HARFLER[p]), h("span", { class: "metin" }, m)));
          });
          kap.appendChild(kutu);
        } else {
          kap.appendChild(h("div", { class: "kart mola-soru" }, h("p", { class: "soru-metin" }, "Haritada " + y[0] + " nerede?")));
          var sv = haritaCizTR(y, false);
          sv.style.touchAction = "manipulation";
          sv.addEventListener("click", function (e) {
            if (bitti) return; bitti = true;
            var nk = svNokta(sv, e), px = nk[0], py = nk[1];
            var lon = px / hr.sx + hr.lon0, lat = hr.lat0 - py / hr.sy;
            var tamam = uzaklik(y, lon, lat) <= (y[3] || 0.4) * 1.3;
            titret(tamam ? 12 : 25);
            isaretle(sv, y, "var(--iyi)");
            sv.appendChild(svgEl("circle", { cx: px, cy: py, r: Math.round(cfg.nokta * .75), fill: tamam ? "var(--iyi)" : "var(--tekrar)", stroke: "var(--yuzey)", "stroke-width": "3" }));
            if (tamam) { dogru++; geri.textContent = "Güzel 🌿"; } else { kacan.push(y); geri.textContent = "Yeşil işaretli yer " + y[0] + "."; }
            devam.hidden = false;
          });
          var kutuD = h("div", { class: "harita-kutu" }, sv); kap.appendChild(kutuD);
          yakinlastirmaBagla(kutuD, sv, [0, cfg.y0 || 0, hr.w, cfg.yh || hr.h]);
        }
        kap.appendChild(geri);
        kap.appendChild(devam);
      }

      function sonuc() {
        kap.replaceChildren();
        kap.appendChild(h("div", { class: "kart" },
          h("h2", null, N + " sorudan " + dogru + "'i oturdu"),
          h("p", { class: "alt" }, kacan.length ? "Şunlara bir daha göz atalım:" : "Hepsi yerli yerinde, harika 🌿")));
        if (kacan.length) kap.appendChild(h("div", { class: "kart" }, kacan.map(function (x) { return h("p", { class: "kacan" }, h("b", null, x[0]), " · " + TR_ISIM[x[1]]); })));
        kap.appendChild(h("button", { class: "dugme", type: "button", onclick: function () { molaYer(kap, mod, tur, cfg); } }, "Bir tur daha"));
        kap.appendChild(h("button", { class: "dugme ikincil", type: "button", onclick: function () { molaMenu(kap); } }, "Keşif menüsü"));
      }
      ciz();
    });
  }

  /* ---------- Gözden Geçir ---------- */
  function halka(yuzde, boyut, kalinlik, ic) {
    var r = (boyut - kalinlik) / 2, c = 2 * Math.PI * r;
    var sv = svgEl("svg", { viewBox: "0 0 " + boyut + " " + boyut, class: "halka", role: "img", "aria-label": "%" + yuzde });
    sv.appendChild(svgEl("circle", { cx: boyut / 2, cy: boyut / 2, r: r, fill: "none", stroke: "var(--yuzey-2)", "stroke-width": kalinlik }));
    sv.appendChild(svgEl("circle", { cx: boyut / 2, cy: boyut / 2, r: r, fill: "none", stroke: "var(--iyi)", "stroke-width": kalinlik,
      "stroke-linecap": "round", "stroke-dasharray": (c * yuzde / 100).toFixed(1) + " " + c.toFixed(1), transform: "rotate(-90 " + boyut / 2 + " " + boyut / 2 + ")" }));
    var kap = h("div", { class: "halka-kap", style: "width:" + boyut + "px;height:" + boyut + "px" }, sv, h("div", { class: "halka-ic" }, ic));
    return kap;
  }

  function gozdenGecirIcerik(hepsi) {
    var cikti = [];
    var toplam = 0;
    Object.keys(toplamlar).forEach(function (kid) { toplam += toplamlar[kid]; });
    var oturan = oturanSay();
    var yuzde = toplam ? Math.min(100, Math.round(oturan / toplam * 100)) : 0;

    // 1) genel halka + ders halkaları
    var dersHalkalari = h("div", { class: "ders-halkalar" });
    DERSLER.forEach(function (d) {
      var konular = KONULAR.filter(function (k) { return k.ders === d.id && k.sinav === d.sinav && k.hazir; });
      var tp = 0, ot = 0;
      konular.forEach(function (k) { tp += toplamlar[k.id] || 0; ot += oturanSay(k.id); });
      if (!tp) return;
      var y = Math.min(100, Math.round(ot / tp * 100));
      dersHalkalari.appendChild(h("div", { class: "ders-halka" },
        halka(y, 64, 7, h("b", null, y + "%")),
        h("span", null, d.ad + (d.sinav === "ayt" ? " (AYT)" : ""))));
    });
    cikti.push(h("section", { class: "kart halka-kart" },
      halka(yuzde, 168, 14, [h("b", null, "%" + yuzde), h("span", null, "oturdu")]),
      h("p", { class: "alt halka-alt" }, toplam ? oturan + " / " + toplam + " bilgi oturdu" : "Bir konuya girince burası dolacak."),
      dersHalkalari.children.length ? dersHalkalari : null));

    // 2) tekrarı gelenler
    var idler = bekleyenIdler();
    var konuAd = {};
    KONULAR.forEach(function (k) { konuAd[k.id] = k.ad; });
    var konuSay = {};
    idler.forEach(function (id) { var n = ilerleme[id].n; konuSay[n] = (konuSay[n] || 0) + 1; });
    var tekrarSorular = [];
    idler.forEach(function (id) {
      var q = hepsi.filter(function (x) { return ogeIdleri(x).indexOf(id) >= 0; })[0];
      if (q && tekrarSorular.indexOf(q) < 0) tekrarSorular.push(q);
    });
    cikti.push(h("h2", { class: "bolum-baslik" }, "Tekrar edeceklerim"));
    if (!idler.length) {
      cikti.push(yakinda("🌤️", "Şimdilik tekrar bekleyen yok", "Öğrendiklerin tekrar zamanı gelince burada görünecek."));
    } else {
      cikti.push(h("div", { class: "kart" },
        h("h2", null, idler.length + " madde seni bekliyor"),
        h("div", { class: "konu-etiketler" }, Object.keys(konuSay).map(function (n) {
          return h("a", { class: "etiket", href: "#/konu/" + n + "/tekrar" }, (konuAd[n] || n) + " · " + konuSay[n]);
        })),
        h("button", { class: "dugme", type: "button", style: "margin-top:14px",
          onclick: function () { modSec(function (mod) { testBaslat("Tekrar zamanı", tekrarSorular.slice(0, 20), mod); }); } }, "Hepsini tazele")));
    }

    // 3) biraz ilgi bekleyenler: başlanmış ama en az oturan konular
    var adaylar = KONULAR.filter(function (k) { return k.hazir && toplamlar[k.id] && (oturanSay(k.id) || Object.keys(ilerleme).some(function (id) { return ilerleme[id].n === k.id; })); })
      .map(function (k) { return { k: k, y: Math.min(100, Math.round(oturanSay(k.id) / toplamlar[k.id] * 100)) }; })
      .filter(function (a) { return a.y < 80; })
      .sort(function (a, b) { return a.y - b.y; }).slice(0, 5);
    if (adaylar.length) {
      cikti.push(h("h2", { class: "bolum-baslik" }, "Biraz ilgi bekleyenler"));
      cikti.push(h("div", { class: "test-liste" }, adaylar.map(function (a) {
        return h("a", { class: "test-satir", href: "#/konu/" + a.k.id + "/ozet" },
          h("span", { class: "bilgi" }, h("b", null, a.k.ad), h("small", null, "%" + a.y + " oturdu")),
          h("span", { class: "tik", "aria-hidden": "true" }, "›"));
      })));
    }

    // 4) bu hafta
    var gunAd = ["Pz", "Pt", "Sa", "Ça", "Pe", "Cu", "Ct"];
    var cubuklar = h("div", { class: "hafta" }), hs = 0, hg = 0, enCok = 1, gunler = [];
    for (var i = 6; i >= 0; i--) {
      var d = new Date(); d.setDate(d.getDate() - i);
      var an = d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2);
      var c = (gecmis[an] && gecmis[an].c) || 0;
      gunler.push({ ad: gunAd[d.getDay()], c: c });
      hs += c; if (c) hg++; if (c > enCok) enCok = c;
    }
    gunler.forEach(function (g) {
      cubuklar.appendChild(h("div", { class: "hafta-gun" },
        h("div", { class: "hafta-cubuk" }, h("i", { style: "height:" + Math.round(g.c / enCok * 100) + "%" })),
        h("span", null, g.ad)));
    });
    cikti.push(h("h2", { class: "bolum-baslik" }, "Bu hafta"));
    cikti.push(h("div", { class: "kart" },
      h("p", { class: "alt", style: "margin:0 0 12px" }, hs ? hs + " soru çözdün, " + hg + " gün çalıştın." : "Bu hafta henüz soru çözmedin, acelesi yok 🌿"),
      cubuklar));
    return cikti;
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
        var oturan = oturanSay();
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
        h("button", { class: "dugme ikincil", type: "button", onclick: function () { modSec(function (mod) { tumSorular(function (hepsi) { testBaslat("Karışık test", hepsi.slice(0, 20), mod); }); }); } }, "20 soruluk karışık test"));

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
    kesif: function () {
      var kap = h("div", { class: "mola-kap" });
      var yuk = new Promise(function (coz) {
        if (window.MOLA_ULKELER) return coz();
        var el = document.createElement("script");
        el.src = "data/mola.js";
        el.onload = el.onerror = function () { coz(); };
        document.head.appendChild(el);
      });
      yuk.then(function () { molaMenu(kap); });
      return [h("header", { class: "ust" }, h("h1", null, "Keşif"), h("p", { class: "alt-baslik" }, "Harita oyunları")), kap];
    },
    mola: function () { return this.kesif(); },
    "gozden-gecir": function () {
      var govde = h("div", null, h("p", { class: "kucuk" }, "Yükleniyor…"));
      var dosyalar = [];
      KONULAR.forEach(function (k) { if (k.hazir && dosyalar.indexOf(k.dosya) < 0) dosyalar.push(k.dosya); });
      Promise.all(dosyalar.map(dersYukle)).then(function (veriler) {
        var hepsi = [];
        veriler.forEach(function (v) { hepsi = hepsi.concat(v.sorular); });
        govde.replaceChildren();
        ekle(govde, gozdenGecirIcerik(hepsi));
      });
      return [h("header", { class: "ust" }, h("h1", null, "Gözden Geçir")), govde];
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

      // İsim
      var isimKutu = h("input", { class: "alan", type: "text", maxlength: "30", placeholder: "İsteğe bağlı", "aria-label": "İsmin",
        value: kayit.oku("yks-isim", "") });
      isimKutu.addEventListener("input", function () { kayit.yaz("yks-isim", isimKutu.value.trim()); });

      // Genel durum
      var oturan = 0, toplam = 0, cozulen = 0, gun = 0;
      Object.keys(ozetDurum).forEach(function (kid) { Object.keys(ozetDurum[kid]).forEach(function (m) { if (ozetDurum[kid][m] === "b") oturan++; }); });
      Object.keys(toplamlar).forEach(function (kid) { toplam += toplamlar[kid]; });
      Object.keys(gecmis).forEach(function (g) { cozulen += gecmis[g].c || 0; gun++; });
      function sayiKutu(sayi, ad) { return h("div", { class: "sayi-kutu" }, h("b", null, String(sayi)), h("span", null, ad)); }
      var durum = h("div", { class: "kart" },
        h("h2", null, "Genel durum"),
        h("div", { class: "sayilar" }, sayiKutu(oturan, "oturan bilgi"), sayiKutu(cozulen, "çözülen soru"), sayiKutu(gun, "çalışılan gün")),
        cozulen || oturan ? null : h("p", { class: "alt" }, "Henüz başlamadın. Bir konuya girince burası dolacak."));

      // Yedek
      var dosya = h("input", { type: "file", accept: "application/json,.json", hidden: "" });
      dosya.addEventListener("change", function () {
        var f = dosya.files && dosya.files[0];
        if (!f) return;
        var r = new FileReader();
        r.onload = function () {
          try {
            var veri = JSON.parse(r.result);
            if (!veri || veri.tur !== "yks-yedek" || typeof veri.veri !== "object") throw new Error("bicim");
            Object.keys(veri.veri).forEach(function (k) { if (k.indexOf("yks-") === 0) localStorage.setItem(k, veri.veri[k]); });
            mesaj("Yedek yüklendi, sayfa yenileniyor…");
            setTimeout(function () { location.href = "./"; }, 900);
          } catch (e) { mesaj("Bu dosya bir YKS yedeği gibi görünmüyor."); }
        };
        r.readAsText(f);
      });
      function yedekAl() {
        var veri = {};
        try { for (var i = 0; i < localStorage.length; i++) { var k = localStorage.key(i); if (k.indexOf("yks-") === 0) veri[k] = localStorage.getItem(k); } } catch (e) {}
        var govde = JSON.stringify({ tur: "yks-yedek", surum: SURUM, tarih: bugunAnahtar(), veri: veri });
        var ad = "yks-yedek-" + bugunAnahtar() + ".json";
        try {
          var dosyaNesne = new File([govde], ad, { type: "application/json" });
          if (navigator.canShare && navigator.canShare({ files: [dosyaNesne] })) {
            navigator.share({ files: [dosyaNesne], title: "YKS yedeği" }).catch(function () {});
            return;
          }
        } catch (e) {}
        var a = h("a", { href: URL.createObjectURL(new Blob([govde], { type: "application/json" })), download: ad });
        document.body.appendChild(a); a.click(); a.remove();
        mesaj("Yedek indirildi 🌿");
      }
      var sifirlaDugme = h("button", { class: "dugme ikincil", type: "button" }, "Geçmişi sıfırla");
      var sifirlaHazir = false;
      sifirlaDugme.addEventListener("click", function () {
        if (!sifirlaHazir) {
          sifirlaHazir = true; sifirlaDugme.textContent = "Emin misin? Bir kez daha dokun";
          setTimeout(function () { sifirlaHazir = false; sifirlaDugme.textContent = "Geçmişi sıfırla"; }, 4000);
          return;
        }
        ["yks-ilerleme", "yks-ozet", "yks-testler", "yks-yarim", "yks-gecmis", "yks-toplam"].forEach(function (k) { try { localStorage.removeItem(k); } catch (e) {} });
        mesaj("Geçmiş sıfırlandı."); setTimeout(function () { location.href = "./"; }, 800);
      });
      var veriler = h("div", { class: "kart" },
        h("h2", null, "Verilerin"),
        h("p", { class: "alt" }, "İlerlemen yalnızca bu telefonda durur; hesap yok. Tarayıcı verisini silmeden ya da telefon değiştirmeden önce yedek al, dosyayı kendine mesajla gönderebilirsin."),
        h("div", { style: "margin-top:14px" },
          h("button", { class: "dugme", type: "button", onclick: yedekAl }, "Yedek al"),
          h("button", { class: "dugme ikincil", type: "button", onclick: function () { dosya.click(); } }, "Yedekten geri yükle"),
          sifirlaDugme, dosya),
        h("p", { class: "alt", style: "margin-top:12px" }, "Ana ekrana ekleyince uygulama gibi açılır: Safari'de Paylaş, sonra Ana Ekrana Ekle."));

      var hakkinda = h("div", { class: "kart" },
        h("h2", null, "Hakkında"),
        h("p", { class: "alt" }, "Sorular ve bilgi kartları kaynaklardan okunarak yapay zekâ yardımıyla hazırlandı, hatalar olabilir. Bir soru sana yanlış geldiyse büyük ihtimalle haklısın: soru ekranındaki “Bu soruda bir sorun var” bağlantısı soruyu bulmaya yetecek bilgiyi kopyalar, onu bana iletmen yeterli."));

      return [
        h("header", { class: "ust" }, h("h1", null, "Profil")),
        h("div", { class: "kart" },
          h("h2", null, "İsmin"),
          h("p", { class: "alt" }, "Ana sayfadaki selamlamada kullanılır; bu telefonda saklanır ve yedeğe girer."),
          h("div", { style: "margin-top:12px" }, isimKutu)),
        durum,
        veriler,
        h("div", { class: "kart" },
          h("h2", null, "Görünüm"),
          h("p", { class: "alt" }, "Açık, koyu ya da telefonun ayarına göre."),
          h("div", { style: "margin-top:14px" }, grup)),
        hakkinda,
        h("p", { class: "surum" }, "Sürüm " + SURUM)
      ];
    }
  };

  /* ---------- yönlendirme (#/mola gibi adresler; geri tuşu çalışır) ---------- */
  function rota() {
    var yol = (location.hash.replace(/^#\/?/, "") || "ana").split("/");
    var ad = sayfalar[yol[0]] ? yol[0] : "ana";
    if (ad === "mola") ad = "kesif";
    document.body.dataset.bolum = ad === "kesif" ? "kesif" : ad === "gozden-gecir" ? "gozden" : "";
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
  // Anahtar: sürümün ana numarası ("1.1-dev1" için "1.0"). Her yayında buraya madde eklenir.
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

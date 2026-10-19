(function () {
  "use strict";

  var app = document.getElementById("app");
  var HARFLER = ["A", "B", "C", "D", "E"];
  var STORE_KEY = "yks-calisma-v1";

  /* ---------- kayıt (localStorage yoksa bellekte tutar) ---------- */
  var state = { cozulen: 0, dogru: 0, yanlis: {}, enIyi: {} };
  try {
    var kayit = JSON.parse(localStorage.getItem(STORE_KEY) || "null");
    if (kayit && typeof kayit === "object") {
      state.cozulen = kayit.cozulen || 0;
      state.dogru = kayit.dogru || 0;
      state.yanlis = kayit.yanlis || {};
      state.enIyi = kayit.enIyi || {};
    }
  } catch (e) {}

  function kaydet() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) {}
  }

  /* ---------- yardımcılar ---------- */
  function h(tag, attrs) {
    var el = document.createElement(tag);
    attrs = attrs || {};
    Object.keys(attrs).forEach(function (k) {
      var v = attrs[k];
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
  function karistir(dizi) {
    var a = dizi.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }
  function git(el) {
    app.replaceChildren(el);
    window.scrollTo(0, 0);
  }
  function konuSorulari(konuId) {
    return SORULAR.filter(function (q) { return q.konu === konuId; });
  }
  function selam() {
    var s = new Date().getHours();
    var g = s < 6 ? "İyi geceler" : s < 12 ? "Günaydın" : s < 18 ? "İyi günler" : "İyi akşamlar";
    return g + (ISIM ? ", " + ISIM : "");
  }
  function yanlisSayisi() { return Object.keys(state.yanlis).length; }

  /* ---------- ana sayfa ---------- */
  function anaSayfa() {
    var notYazi = h("p", {}, rastgeleNot());
    var yeniNot = h("button", { class: "link-btn", type: "button", onclick: function () {
      notYazi.textContent = rastgeleNot(notYazi.textContent);
    } }, "Başka bir not");

    var oran = state.cozulen ? Math.round((state.dogru / state.cozulen) * 100) + "%" : "-";

    var kok = h("div", {},
      h("header", {},
        h("p", { class: "hello" }, selam()),
        h("h1", {}, "YKS Çalışma Köşesi")
      ),
      h("section", { class: "card note" }, notYazi, yeniNot),
      h("section", { class: "stats" },
        stat(state.cozulen, "çözülen soru"),
        stat(oran, "doğru oranı"),
        stat(yanlisSayisi(), "tekrar bekleyen")
      ),
      h("h2", {}, "Hızlı başla"),
      h("div", { class: "list" },
        satir("Karışık test", "Tüm konulardan 10 soru", function () {
          basla(karistir(SORULAR).slice(0, 10), "Karışık test");
        }, true),
        satir("Yanlışlarım", yanlisSayisi() ? yanlisSayisi() + " soru seni bekliyor" : "Henüz yanlışın yok, harika!", function () {
          var liste = SORULAR.filter(function (q) { return state.yanlis[q.id]; });
          basla(karistir(liste), "Yanlışlarım");
        }, false, yanlisSayisi() === 0)
      ),
      DERSLER.map(function (d) {
        return h("section", {},
          h("h2", {}, d.ad),
          h("div", { class: "list" },
            KONULAR.filter(function (k) { return k.ders === d.id; }).map(function (k) {
              var qs = konuSorulari(k.id);
              var iyi = state.enIyi[k.id];
              var alt = qs.length + " soru" + (iyi != null ? " · en iyi " + iyi + "/" + qs.length : "");
              return satir(k.ad, alt, function () { basla(karistir(qs), k.ad, k.id); });
            })
          )
        );
      }),
      h("p", { class: "foot" }, "Küçük adımlar, büyük fark. 🌿")
    );
    git(kok);
  }

  var sonNot = "";
  function rastgeleNot(onceki) {
    var secenek = NOTLAR.filter(function (n) { return n !== (onceki || sonNot); });
    var n = secenek[Math.floor(Math.random() * secenek.length)] || NOTLAR[0] || "";
    sonNot = n;
    return n;
  }
  function stat(deger, etiket) {
    return h("div", { class: "card stat" }, h("b", {}, deger), h("span", {}, etiket));
  }
  function satir(baslik, alt, tikla, birincil, pasif) {
    return h("button", {
      class: "row" + (birincil ? " primary" : ""),
      type: "button",
      disabled: pasif ? "" : false,
      onclick: tikla
    },
      h("span", {}, baslik, h("small", {}, alt)),
      h("span", { class: "chev", "aria-hidden": "true" }, "›")
    );
  }

  /* ---------- test ---------- */
  function hazirla(q) {
    var secenekler = q.secenekler.map(function (t, i) { return { t: t, ok: i === q.dogru }; });
    if (!q.sabit) secenekler = karistir(secenekler);
    return { q: q, secenekler: secenekler };
  }

  function basla(liste, baslik, konuId) {
    if (!liste.length) { anaSayfa(); return; }
    var sorular = liste.map(hazirla);
    var sira = 0;
    var dogruSayisi = 0;
    var yanlislar = [];

    function goster() {
      var p = sorular[sira];
      var cevaplandi = false;
      var optBtns = [];
      var geri = h("div", { id: "geri" });

      var sonraki = h("button", { class: "row primary next", type: "button", onclick: function () {
        sira++;
        if (sira < sorular.length) goster(); else sonuc();
      } }, h("span", {}, sira === sorular.length - 1 ? "Sonucu gör" : "Sonraki soru"), h("span", { class: "chev" }, "›"));

      p.secenekler.forEach(function (s, i) {
        var b = h("button", { class: "opt", type: "button", onclick: function () { sec(i); } },
          h("span", { class: "l" }, HARFLER[i]),
          h("span", {}, s.t)
        );
        optBtns.push(b);
      });

      function sec(i) {
        if (cevaplandi) return;
        cevaplandi = true;
        var dogruMu = p.secenekler[i].ok;
        state.cozulen++;
        if (dogruMu) { state.dogru++; dogruSayisi++; delete state.yanlis[p.q.id]; }
        else { state.yanlis[p.q.id] = true; yanlislar.push(p); }
        kaydet();

        optBtns.forEach(function (b, j) {
          b.disabled = true;
          if (p.secenekler[j].ok) b.classList.add("ok");
          else if (j === i) b.classList.add("no");
          else b.classList.add("dim");
        });

        var dogruHarf = HARFLER[p.secenekler.findIndex(function (s) { return s.ok; })];
        geri.replaceChildren(
          h("div", { class: "feedback " + (dogruMu ? "good" : "bad"), role: "status" },
            h("strong", {}, dogruMu ? "Doğru! 🎉" : "Olsun, şimdi öğrendin. Doğru cevap: " + dogruHarf),
            h("p", { class: "dn" }, h("b", {}, "Dipnot: "), p.q.not)
          ),
          sonraki
        );
        geri.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }

      git(h("div", {},
        h("div", { class: "topbar" },
          h("button", { class: "back", type: "button", onclick: anaSayfa }, "‹ Ana sayfa"),
          h("span", { class: "count" }, (sira + 1) + " / " + sorular.length)
        ),
        h("div", { class: "bar", "aria-hidden": "true" }, h("i", { style: "width:" + (sira / sorular.length) * 100 + "%" })),
        h("p", { class: "q-title" }, baslik),
        h("p", { class: "q-text" }, p.q.soru),
        h("div", { class: "opts" }, optBtns),
        geri
      ));
    }

    function sonuc() {
      if (konuId) {
        var onceki = state.enIyi[konuId];
        if (onceki == null || dogruSayisi > onceki) { state.enIyi[konuId] = dogruSayisi; kaydet(); }
      }
      var oran = dogruSayisi / sorular.length;
      var mesaj = oran === 1 ? "Tam puan! Bu konuyu cebine koydun. 🌟"
        : oran >= 0.7 ? "Çok iyi gidiyorsun, sağlam bir tur oldu."
        : oran >= 0.4 ? "İyi bir başlangıç. Dipnotlar sayesinde bir sonraki tur daha iyi olacak."
        : "Zor bir turdu ama şimdi dipnotları okudun, bu bile kazanç. 🌱";

      git(h("div", {},
        h("div", { class: "topbar" },
          h("button", { class: "back", type: "button", onclick: anaSayfa }, "‹ Ana sayfa"),
          h("span", { class: "count" }, baslik)
        ),
        h("section", { class: "card score" },
          h("div", { class: "big" }, dogruSayisi + " / " + sorular.length),
          h("p", {}, mesaj)
        ),
        yanlislar.length ? h("div", {},
          h("h2", {}, "Tekrar bakalım"),
          h("div", { class: "review" }, yanlislar.map(function (p) {
            var dogruMetin = p.secenekler.filter(function (s) { return s.ok; })[0].t;
            return h("div", { class: "card" },
              h("p", { class: "qq" }, p.q.soru),
              h("p", { class: "aa" }, "Doğru cevap: " + dogruMetin),
              h("p", { class: "nn" }, p.q.not)
            );
          }))
        ) : null,
        h("div", { class: "list", style: "margin-top:20px" },
          yanlislar.length ? satir("Yanlışlarımı tekrar çöz", yanlislar.length + " soru", function () {
            basla(karistir(yanlislar.map(function (p) { return p.q; })), "Yanlışlarım");
          }, true) : null,
          satir("Bu testi yeniden çöz", "Sorular yeniden karışır", function () {
            basla(karistir(liste), baslik, konuId);
          }),
          satir("Ana sayfa", "Başka bir konu seç", anaSayfa)
        )
      ));
    }

    goster();
  }

  anaSayfa();
})();

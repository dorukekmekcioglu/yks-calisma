# YKS Çalışma Köşesi

Kız arkadaşım için yaptığım, YKS'ye ikinci kez hazırlanırken telefondan rahatça kullanabileceği bir soru çözme sitesi. Amaç: temel bilgiyi pekiştiren, sadece okuyarak çözülen ÖSYM YKS standardında sorular; yanlışlarda kısa dipnotlar; sıcak, küçük motivasyon notları.

## Teknik yapı
- Saf HTML/CSS/JS, derleme yok. GitHub Pages ile yayınlanıyor (main / root).
- `index.html`: iskelet. `style.css`: tasarım (sade, minimal, açık/koyu mod, mobil öncelikli).
- `app.js`: ana sayfa, test akışı, sonuç ekranı, localStorage ile ilerleme (hata verirse bellekte çalışır).
- `questions.js`: DERSLER, KONULAR ve `Q(konu, soru, [5 şık], doğruIndex, dipnot, sabitSıra)` ile yazılan sorular. Şıklar çalışırken karıştırılır; "Yalnız I, I ve II" gibi şıklarda son parametre `true` olmalı.
- `config.js`: karşılama ismi (`ISIM`) ve motivasyon notları (`NOTLAR`).
- `sw.js` + `manifest.json`: ana ekrana eklenebilir, çevrimdışı çalışır. Dosya listesi değişirse `sw.js` içindeki `DOSYALAR` ve `CACHE` adını güncelle.

## Kurallar
- Dil Türkçe. Sorular ÖSYM üslubunda, 5 şıklı, tek doğru cevaplı olmalı.
- Her sorunun dipnotu bilgiyi pekiştirmeli, kısa ve öğretici olmalı. Bilgi emin olunmadıkça eklenmemeli, doğruluğu kontrol edilmeli.
- Tasarım sade kalmalı, telefonda tek elle rahat kullanılmalı (büyük dokunma alanları).
- Harici kütüphane ve CDN kullanma.

## Yapılacaklar
- Her konuya daha fazla soru ekle (hedef: konu başı 15-20).
- Tarih ve Edebiyat derslerini ekle.
- Konu bazlı ilerleme ve zayıf konu özeti.

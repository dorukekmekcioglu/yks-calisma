# YKS Çalışma Köşesi

Kız arkadaşım için yaptığım, YKS'ye (sayısal) ikinci kez hazırlanırken telefondan rahatça, uzanırken-dinlenirken tekrar yapabileceği bir çalışma sitesi. Amaç: temel ve ezber bilgiyi bol ve çeşitli soruyla pekiştirmek; sıcak, baskısız bir ton.

## Önce PLAN.md'yi oku
Site yeniden yapılıyor. **Bütün kararlar, sürüm akışı, aşamalı çalışma kuralı ve aşama sırası [PLAN.md](PLAN.md) içindedir.** İşe başlamadan önce oku. Bir karar değişirse önce PLAN.md'yi güncelle.

Şu anki dosyalar (`app.js`, `questions.js`, `config.js` …) eski sürüme aittir. 1.0 onaylanınca yeni yapıyla değiştirilir.

## Kurallar
- Dil Türkçe. Sorular ÖSYM üslubunda, 5 şıklı, tek doğru cevaplı.
- İçerik `kaynaklar/` klasöründeki PDF ve slaytlardan, ayrıca MEBİ ve OGM Materyal sayfalarından (okunarak, PLAN.md §2) üretilir. Emin olunmayan bilgi eklenmez. Kaynak metin ve görseller kopyalanmaz. Depo herkese açık olduğu için `kaynaklar/` asla commit edilmez.
- Dipnotlar kısa, öğretici ve bilgiyi pekiştiren türden olur.
- Ton baskısız olur: geri sayım öne çıkmaz, kırmızı uyarı yok, "yanlış" yerine yumuşak bir dil kullanılır.
- Tasarım sade ve sıcak olur, telefonda tek elle kullanılır (şıklar alt yarıda, büyük dokunma alanları).
- Saf HTML/CSS/JS kullanılır. Derleme, harici kütüphane, CDN ve harici yazı tipi yok. Hız birinci önceliktir.
- **Aşamalı çalış:** her aşamadan sonra özetle, kendin test et, telefonda deneme adresi ver ve onay bekle. Onaysız yayına alma (PLAN.md §9).
- Yayında `sw.js` içindeki önbellek adını ve sürüm numarasını güncelle.

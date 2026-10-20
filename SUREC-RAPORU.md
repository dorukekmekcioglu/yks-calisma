# YKS Çalışma Köşesi: Süreç Raporu

Bu rapor, projenin şimdiye kadarki gidişatını dışarıdan bakan bir gözün (ör. Opus ile yapılacak süreç değerlendirmesi) hızlıca anlayabilmesi için yazıldı. Rakamlar 20 Ekim 2026 itibarıyladır, sürüm **1.0-dev36**.

## 1. Proje nedir?

- **Kullanıcı:** YKS'ye (sayısal) ikinci kez hazırlanan bir öğrenci (proje sahibinin kız arkadaşı). Telefondan, uzanırken ya da dinlenirken rahatça tekrar yapabileceği bir site.
- **Amaç:** Temel ve ezber bilgiyi bol ve çeşitli soruyla pekiştirmek. Sıcak, baskısız ton: geri sayım yok, kırmızı uyarı yok, "yanlış" yerine yumuşak dil.
- **Teknik kural:** Saf HTML/CSS/JS. Derleme, harici kütüphane, CDN ve harici yazı tipi yok. Hız öncelikli, çevrimdışı çalışır (service worker).
- **Proje sahibi** teknik değil; işi adım adım, her adımı görerek ilerletiyor. Kod ve içerik üretimi yapay zekâ (Claude) ile yapılıyor, proje sahibi onaylıyor ve yayına alıyor.
- **Depo herkese açık**, bu yüzden kaynak PDF/slaytlar (`kaynaklar/`) asla commit edilmiyor.

## 2. Çalışma biçimi

- Karar ve plan belgesi: `PLAN.md`. Proje kuralları: `CLAUDE.md`.
- **Aşamalı çalışma:** her aşamadan sonra özet, kendi testim, telefonda deneme adresi, onay. Onaysız yayına alınmaz.
- Çalışma `gelistirme` dalında; `main`'e alma ve push yalnızca kullanıcı onayıyla, push'u kullanıcı kendi terminalinden yapıyor (yayın GitHub Pages).
- Doğrulama yöntemi: içerik dosyaları şema kontrolünden geçiyor (şık sayısı, tekrarlayan şık, bağlı madde, test üyeliği, doğru şık dağılımı), arayüz başsız tarayıcıda ve tarayıcı panelinde deneniyor. **İçeriğin bilimsel doğruluğunu otomatik denetleyen bir mekanizma yok**; doğruluk kaynak okumasına ve yazarın dikkatine dayanıyor.

## 3. Şu anki durum: uygulama

| Bölüm | Durum |
|---|---|
| Ana sayfa | Selamlama (isim), motivasyon notu (şimdilik örnek metin), ilerleme, kısa tur, 20 soruluk karışık test, ders/konu listesi |
| Konu sayfası | Özet (kart akışı, sağa/sola kaydırma), Test, Tekrar; soru tipleri: klasik 5 şık, öncüllü, görselli (harita, iklim grafiği) |
| Gözden Geçir (yeşil tema) | Yuvarlak genel yüzde halkası, ders halkaları, "Tekrar edeceklerim", "Biraz ilgi bekleyenler", "Bu hafta" |
| Keşif (mavi tema, eski adı Mola) | Başkent bul, Hangi ülke?, haritada ülke bulma (2 mod), Türkiye yer şekilleri (2 mod), dünya yer şekilleri (2 mod); tüm haritalarda yakınlaştırma/sürükleme |
| Profil | İsim, genel durum, yedek al / geri yükle / sıfırla, tema, hakkında; sorulara "Bu soruda bir sorun var" bağlantısı (soru bilgisini panoya kopyalar) |
| Akıllı tekrar | Leitner kutuları (1-5), tekrar günleri 1-2-4-8-16 gün, yerel kayıt |
| Teknik | Hash yönlendirme, ders içeriği derse girilince yüklenen betiklerle, service worker sürüm bildirimi |

Yerel kayıt `localStorage` (ilerleme, özet durumları, test sonuçları, geçmiş). Hesap/sunucu yok; yedek dosya ile.

## 4. Şu anki durum: içerik

| Ders | Konu (hazır) | Madde | Soru | Test | Görselli soru |
|---|---|---|---|---|---|
| TYT Biyoloji | 9 | 335 | 389 | 46 | 0 |
| AYT Biyoloji (sinir, endokrin) | 2 | 162 | 120 | 11 | 0 |
| Coğrafya (TYT) | 8 / 15 | 203 | 416 | 37 | 90 |
| TYT Türkçe (yazım, noktalama, dil bilgisi) | 25 | 174 | 380 | 41 | 0 |
| Fizik, Kimya | 0 (konu listesi var) | 0 | 0 | 0 | 0 |
| **Toplam** | | **874** | **1305** | **135** | **90** |

Keşif (oyun) verisi: 167 ülke ve başkent, 166 ülke şekli (Natural Earth 1:50m), 76 Türkiye yeri, 121 dünya yeri.

Coğrafya'da hazır konular: Doğa ve İnsan Etkileşimi, Bölgeler, Atmosfer ve İklim, Dünya'nın Yapısı, Jeolojik Zamanlar, İç Kuvvetler, Koordinat/Yerel Saat, Harita Bilgisi. **Yazılmayı bekleyenler:** Dünya'nın Şekli ve Hareketleri, Nüfus, Doğal Afetler, Dış Kuvvetler, Türkiye'nin Yer Şekilleri, Su-Toprak-Bitki, Yerleşme-Ekonomi-Göç, Ulaşım. İçerik kaynağı: kullanıcının slayt/PDF'leri, OGM Materyal MEBİ konu özetleri (okunarak, özgün cümlelerle yeniden yazıldı), "12 Günde TYT Coğrafya" kampı videolarının metin dökümleri (kullanıcı sağladı; ilk 3 gün işlendi).

## 5. Önemli kararlar

1. Bilgi havuzu mimarisi: önce doğrulanmış kısa **bilgi maddeleri**, bütün sorular ve özet kartları bu maddelerden türetiliyor. Bilgi düzeltilince bağlı her şey düzeliyor ve ilerleme kaybolmuyor.
2. Ton kuralları sert: kalan gün yok, düşen puan yok, "yanlış" yerine "tekrar listesine eklendi". Tek istisna: yanlış şık yumuşak açık kırmızı.
3. Görseller kodla çizilen SVG (harita, iklim grafiği, izohips). Dış görsel yok.
4. Harita verisi kamu malı Natural Earth'ten sadeleştirildi (`data/harita.js`, `data/ulkeler.js`).
5. 3 sekme (Ana sayfa, Gözden Geçir, Keşif); Profil sağ üstte yuvarlak simge. Her sekmenin kendi rengi var.
6. Sunucu (Supabase) şimdilik ertelendi; ilerleme tarayıcıda, yedek dosya ile korunuyor.
7. Kapsam: hesap ve işlem gerektiren sorular dışarıda (hesaplı Coğrafya soruları istisna; elle yeniden hesaplanarak doğrulandı).

## 6. Dürüst değerlendirme: bilinen sorunlar ve riskler

**İçerik kalitesi (en büyük risk)**
- Kullanıcı **TYT Türkçe dil bilgisi sorularının kalitesinden memnun olmadığını** söyledi; "soru taraması sonra yapılır". Sorunlar: bazı sorularda birden fazla savunulabilir cevap, bazı çeldiriciler zayıf ya da yanlışlıkla doğru, bazı soru kökleri ÖSYM üslubundan uzak. Türkçe sorularının bir kısmı hızlı üretildi ve ayrıca bir insan/ikinci göz denetiminden geçmedi.
- Coğrafya ve Biyoloji'de de kaynaktan okuma sırasında bilgi hataları yakalandı ve düzeltildi (ör. İç Kuvvetler PDF'inde Richter/Mercalli karışıklığı), yani **kaynakların kendisi de hatalı olabiliyor**; otomatik kontrol yok.
- Doğru şık konumları dengeli dağıtılıyor ama "ÖSYM benzeri zorluk" ölçülmüyor; çoğu soru bilgi hatırlama düzeyinde.
- Çok sayıda soru aynı maddeye kısa varyasyonlarla bağlı; gerçek çeşitlilik düşük olabilir.

**Konum verileri**
- Keşif'teki Türkiye ve dünya yerleri (dağ, ova, plato, boğaz, deniz, ada vb.) **yaklaşık koordinatlarla elle yazıldı**; derslerdeki bilgiyle birebir uyuştuğu kullanıcı tarafından doğrulanmadı. Dokunma oyununda hoşgörü payı var ama yanlış konum öğretme riski var.
- Başkent listesi (167) tartışmalı yerleri bilerek dışarıda bırakıyor (İsrail, Filistin, Kosova, Tayvan vb.).

**Ürün ve mühendislik**
- "Oturan bilgi yüzdesi" (özette "Yess" denen ya da testte tekrar doğru yapılan maddeler) kaba bir ölçü; bilimsel bir bellek modeli değil.
- İçerik betikleri büyük (Coğrafya ~300 KB, Türkçe ~280 KB); derse girince bir seferde yükleniyor. Ana sayfa ilerleme hesabı için hepsini yükleyebiliyor. Mobilde hız şimdilik kabul edilebilir ama ölçülmedi.
- Test ağırlıklı olarak masaüstü tarayıcı + telefon boyutu simülasyonu; gerçek telefonda pinch zoom, paylaşım menüsü (yedek), service worker güncellemesi ve safe-area davranışı kullanıcı denemesiyle doğrulanıyor.
- Hesap/senkron yok: cihaz değişince ya da tarayıcı verisi silinince ilerleme gider (yedek dosya tek koruma).
- Motivasyon ve aşk notları hâlâ "(örnek)" metinleri; **gerçek notlar henüz girilmedi**. Ürünün duygusal özelliği bu yüzden boş.
- Fizik ve Kimya hiç başlanmadı; kullanıcının önceliği Biyoloji → Coğrafya → Türkçe → teknik/profil oldu.
- Aşamalı onay akışı gereği `main` ile `gelistirme` hep aynı noktada; gerçek bir "ara onay/etiket" süreci henüz işletilmedi.

## 7. Açık işler (önerilen sıra)

1. **Soru kalite taraması** (özellikle Türkçe dil bilgisi): her konudan örneklem alıp çift savunulabilir cevap, zayıf çeldirici ve kök üslubu kontrolü; gerekirse ÖSYM stiline yakın yeniden yazım.
2. Gerçek motivasyon ve aşk notlarının girilmesi, karakter/ana sayfa duygusunun tamamlanması.
3. Coğrafya'nın kalan 8 konusu (kullanıcı transkript yükledikçe, gün sırasıyla).
4. Keşif konumlarının derslerle karşılaştırılması; gerekirse düzeltme.
5. Fizik/Kimya paketleri ve AYT Biyoloji'nin kalan konuları.
6. Sunucu (hata bildirimi, senkron) kararının yeniden düşünülmesi: gerçekten gerekli mi, yoksa yedek dosya yeterli mi?
7. Performans ölçümü (düşük donanımlı telefonda açılış süresi, betik boyutları) ve çevrimdışı çalışma kontrolü.
8. Kullanıcıyla gerçek kullanım denemesi: önce küçük bir geri bildirim turu, sonra konu eklemeleri ve küçük iyileştirmeler.

## 8. Değerlendirmeyi yapacak kişiye (Opus) sorular

1. İçerik üretim hattı (kaynak okuma → özgün yazım → şema doğrulama → kullanıcı onayı) bilimsel doğruluk açısından yeterli mi? Düşük maliyetli hangi ek kontrol (ikinci bir model geçişi, örneklem denetimi, kaynakla çapraz kontrol) en çok hatayı yakalar?
2. Soru kalitesi için somut bir ölçüt/kontrol listesi önerir misin (ÖSYM üslubu, çeldirici kalitesi, tek doğru cevap, zorluk dağılımı)?
3. Maddeye bağlı soru yapısı ve Leitner tekrar mantığı bu kullanım için doğru mu, yoksa gereğinden mi karmaşık?
4. Mimari (saf JS, hash yönlendirme, ders başına büyük betikler, localStorage): kullanıcı sayısı bir ise bu uygun mu; hangi noktada büyük riskler çıkar?
5. Ürün yönü: Keşif oyunları, Gözden Geçir ve Profil için sırayı ve önceliği nasıl görürsün? Ders içeriği mi, motivasyon/duygusal özellikler mi, kalite taraması mı önce?
6. Kullanıcının (teknik olmayan proje sahibi) iş akışını nasıl sadeleştirebilirim; hangi adımlar gereksiz ya da riskli?

## 9. Dosya haritası

- `index.html`, `style.css`, `app.js`, `sw.js`, `config.js`, `karakter.js`: uygulama kabuğu (app.js ~1700 satır)
- `data/index.js`: ders ve konu listesi (72 konu)
- `data/biyoloji-tyt.js`, `biyoloji-ayt.js`, `sosyal-tyt.js`, `turkce-tyt.js`: ders içerikleri
- `data/harita.js`, `ulkeler.js`: Natural Earth haritaları; `mola.js` (ülke-başkent), `turkiye-yer.js`, `dunya-yer.js`: Keşif verileri
- `PLAN.md`, `CLAUDE.md`, `README.md`: plan ve kurallar
- `kaynaklar/` (commit edilmez): kaynak notları ve materyaller

Not: İçerik üretici betikleri ve geçici dosyalar (Python) depoda yok, oturum çalışma alanındaydı; içerik doğrudan `data/*.js` dosyalarında.

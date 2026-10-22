# YKS Çalışma Köşesi — Yeniden Tasarım Planı

Bu belge, sitenin yeniden yapımı için konuşularak alınan kararların tamamıdır. Siteyi geliştiren her oturum (Sonnet dahil) işe başlamadan önce bu belgeyi okur ve buradaki kurallara uyar. Bir karar değişirse önce bu belge güncellenir.

**Durum (22 Ekim 2026):** **v1.0 yayında** (etiket `v1.0`). **1.1.3 yayında:** TYT Türkçe, Biyoloji (TYT ve AYT) ve Coğrafya taramaları bitti; Opus kör çözüm kontrolünden geçti (1.1.3: kontrolde bulunan 16 soru düzeltildi). Sıradaki kilometre taşı **1.1 Kalite ve çeşitlilik** (§10): kısa soru tipleri, motivasyon notları, yedek hatırlatması. Ayrıntılı durum: `SUREC-RAPORU.md`.

---

## 1. Amaç ve ton

- Kullanıcı: YKS'ye ikinci kez hazırlanan, **sayısal** puan türünde bir öğrenci.
- Asıl amaç: uzanırken, dinlenirken, "öylesine bir anda" telefondan açıp **pratik tekrar** yapabilmesi. Temel ve ezber bilgiyi bol ve çeşitli soruyla kalıcı hale getirmek.
- **Ton rahat ve baskısız.** Site stres yaratmaz:
  - Ana sayfada kalan gün sayısı **yok**.
  - "Yanlış" kelimesi öne çıkmaz: yanlış defteri **"Tekrar edeceklerim"**, sonuçlar "8 bilgi pekişti, 3'ü tekrar listesine eklendi" gibi.
  - Kırmızı alarm renkleri, düşen puan, "seri bozuldu" uyarısı yok.
    - İstisna (1.0 ara onayı): testte yanlış işaretlenen şık **yumuşak, açık tonlu bir kırmızı** ile gösterilir (alarm değil, sade bir işaret). Doğru şık yumuşak yeşil.
  - İstatistik yargılamaz, yönlendirir: "En zayıf konular" değil **"Biraz ilgi bekleyenler"**.
- Sıcak, kişisel bir dokunuş: sevgilisinin yazdığı motivasyon notları ve test sonu aşk notları.

## 2. İçerik

### Dersler
TYT ve AYT **ayrı** tutulur. Kapsam ezber ve temel bilgi ağırlıklı kısımlardır; işlem ve hesap soruları kapsam dışıdır.

| Ders | Kapsam |
|---|---|
| Biyoloji | TYT + AYT |
| Kimya | TYT + AYT, işlemsiz ve ezber bazlı kısımlar |
| Fizik | Kavram, formül ve birim bilgisi, kavram yanılgıları (hesap yok) |
| TYT Sosyal | Coğrafya, tarih, felsefe, din |

> Karar (1.0 ara onayı): TYT Sosyal şimdilik sitede **"Coğrafya"** adıyla görünür, çünkü ilk içerik yalnızca coğrafya. Tarih, felsefe ve din eklenince ders adı yeniden düşünülür.
| TYT Türkçe | Yazım, noktalama, dil bilgisi |

### Öncelikli konular (ilk geniş soru havuzu)
Önce bunlar için geniş bir havuz hazırlanır, diğer konular kullanımdan gelen geri bildirimle eklenir. Konu listesi **taslaktır**. Gönderilecek PDF ve slaytlara göre kesinleşir.

- **Fizik: TYT**
  Fizik bilimine giriş · Madde ve özellikleri · Hareket ve kuvvet · İş, güç, enerji · Isı, sıcaklık, genleşme · Elektrostatik · Elektrik akımı ve devreler · Manyetizma · Basınç ve kaldırma kuvveti · Dalgalar · Optik
- **Biyoloji: sinir sistemi ve endokrin sistem**
  Sinir sistemi (nöron, impuls iletimi, sinaps, merkezî ve çevresel sinir sistemi, refleks) · Endokrin sistem (bezler, hormonlar, geri bildirim). Bu konular müfredatta AYT'dedir. TYT'den ilişkili temel bilgiler (örn. hücre zarı ve madde geçişi) PDF'lere göre bağlantı olarak eklenebilir.
- **Kimya: TYT, işlemsiz ve ezber bazlı**
  Kimya bilimi (alt dallar, laboratuvar güvenlik işaretleri) · Atom modelleri ve periyodik sistem (periyodik özellikler, grup adları) · Kimyasal türler arası etkileşimler (bağ türleri, zayıf etkileşimler) · Maddenin halleri (kavramlar) · Karışımlar ve ayırma yöntemleri · Asitler, bazlar, tuzlar (özellikler, günlük hayat) · Kimya her yerde (temizlik maddeleri, polimerler, ilaçlar, gıdalar) · Doğa ve kimya
- **Coğrafya: TYT, öncelik harita bilgisi**
  **Harita bilgisi (ölçek, izohips, profil, koordinat, projeksiyon)** · Dünya'nın şekli ve hareketleri · Coğrafi konum · Atmosfer ve iklim · İç ve dış kuvvetler · Türkiye'nin yer şekilleri · Nüfus, göç, yerleşme · Ekonomik faaliyetler · Doğal afetler

Konu başına soru sayısı sabit değildir. Kullandıkça büyütülür.

### Kaynak ve doğruluk
- İçerik **gönderilen PDF ve slaytlardan** üretilir. Kaynakta olmayan ya da emin olunmayan bilgi eklenmez.
- **Ek kaynaklar (karar: 1.0 ara onayı):** `kaynaklar/` içindeki dosyalara ek olarak **MEBİ** ve **OGM Materyal** sayfalarındaki konu özetleri ve örnek sorular da **okunarak** kaynak olarak kullanılabilir. Kurallar: sayfalar uygulamanın içindeki tarayıcıda açılır, giriş gerekiyorsa (MEBİ) **proje sahibi kendisi giriş yapar**, Claude şifre girmez. Sayfalardan toplu indirme yapılmaz; konu konu okunur. Metin, soru ve görsel **olduğu gibi kopyalanmaz**: bilgi özgün cümlelerle yeniden yazılır, sorular özgün kurulur (depo herkese açık). Her konu paketine, hangi kaynaktan beslendiği `kaynaklar/` içinde tutulan **özel bir notla** kaydedilir (commit edilmez).
- Kaynaklardaki metin ve görseller kopyalanmaz. Bilgi özgün cümlelerle yazılır, görseller SVG olarak yeniden çizilir.
- Mevcut 40 soru **kullanılmaz**. İçerik sıfırdan üretilir.
- PDF ve slaytlar proje içindeki `kaynaklar/` klasörüne konur. Bu klasör `.gitignore`'dadır: depo herkese açık olduğu için kaynaklar **asla commit edilmez**, yalnızca onlardan üretilen içerik dosyaları commit edilir.

### Bilgi havuzu yapısı
Her konu için önce **doğrulanmış kısa bilgi maddeleri** yazılır (tek gerçek kaynak). Bütün soru tipleri ve konu özeti bu maddelerden türetilir. Bir bilgi düzeltildiğinde ona bağlı her şey düzelir ve ilerleme kaybolmaz.

### Soru tipleri
1. Klasik 5 şıklı, ÖSYM üslubu (I-II-III öncüllü sorular dahil)
2. Doğru / Yanlış hızlı tur
3. Bilgi kartı (ön yüzde kavram, arka yüzde tanım; "biliyordum / bilmiyordum")
4. Eşleştirme (örn. hormon – salgılandığı bez)
5. Boşluk doldurma (cümledeki eksik kavramı seçme)

**Monotonluk olmasın:** Bir testte tipler karışık gelir. Aynı bilgi farklı günlerde farklı tiplerle sorulur.

### Görseller
Harita, izohips, profil ve şemalar **kodla çizilmiş SVG** olarak hazırlanır. Hafiftir, koyu modda nettir, çevrimdışı çalışır.

### Konu özeti (hap bilgi)
Her konunun **Özet** sekmesi olur: bilgi maddeleri kısa ve kompakt notlar halinde, başlıklar altında. Böylece ayrıca PDF açmaya gerek kalmaz. Soru dipnotlarından ilgili özete tek dokunuşla geçilir.

## 3. Site yapısı

> **Karar (1.0 ara onayı, sonraki kararlar bunun önüne geçer):**
> - Alt çubukta **3 sekme**: Ana sayfa · Gözden Geçir · Mola (soldan sağa; Mola en sağda).
> - **Profil** alt çubuktan çıktı: ekranın **sağ üst köşesinde yuvarlak bir simge**, profil ve ayarlara buradan girilir. Sol üstte "YKS Köşesi" markası durur.
> - Konu sayfası sekmeleri **Özet · Test · Tekrar** (eski adı "Çalış"). Özet yeşil/kart temalı, Test toprak rengi/soru temalı, Tekrar bal rengi; her sekmenin altında kısa bir tanım satırı görünür.
> - Özet **kart akışıdır**: bölüm seç, kartları gez. **Sağa kaydır / "Yess!"** = oturdu, **sola kaydır / "Tam oturmadı sanki?"** = tekrar listesine. Bilgisayarda ← → tuşları da çalışır.
> - Ana sayfa yeniden düzenlenecek: üstte selamlama + not, altında ilerleme, altında Kısa tur butonu; selamlayan bir karakter (gündüz/gece) planlanıyor.
> - **Mola sekmesi "Keşif" oldu** (alt başlık "Harita oyunları", dünya simgesi, serin mavi tema): başkent bul, haritada ülke bulma, Türkiye ve dünya yer şekilleri oyunları; haritalar sürüklenip yakınlaştırılabilir. Mola'daki "aşk notu yok" kuralı geçerli.

Alt sekme çubuğu (eski plan, **4 sekme** idi; yukarıdaki karar geçerli):

### 3.1 Ana sayfa
- **Bugün kartı:** tekrarı gelen madde sayısı ve **"Kısa bir tur"** (2-3 dakikalık, 5-10 maddelik mini tekrar). Yarıda bırakılırsa kaldığı yerden devam eder, bırakmak hiçbir şeyi bozmaz.
- **Hızlı karışık test:** tek dokunuşla 20 soru. Yanındaki "Özelleştir" ile ders, konu, soru tipi, soru sayısı ve mod seçilir.
- **Motivasyon notu** (bkz. §5).
- **TYT | AYT sekmeleri, ardından ders ve konu listesi.** Her konuda yumuşak bir ilerleme çubuğu ve kazanıldıysa rozet.

### 3.2 Konu sayfası
Üstte **Özet | Çalış | Tekrar** sekmeleri, başlıkta ilerleme ve rozet.
- Özet: hap bilgiler
- Çalış: o konudan yeni test
- Tekrar: o konuda tekrarı gelenler

### 3.3 Mola (kafa dağıtma, dersten bağımsız)
- **Başkent bul:** ülke → başkent ve başkent → ülke
- **Haritada ülke bul:** vurgulanan ülkenin adını seçme ya da adı verilen ülkeye haritada dokunma
- **Türkiye illeri:** haritada ili bulma, plaka kodu
- Varsayılan mod **rahat** (süresiz, puansız, "bu turda 14/20" gibi hafif sonuç). İstenirse **60 saniyelik tur ve kişisel rekor**.
- Harita verisi kamuya açık (public domain) **Natural Earth** sınırlarından sadeleştirilmiş SVG olarak hazırlanır. Yalnızca bu sekmeye girilince yüklenir.
- Mola'da aşk notları çıkmaz. Kendi hafif mesajları olur.

### 3.4 Gözden Geçir
Üstte küçük sekmeler:
- **Tekrar edeceklerim:** yanlış yapılanlar dipnotlarıyla bir arada, konuya göre filtrelenir, buradan test başlatılır
- **Favoriler:** yıldızlanan sorular ve kaydedilen hap bilgiler
- **İstatistik (sade):** ders bazında başarı çubuğu, "Biraz ilgi bekleyenler" (5 konu, her birinde "Tekrar et" düğmesi), haftalık çözülen soru sayısı
- **Çalışma geçmişi:** takvim görünümü, hangi gün ne kadar ve hangi konular çalışılmış

### 3.5 Profil
- İsim, hedef bölüm ve üniversite, **TYT ve AYT net hedefi**
- **Deneme netleri:** elle kaydedilen deneme sonuçları ve hedefe göre ilerleme listesi
- Rozetler vitrini
- Toplam özet: çözülen soru, öğrenilen madde, çalışılan gün
- Hesap ve senkron: e-posta ile giriş, son senkron zamanı, çıkış
- **Kalan gün:** profilde küçük olarak durur, **varsayılan kapalı**, ayarlardan açılır
- Sağ üstteki dişliden **Ayarlar** açılır:
  - Görünüm: açık / koyu / sistem teması, yazı boyutu
  - Ses ve titreşim aç/kapa
  - Kalan gün göster/gizle
  - En altta küçük olarak sürüm numarası

## 4. Test akışı

- **Mod testi başlatırken seçilir:** *anlık geri bildirim* (her sorudan sonra doğru/yanlış ve dipnot) ya da *sonda toplu sonuç*.
- **Soru ekranı:** soru üstte, şıklar başparmağın uzandığı **alt yarıda**. Cevaptan sonra "Devam" düğmesi aynı yerde. Büyük dokunma alanları.
- **Geçişler:** kısa ve yumuşak. Kartta çevirme efekti, doğruda ve yanlışta hafif titreşim. Hiçbir şey kullanıcıyı bekletmez.
- **Hatalı bildir:** her soruda küçük bir bayrak düğmesi. Bildirim Supabase'e düşer.
- **Favori:** her soruda yıldız.
- **Sonuç ekranı:**
  - Doğru ve yanlış özeti (yumuşak dille), tekrar listesine eklenenlerin dipnotları
  - "Bunları hemen tekrar et": yalnızca yanlışlarla mini tur
  - Yanlışın en çok olduğu konunun özetine geçiş
  - **Test sonu aşk notu** (bkz. §5)

## 5. Notlar

### Motivasyon notları (ana sayfa, test araları)
- Bir kısmını **sevgilisi yazar**, bu notlar önceliklidir. Aralara Claude'un aynı tonda yazdığı sıcak ve kısa notlar karışır.
- Sevgilisinin notları istenirse küçük bir imza ya da kalple ayrılır.

### Test sonu aşk notları 💗
- Motivasyon notlarından ayrıdır. Teste ve başarı oranına göre seçilir.
- **3 basamak:** Düşük (%0–40) · Orta (%40–75) · Yüksek (%75–100)
  - Örnek ton: düşükte "Pes etmek yok sevgilim, devam et", yüksekte "İşte böyle! Süpersin doktor hanım"
- **Kalpler içinde, bol pembeli** özel bir sonuç kartında gösterilir. Koyu modda da pembe kalır.
- İlk örnekleri sevgilisi yazar, Claude aynı tonda çoğaltır, hepsi onaydan geçer.
- **Mola hariç** her test sonunda (konu testi, karışık test, kısa tur) çıkar.

### Notların kaynağı
Notlar **Supabase'deki bir tabloya** yazılır ve site oradan çeker, yeni not için push gerekmez. Çevrimdışıyken son indirilen notlar gösterilir. Supabase aşamasına kadar notlar bir dosyadan (`config.js` benzeri) okunur.

## 6. Akıllı tekrar (Leitner): taslak

Her bilgi maddesinin bir **kutusu** vardır:

| Kutu | Doğru yapılınca sonraki tekrar |
|---|---|
| 1 | 1 gün sonra (yeni ve yanlış yapılan maddeler buradan başlar) |
| 2 | 2 gün sonra |
| 3 | 4 gün sonra |
| 4 | 8 gün sonra |
| 5 | 16 gün sonra, 5. kutuda yine doğru yapılırsa **kalıcı** olur (30 günde bir kontrol) |

- Yanlış yapılan madde **1. kutuya** döner ve "Tekrar edeceklerim" listesine girer.
- "Bugün" kartında tekrar zamanı gelen maddeler sayılır.
- **Konu ustalığı rozeti:** bir konudaki maddelerin en az %80'i 4. kutu veya üstündeyse kazanılır.
- Aralıklar kullanımdan gelen geri bildirimle ayarlanabilir.

## 7. Teknik yapı

- **Saf HTML / CSS / JS**, derleme yok, harici kütüphane ve CDN yok, sistem yazı tipleri. GitHub Pages üzerinde çalışır.
- **Hız birinci önceliktir:**
  - İlk açılışta yalnızca uygulama kabuğu, konu listesi ve ilerleme yüklenir. Hedef: ikonlar hariç ~100 KB altı.
  - İçerik **ders ve sınav bazında ayrı dosyalarda** tutulur ve o derse ilk girildiğinde yüklenir.
  - Mola haritaları yalnızca Mola sekmesinde yüklenir.
  - Service worker her şeyi önbelleğe alır, site çevrimdışı çalışır.
- **Veri önce telefona yazılır** (anında ve çevrimdışı). İnternet varken arka planda Supabase'e gönderilir. Çakışmada her öğe için en son güncellenen kayıt geçerli olur.

### Dosya düzeni: taslak
```
index.html, style.css, app.js        uygulama kabuğu
sw.js, manifest.json, ikonlar
data/index.js                        DERSLER, KONULAR (hafif, hep yüklenir)
data/biyoloji-ayt.js, data/fizik-tyt.js, ...   ders × sınav içerik dosyaları
data/mola/ulkeler.js, data/mola/dunya.svg, data/mola/turkiye.svg
config.js                            Supabase'e geçene kadar notlar
```

### İçerik şeması: taslak
```js
// data/index.js
KONULAR = [{ id: "bio-ayt-sinir", sinav: "ayt", ders: "biyoloji",
             ad: "Sinir Sistemi", dosya: "biyoloji-ayt", oncelik: true }]

// data/biyoloji-ayt.js
MADDELER = [{
  id: "bio-ayt-sinir-001",          // sabit; asla değişmez, ilerleme buna bağlı
  konu: "bio-ayt-sinir",
  baslik: "Nöron",                  // özet sekmesindeki alt başlık
  bilgi: "Uyarıyı hücre gövdesine taşıyan uzantı dendrittir.",  // özet cümlesi
  kart: { on: "Dendrit", arka: "Uyarıyı hücre gövdesine taşıyan uzantı" },
  dy: [{ ifade: "Akson uyarıyı hücre gövdesine taşır.", dogru: false }],
  bosluk: { cumle: "Uyarıyı hücre gövdesine ___ taşır.", cevap: "dendrit",
            celdiriciler: ["akson", "miyelin", "sinaps"] },
  eslestir: { grup: "noron-kisimlari", sol: "Dendrit", sag: "Uyarıyı gövdeye taşır" },
  dipnot: "Dendrit → gövde → akson: uyarının yönü hep budur."
}]
SORULAR = [{                         // klasik ve öncüllü sorular
  id: "bio-ayt-sinir-q001", konu: "bio-ayt-sinir",
  maddeler: ["bio-ayt-sinir-001"],  // bağlı olduğu bilgi maddeleri
  soru: "...", secenekler: ["...", "...", "...", "...", "..."],
  dogru: 2, sabit: false, gorsel: null, dipnot: "..."
}]
```
Örnekteki cümleler yalnızca şemayı göstermek içindir. Gerçek içerik kaynaklardan doğrulanarak yazılır.

### Supabase: taslak
- **Ücretsiz plan** yeterli (tek kullanıcı, birkaç MB). 1 hafta hiç kullanılmazsa uykuya geçer, panelden tek tıkla uyanır. Kurulumdan önce güncel ücretsiz plan koşulları kontrol edilir. Yedek seçenek Firebase'in ücretsiz planı.
- **Kütüphane yok**, düz `fetch` ile REST API kullanılır.
- **Giriş:** e-posta bağlantısı (şifresiz), her cihazda bir kez.
- Tablolar (satır düzeyi güvenlik açık, herkes yalnızca kendi verisini görür):
  - `ilerleme`: kullanıcı, öğe id, kutu, sonraki tekrar, doğru/yanlış sayacı, güncellenme zamanı
  - `favoriler`, `gecmis` (gün bazında sayaç), `profil` (isim, hedef, net hedefleri, ayarlar), `denemeler`
  - `notlar`: tür (`motivasyon` | `test_sonu`), basamak (`dusuk` | `orta` | `yuksek`), metin, yazar, aktif
  - `hata_bildirimleri`: öğe id, açıklama, zaman, durum

## 8. Sürüm akışı

- **Tek link, sürekli güncellenen site.** Her onaylanan değişiklik aynı adrese yayınlanır: `https://dorukekmekcioglu.github.io/yks-calisma/`
- **1.0:** ilk kullanılabilir sürüm, yayına girdiği anda eski sitenin yerini alır.
- **1.1, 1.2, …:** özellik aşamaları ve geri bildirimle yapılan değişiklikler.
- **1.x.y:** yalnızca içerik ekleyen ya da düzelten küçük güncellemeler (örn. yeni konu paketi).
- **2.0:** ileride büyük bir değişiklik olursa.
- **Güncelleme bildirimi:** yeni sürüm yayınlanınca site bunu algılar ve **"Yeni sürüm hazır 💗 Yenile"** bildirimi gösterir. Güncellemeden sonra bir kereliğine kısa bir **"Yenilikler"** notu çıkar.
- İlerleme, favoriler ve tekrar listesi sürüm değişse de korunur.
- Her sürüm git'te etiketlenir (`v1.0`, `v1.1`, …). Sorun çıkarsa önceki sürüme dönülür.

## 9. Aşamalı çalışma kuralı

Geliştirme küçük aşamalarla ilerler. **Onaylanmamış hiçbir şey yayına girmez.**

1. Çalışma `gelistirme` branch'inde yapılır.
2. Her aşamanın sonunda geliştiren oturum:
   1. Ne yaptığını kısaca ve teknik olmayan bir dille özetler.
   2. Siteyi uygulamanın içindeki tarayıcıda telefon boyutunda açar, kendisi test eder, ekran görüntüsünü gösterir.
   3. Gerçek telefonda deneme için Mac'te yerel bir sunucu açar ve aynı Wi-Fi'den bağlanılacak adresi verir (örn. `http://192.168.x.x:8000`).
   4. **Onay ya da düzeltme bekler.** Onay gelmeden bir sonraki aşamaya geçmez.
3. Onaydan sonra commit atılır, `main`'e alınır, sürüm etiketlenir ve push edilir. Push'u gerekirse proje sahibi kendi terminalinden yapar.
4. Her yayında `sw.js` içindeki önbellek adı ve sürüm numarası güncellenir, "Yenilikler" notu yazılır.

## 10. Kilometre taşları

1.0 sırasında plan ara onaylarla değişti (yukarıdaki "Karar" notları). Tamamlanan 1.0'dan sonraki sıra aşağıdadır. Her kilometre taşı, kendi içinde §9'daki aşamalı onay akışıyla ilerler.

| Sürüm | Ad | Kapsam | Bitti sayılması için |
|---|---|---|---|
| **v1.0** ✅ | İlk sürüm | 3 sekme (Ana sayfa, Gözden Geçir, Keşif) ve profil simgesi · konu sayfası (Özet kart akışı, Test, Tekrar) · klasik, öncüllü ve görselli sorular · Leitner ve yerel ilerleme · yedek al/geri yükle · Keşif harita oyunları · service worker · içerik: TYT Biyoloji, AYT Sinir ve Endokrin, Coğrafya 8 konu, TYT Türkçe dil bilgisi (874 madde, 1305 soru) | Etiketlendi: `v1.0` |
| **1.1** | Kalite ve çeşitlilik | **Yeni konu eklenmez.** (1) `SORU-REHBERI.md` ve `araclar/denetim.py` devreye girer. (2) Mevcut bilgi maddeleri ve sorular rehbere göre taranır, **önce TYT Türkçe**, sonra Biyoloji ve Coğrafya. (3) Kısa soru tipleri: **Doğru/Yanlış, bilgi kartı, boşluk doldurma, eşleştirme**, bilgi maddelerinden türetilir, testlerde ve kısa turda tiplerle karışık gelir. (4) Gerçek motivasyon ve aşk notları girilir. (5) Profil'de nazik bir yedek hatırlatması ("Son yedek 12 gün önce"). | Denetim betiği hatasız geçiyor · her konu kör çözücü kontrolünden geçti (rehber §7) · her ders için 10 soruluk örneklem proje sahibince onaylandı · kısa tipler sitede çalışıyor · "(örnek)" not kalmadı |
| **1.2** | Coğrafya tamam | Coğrafya'nın kalan 8 konusu (rehbere göre üretilir) · Keşif'teki Türkiye ve dünya yer konumlarının ders içeriğiyle karşılaştırılıp düzeltilmesi | Coğrafya 15/15 konu, denetim ve kör çözücü temiz |
| **1.3** | Fizik ve Kimya | Öncelikli TYT Fizik ve işlemsiz TYT Kimya konuları (§2) | Öncelikli konular hazır, denetim ve kör çözücü temiz |
| **1.4** | Biyoloji genişleme | AYT Biyoloji'nin kalan konuları, kullanım geri bildirimine göre | |
| **sonra** | Senkron ve hız | Sunucu kararı (Supabase gerçekten gerekli mi, yoksa yedek dosya yeterli mi?) · gerçek telefonda açılış süresi ölçümü, büyük ders dosyalarının bölünmesi | |

Ara içerik güncellemeleri 1.x.y olarak yayınlanır (örn. 1.1.1: Türkçe taraması bitti). Sıra ihtiyaca göre değişebilir. Değişirse bu tablo güncellenir.

## 11. Kapsam dışı

- Matematik ve hesap gerektiren sorular
- Stres yaratan öğeler: öne çıkan geri sayım, kırmızı uyarılar, seri cezaları
- Harici kütüphane, CDN, harici yazı tipi
- Kaynaklardan metin ve görsellerin olduğu gibi kopyalanması
- Sitede içerik yönetim ekranı (notlar Supabase panelinden, içerik dosyalardan yönetilir)

## 12. Proje sahibinden beklenenler

- [ ] Konu ve örnek soru kaynakları: **PDF ve slaytlar**, önce öncelikli konular için (`kaynaklar/` klasörüne)
- [ ] İlk **motivasyon notları**
- [ ] İlk **test sonu aşk notları**, 3 basamak için birkaçar tane
- [ ] Karşılama ismi ve tercih edilen hitaplar
- [ ] 1.6 öncesi: Supabase hesabı (birlikte kurulacak)

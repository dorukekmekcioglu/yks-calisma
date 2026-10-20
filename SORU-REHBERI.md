# Soru Rehberi

Bu sitede bilgi maddesi, soru, özet kartı ya da dipnot yazan ve düzelten **her oturum bu rehberi okur ve uygular.** Kurallar ölçülebilir olacak şekilde yazıldı. Ölçülebilenleri `araclar/denetim.py` kontrol eder (§8).

Rehberin amacı tek cümleyle şu: **Her soru, ilgili bilgiyi gerçekten bilen birinin doğru cevabı bulacağı, bilmeyen birinin ise tahminle bulamayacağı şekilde yazılır.**

---

## 1. Önce bilgi maddesi

Sorular bilgi maddelerinden türetilir. **Yanlış ya da bulanık bir madde, ona bağlı bütün soruları bozar.** Bu yüzden madde, sorudan önce kontrol edilir.

- **Tek madde, tek fikir.** Bir madde en fazla 2-3 cümle olur. Birden fazla kural içeriyorsa bölünür.
- **Kural açık ve ters okunamayacak biçimde yazılır.** Önce kural, sonra örnek gelir.
- **Kaynakla karşılaştırılır.** Kaynaklar da hatalı olabilir (bkz. İç Kuvvetler PDF'indeki Richter/Mercalli karışıklığı). İki kaynak çelişiyorsa ders kitabı (MEB/OGM) esas alınır ve durum proje sahibine söylenir.
- `ipucu` alanı bir hatırlatma cümlesidir, kural değildir. Maddedeki kuralla çelişmemelidir.

**Kötü örnek (projeden, `tur-tyt-ses-003`):**
> "Küçük ünlü uyumu: düz bir ünlüden (a, e, ı, i) sonra düz ya da yuvarlak geniş bir ünlü (a, e) ya da dar yuvarlak (u, ü) gelmez; …"

Bu cümle "düz ünlüden sonra a, e gelmez" diye okunuyor, bu da yanlış.

**Düzeltilmiş hali:**
> "Küçük ünlü uyumu: düz ünlülerden (a, e, ı, i) sonra yine düz ünlüler gelir. Yuvarlak ünlülerden (o, ö, u, ü) sonra ya düz-geniş (a, e) ya da dar-yuvarlak (u, ü) ünlüler gelir: kapı, gözlük, oyun."

## 2. Soru tipleri: hangisi ne için?

Uygulamanın amacı ezber tekrarı. Tekrarın çoğu **kısa tiplerle** yapılır, 5 şıklı soru ise ÖSYM pratiği içindir.

| Tip | Ne ölçer | Bir madde için kaç tane |
|---|---|---|
| Bilgi kartı | Hatırlama (kavram ↔ tanım) | 1 (gerekirse iki yönlü) |
| Doğru / Yanlış | Tanıma, kavram yanılgısı | 1-2 (biri doğru, biri yanlış ifade) |
| Boşluk doldurma | Kavramı bağlamında hatırlama | 0-1 |
| Eşleştirme | Bir gruptaki ilişkileri ayırt etme | Gruptaki maddeler ortak bir set kurar |
| 5 şıklı (klasik) | ÖSYM tarzında uygulama ve ayırt etme | Konu başına, madde sayısının yaklaşık 1-1,5 katı |
| Öncüllü (I-II-III) | Birden fazla bilgiyi birlikte değerlendirme | Konu sorularının **en az %15'i** |

**Çeşitlilik kuralı:** Aynı maddeye bağlı 5 şıklı sorular aynı şeyi farklı kelimelerle sormaz. Her biri başka bir açıdan sorar: tanım, örnek, karşılaştırma, neden-sonuç, istisna.

## 3. 5 şıklı sorular

### 3.1 Soru kökü
- Kök, şıklara bakmadan da anlaşılabilecek kadar tamdır. Soru kökün içinde sorulur: "Aşağıdakilerden hangisi … ?"
- **Olumsuz kökler** ("… değildir?", "… söylenemez?") konu başına en fazla %20 olur. Olumsuz sözcük kökte **kalın** yazılır (`**değildir**`, bkz. §6).
- Kökte cevabı ele veren bir ipucu bulunmaz. Örnek: kökte "hidro" geçiyorsa doğru şıkta "su" geçmemelidir.
- Kalıplaşmış kökler çeşitlendirilir. Her soru "Aşağıdakilerden hangisi" ile başlamaz: "Bu durumun temel nedeni …", "… ifadelerinden hangileri doğrudur?", "Buna göre …" gibi kökler de kullanılır.

### 3.2 Şıklar
- **Tam olarak 5 şık** olur ve **yalnızca 1 tanesi savunulabilir.** Konuyu iyi bilen bir öğretmen ikinci bir şıkkı "bu da doğru sayılır" diye savunabiliyorsa soru hatalıdır.
- **Şıklar türdeş olur:** hepsi aynı kategoriden (hepsi organel, hepsi iklim tipi, hepsi cümle) ve aynı dil bilgisi yapısında.
- **Şıklar benzer uzunlukta olur.** Doğru şık, çeldiricilerin ortanca uzunluğunun 1,5 katını (ve 15 karakter farkı) geçmemelidir. Doğru cevap en uzun ve en özenli şık olarak yazılırsa öğrenci bilmeden bulur. Bu, yapay zekâ ile üretilen sorularda en sık görülen kusurdur.
- **Doğru şıkkın tek bir "ikizi" olmaz** (aşağıdaki kötü örnek 1). Doğru şık ile tek bir çeldirici aynı cümlenin iki hali ise ("…musun." / "…musun?", "Fenotip" / "Genotip") ve diğer üç şık bunlardan farklıysa, öğrenci cevabın o ikisinden biri olduğunu bilmeden anlar. Kardeş kavramlar kullanılacaksa **bütün şıklar** aynı aileden seçilir (Troposfer / Stratosfer / Mezosfer / Termosfer / Ekzosfer) ya da noktalama sorusunda beş farklı cümle verilir.
- "Hepsi", "Hiçbiri", "A ve B" gibi şıklar kullanılmaz (öncüllü sorular hariç).
- Mutlak sözcükler ("her zaman", "asla", "yalnızca") yalnız çeldiricilerde bulunursa ipucu olur. Kullanılacaksa doğru şıkta da kullanılabilmelidir.

### 3.3 Çeldiriciler
İyi bir çeldirici, **konuyu yarım bilen birini yakalar.** Kaynakları şunlardır:
1. Sık karıştırılan kardeş kavram: akson ↔ dendrit, Richter ↔ Mercalli, belirtili ↔ belirtisiz nesne
2. Kuralın istisnası ya da tersi
3. Aynı listenin başka bir üyesi (başka bir hormon, başka bir iklim tipi)
4. Gerçek bir kavram yanılgısı ("bitkiler yalnızca fotosentez yapar, solunum yapmaz" gibi)

Saçma ya da konu dışı çeldirici kullanılmaz ("Hızla koştu.", "Yardım ettim." gibi hiçbir şeyi sınamayan kısa cümleler).

### 3.4 Dipnot
Dipnot 1-3 cümle olur ve iki şey söyler:
1. **Doğru cevap neden doğru:** kuralın kendisi
2. **En çekici yanlış neden yanlış:** öğrencinin büyük ihtimalle karıştırdığı şey

Dipnot soruyu tekrar etmez ve soruyla ilgisiz bir bilgi vermez. Kötü örnek: "Canlılığın en küçük birimi?" sorusunun dipnotu olarak "Hücre bir önceki hücrenin bölünmesiyle oluşur."

### 3.5 Öncüllü sorular
- 3 öncül (I, II, III) verilir, şıklar standarttır: "Yalnız I", "Yalnız II", "I ve II", "II ve III", "I, II ve III" gibi. Kombinasyonlar soruya göre seçilir ama **5 şık her zaman farklı** olur. `sabit: true` ayarlanır.
- Öncüller `oncul` alanına yazılır. Kökte "Yukarıdakilerden hangileri …" denir.
- Doğru cevaplar konu içinde dengeli dağılır, her zaman "I ve II" çıkmaz.

## 4. Ders ders ÖSYM kalıpları

### Biyoloji
- Yapı-görev: "… görevini yapan yapı aşağıdakilerden hangisidir?"
- Karşılaştırma: "X ve Y'nin ortak özelliği …", "X'te bulunup Y'de bulunmayan …"
- Neden-sonuç: "… hormonunun az salgılanması durumunda aşağıdakilerden hangisi beklenmez?"
- Öncüllü: üç ifadeden hangilerinin doğru olduğu
- Örnek-kavram: "Aşağıdakilerden hangisi … için bir örnektir?"

### Coğrafya
- Harita ve grafik okuma (görselli soru, `gorsel` alanı): "Haritada numaralanmış yerlerden hangisinde …"
- Örnek durum → kavram: kısa bir durum anlatılır, hangi kavrama örnek olduğu sorulur
- Neden: "Bu durumun temel nedeni aşağıdakilerden hangisidir?"
- Öncüllü: "… ifadelerinden hangileri doğrudur?"
- Hesaplı sorular (yerel saat, ölçek) çözümleri elle yeniden yapılarak doğrulanır.

### TYT Türkçe
ÖSYM dil bilgisini **tanım sorarak değil, cümle içinde** sorar.
- Beş cümle verilir, her birinde bir sözcük işaretlidir: "Aşağıdaki cümlelerin hangisinde altı çizili sözcük üleştirme sayı sıfatıdır?"
- Numaralı sözcükler: tek bir cümlede (I)…(V) ile işaretlenmiş sözcükler verilir, "Bu cümledeki numaralanmış sözcüklerden hangisi …?" diye sorulur.
- Numaralı yerler (yazım ve noktalama): kısa bir paragrafta (I)…(V) ile işaretlenmiş yerler verilir, "Bu parçadaki numaralanmış yerlerden hangisine … getirilmelidir?" ya da "hangisinde yazım yanlışı vardır?" diye sorulur.
- Anlatım bozukluğu: beş anlamlı ve doğal cümle verilir, bunlardan **yalnızca biri** bozuktur. Diğer dördü de aynı uzunluk ve karmaşıklıkta olmalıdır.
- Yazım kuralları **TDK Yazım Kılavuzu**'na göre doğrulanır. Emin olunmayan sözcük soruda kullanılmaz.
- **İşaretli sözcük mutlaka işaretlenir** (§6). İşaretsiz bir "altı çizili" sorusu cevaplanamaz.

### Fizik ve Kimya (işlemsiz)
- Kavram yanılgısı: "… ile ilgili aşağıdaki yargılardan hangisi yanlıştır?"
- Birim ve büyüklük eşleme, skaler/vektörel ayrımı, periyodik özelliklerin değişim yönü
- Günlük hayat örneği → kavram (genleşme, kaldırma kuvveti, asit-baz)
- Hesap gerektiren soru yazılmaz.

## 5. Kısa tipler (1.1 ile gelecek)

Kısa tipler bilgi maddesine alan olarak eklenir (PLAN.md §7 şeması):

```js
{ id: "...", konu: "...", baslik: "...", bilgi: "...", ipucu: "...",
  kart:     { on: "Dendrit", arka: "Uyarıyı hücre gövdesine taşıyan uzantı" },
  dy:       [{ ifade: "Akson uyarıyı hücre gövdesine taşır.", dogru: false,
               neden: "Gövdeye taşıyan dendrittir; akson gövdeden uzaklaştırır." }],
  bosluk:   { cumle: "Uyarıyı hücre gövdesine ___ taşır.", cevap: "dendrit",
              celdiriciler: ["akson", "miyelin kılıf", "sinaps"] },
  eslestir: { grup: "noron-kisimlari", sol: "Dendrit", sag: "Uyarıyı gövdeye taşır" } }
```

**Bilgi kartı**
- Ön yüz tek bir kavram ya da kısa bir sorudur, arka yüz en fazla 2 satırdır.
- Arka yüz ön yüzü tekrar etmez ("Dendrit: dendrit uzantısıdır" olmaz).

**Doğru / Yanlış**
- Tek bir iddia içerir. "ve" ile bağlanmış iki iddia olmaz, çünkü biri doğru biri yanlışsa cevap belirsizleşir.
- Konu genelinde doğru ve yanlış ifadeler yaklaşık eşit sayıda olur (%40-60).
- Yanlış ifade gerçek bir karışıklıktan üretilir (kardeş kavram, istisna). Doğru ifadeye bir "değil" eklenerek üretilmez.
- Olumsuz cümle kullanılmaz, çift olumsuz hiç kullanılmaz.
- `neden` alanı yanlış ifadelerde zorunludur, kısa düzeltmeyi içerir.

**Boşluk doldurma**
- Tek boşluk olur, cevap tek bir kavramdır.
- Cümlenin bağlamı cevabı tek kılar. Boşluğa iki seçenek de uyuyorsa cümle yeniden yazılır.
- 3 çeldirici, cevapla aynı türden ve aynı dil bilgisi biçimindedir (hepsi isim, hepsi aynı ekle).

**Eşleştirme**
- Bir grupta 4-5 çift olur, hepsi aynı ilişki türündedir (hormon → bez, element → sembol).
- Eşleşme birebirdir: her sağ öğe yalnızca bir sol öğeye uyar.
- Aynı `grup` adını taşıyan maddeler birlikte bir eşleştirme sorusu oluşturur. Bir grupta en az 4 madde bulunur.

## 6. Biçim işaretleri

Soru metni, şıklar ve öncüller düz metindir. Şu iki işaret kullanılır, uygulama bunları biçimlendirir:

| Yazım | Görünüm | Ne için |
|---|---|---|
| `__sözcük__` | <u>sözcük</u> | Altı çizili sözcük (Türkçe soruları) |
| `**değildir**` | **değildir** | Olumsuz köklerin vurgusu |

**Kural:** Kökte "altı çizili" geçiyorsa **her şıkta tam olarak bir** `__…__` işareti bulunur (ya da tek cümleli sorularda kökte). Denetim betiği bunu kontrol eder.

> Not (1.1 işi): Uygulama şu an bu işaretleri biçimlendirmiyor. Şu anda 8 Türkçe sorusu "altı çizili" diyor ama ekranda hiçbir şey çizili görünmüyor. Bu sorular cevaplanamaz durumda. 1.1'in ilk işlerinden biri, `app.js`'te bu iki işaretin güvenli biçimde (`textContent` ile, `innerHTML` kullanmadan) gösterilmesi ve bu 8 sorunun düzeltilmesidir.

## 7. Üretim ve kontrol akışı

Her konu paketi için:

1. **Kaynağı oku**, bilgi maddelerini yaz (§1).
2. **Soruları yaz** (§2-§6). Tip dağılımını kontrol et.
3. **`python3 araclar/denetim.py` çalıştır.** HATA kalmayana kadar düzelt, UYARI'ları tek tek gözden geçir.
4. **Kendi kendine kör çözüm:** her soruyu yalnızca kökü ve şıkları okuyarak, dipnota ve `dogru` alanına bakmadan çöz. Sana göre cevap farklıysa ya da iki şık da savunulabiliyorsa soru düzeltilir.
5. **Dış kör çözücü:** paket bittiğinde başka bir model oturumu (Opus) soruları cevap anahtarı olmadan çözer. Uyuşmayan her soru incelenir. Bu adım atlanırsa paket "hazır" sayılmaz.
6. **Örneklem onayı:** proje sahibine konudan rastgele 10 soru gösterilir. 2 veya daha fazla sorunlu soru çıkarsa paket bütünüyle yeniden taranır.

## 8. Denetim betiği

```bash
python3 araclar/denetim.py              # bütün dersler
python3 araclar/denetim.py turkce-tyt   # tek ders
python3 araclar/denetim.py --ozet       # yalnızca konu tablosu
```

**HATA** (commit'ten önce sıfır olmalı):
- Şık sayısı 5 değil, birebir aynı iki şık var, `dogru` aralık dışında
- Kökte "altı çizili" geçiyor ama `__…__` işareti yok
- Soru var olmayan bir maddeye bağlı, test var olmayan bir soruyu listeliyor, kimlik tekrarı var
- Dipnot boş

**UYARI** (gözden geçirilir, gerekçesi varsa kalabilir):
- Doğru şık belirgin biçimde en uzun (çeldiricilerin ortancasının 1,5 katı ve en az 15 karakter fazla)
- Cevabı ele veren ikiz şık: doğru şıkkın çok benzer tek bir eşi var, diğer şıklar farklı
- Aynı soru tekrar ediyor: aynı konuda kök ve doğru cevap neredeyse aynı (görselli sorular hariç)
- Dipnot çok kısa ya da soruyu tekrar ediyor

**Konu tablosu** (hedefler):

| Ölçü | Hedef |
|---|---|
| Doğru şıkkın en uzun şık olma oranı | ≤ %30 (rastgele olsa ~%20 olurdu) |
| Öncüllü soru oranı | ≥ %15 |
| Olumsuz kök oranı | ≤ %20 |
| Sabit sıralı sorularda doğru şık dağılımı | Her harf %10-30 arası |

## 9. Kötü ve iyi örnekler (projeden)

**Kötü 1: ikiz şık** (`tur-tyt-bitisik-birlesik-q019`)
> Aşağıdaki cümlelerin hangisinde yazım yanlışı vardır?
> Suçüstü yakalandı. / Gerçeküstü bir öykü okudu. / Olağanüstü bir başarı gösterdi. / **Öğle üzeri evden çıktı.** / Öğleüzeri evden çıktı.

İki şık aynı cümlenin iki yazımı olduğu için cevap ikisinden biri olmak zorunda. Soru, yazım bilgisini değil dikkati ölçüyor.

**İyi:**
> Aşağıdaki cümlelerin hangisinde birleşik bir sözcüğün yazımı yanlıştır?
> A) Akşamüstü sahile indik.
> B) Bahçedeki hanımelleri açmıştı.
> C) Her pazar uzun bir kahve altı yapardık. ✔
> D) Başöğretmen törende kısa bir konuşma yaptı.
> E) Olağanüstü bir gayretle çalıştı.
>
> Dipnot: Ses düşmesiyle kaynaşan birleşik sözcükler bitişik yazılır: kahve + altı → kahvaltı. Akşamüstü, hanımeli ve başöğretmen de bitişik yazılır.

**Kötü 2: doğru şık en uzun** (`biy-tyt-giris-q015`)
> Prokaryot hücrelerle ilgili aşağıdakilerden hangisi doğrudur?
> Çekirdek bulunur. / Mantarlar bu gruptadır. / Zarlı organeller bulunur. / Hayvan hücreleri bu gruptadır. / **Çekirdek ve zarlı organeller yoktur; organel olarak yalnızca ribozom vardır.**

**İyi:**
> Prokaryot hücrelerle ilgili aşağıdakilerden hangisi doğrudur?
> A) Zarla çevrili bir çekirdekleri vardır.
> B) Mitokondri bulundururlar.
> C) Ribozom bulundururlar. ✔
> D) Mantarlar bu gruptadır.
> E) Endoplazmik retikulumları vardır.
>
> Dipnot: Prokaryotlarda zarlı organel yoktur. Ribozom zarsız olduğu için bulunur. Mitokondri ve ER zarlıdır, mantarlar ise ökaryottur.

**Kötü 3: tanım sorusu, ÖSYM üslubu değil** (`tur-tyt-sifat-q009`)
> 'İkişer ceviz düştü her birimize.' cümlesindeki 'ikişer' hangi sıfattır?

**İyi:**
> Aşağıdaki cümlelerin hangisinde altı çizili sözcük üleştirme sayı sıfatıdır?
> A) Çocuklara \_\_ikişer\_\_ elma verdik. ✔
> B) \_\_İkinci\_\_ kattaki daire satılmış.
> C) \_\_Yarım\_\_ ekmekle akşama kadar idare etti.
> D) Masaya \_\_üç\_\_ tabak koydu.
> E) Gelenleri \_\_birer birer\_\_ karşıladı.
>
> Dipnot: -er/-ar eki alan sayı ismi nitelerse üleştirme sayı sıfatıdır. E'de "birer birer" bir ismi değil eylemi niteler ("nasıl karşıladı?"), bu yüzden zarftır.

E şıkkı iyi bir çeldiricidir: biçim olarak üleştirme sayısına benzer, ama görevi farklıdır. Soru kuralı ezberleyeni değil, gerçekten anlayanı ödüllendirir.

**Kötü 4: işaretsiz "altı çizili"** (`turkce-tyt` içinde 8 soru)
> Aşağıdaki cümlelerin hangisinde altı çizili sözcük özel isim olarak kullanılmıştır?
> Bu bahar birlikte kamp yapalım. / … / Bahar geldi, kuşlar şakıdı.

Ekranda hiçbir sözcük çizili olmadığı için hangi sözcüğün sorulduğu bilinemiyor. §6'daki işaretle düzeltilir.

// =====================================================
//  KİŞİSEL AYARLAR VE NOTLAR
//  Supabase aşamasına (1.6) kadar notlar buradan okunur.
// =====================================================

// Karşılamada görünecek isim. Boş bırakılırsa yalnızca "Günaydın" yazar.
var ISIM = "";

// Motivasyon notları. "sevgili: true" olanlar senin yazdıkların; öncelikli
// gösterilir ve altında küçük bir kalp çıkar. Kendi notlarını buraya
// { metin: "...", sevgili: true } olarak ekle.
var MOTIVASYON = [
  { metin: "Bugün küçük bir adım bile adımdır aşkım.", sevgili: true },
  { metin: "Yorulduysan mola ver sevgilim. Mola vermek vazgeçmek değildir.", sevgili: true },
  { metin: "Bir soruyu bilememek, onu öğrenmenin tam başlangıcıdır hayatım.", sevgili: true },
  { metin: "Dünkünden bir şey fazla biliyorsan bugün güzel geçmiş demektir aşkım.", sevgili: true },
  { metin: "Su içtin mi hayatım? Omuzlarını bir gevşet.", sevgili: true },
  { metin: "Acele yok sevgilim. Her gün biraz, sonunda çok.", sevgili: true },
  { metin: "Yanlışlar seni geri götürmez aşkım, doğruyu daha sağlam yerleştirir.", sevgili: true },
  { metin: "Bugün üç soru çözsen bile o üç soru senin hayatım.", sevgili: true },
  { metin: "Kendine nazik ol sevgilim. Bu yolda kendinle yarışıyorsun, kimseyle değil.", sevgili: true },
  { metin: "Dinlenmiş bir kafa daha iyi hatırlar aşkım. Biraz dinlen.", sevgili: true }
];

// Test sonu aşk notları, başarı oranına göre 3 basamak.
// Düşük: %0–40 · Orta: %40–75 · Yüksek: %75–100
var ASK_NOTLARI = {
  dusuk: [
    "Pes etmek yok sevgilim, devam et 💗",
    "Bugün zor geçmiş olabilir aşkım, yarın yine buradayız 💗",
    "Bilmediklerin bulunmayı bekleyen yeni bilgiler hayatım 💗"
  ],
  orta: [
    "Çok güzel gidiyorsun aşkım, her tur biraz daha 💗",
    "Yarısından fazlasını biliyorsun sevgilim, gerisi gelir 💗",
    "Emeğin görünüyor hayatım, devam 💗"
  ],
  yuksek: [
    "İşte böyle! Süpersin aşkım 💗",
    "Harikaydın sevgilim, bir mola hak ettin 💗",
    "Seninle gurur duyuyorum hayatım 💗"
  ]
};

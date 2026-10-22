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
  { metin: "Bugün küçük bir adım bile adımdır.", sevgili: false },
  { metin: "Yorulduysan mola ver. Mola vermek vazgeçmek değildir.", sevgili: false },
  { metin: "Bir soruyu bilememek, onu öğrenmenin tam başlangıcıdır.", sevgili: false },
  { metin: "Dünkünden bir şey fazla biliyorsan bugün güzel geçmiş demektir.", sevgili: false },
  { metin: "Su içtin mi? Omuzlarını bir gevşet.", sevgili: false },
  { metin: "Acele yok. Her gün biraz, sonunda çok.", sevgili: false },
  { metin: "Yanlışlar seni geri götürmez, doğruyu daha sağlam yerleştirir.", sevgili: false },
  { metin: "Bugün üç soru çözsen bile o üç soru senin.", sevgili: false },
  { metin: "Kendine nazik ol. Bu yolda kendinle yarışıyorsun, kimseyle değil.", sevgili: false },
  { metin: "Dinlenmiş bir kafa daha iyi hatırlar.", sevgili: false }
];

// Test sonu aşk notları, başarı oranına göre 3 basamak.
// Düşük: %0–40 · Orta: %40–75 · Yüksek: %75–100
var ASK_NOTLARI = {
  dusuk: [
    "Pes etmek yok sevgilim, devam et 💗",
    "Bugün zor geçmiş olabilir, yarın yine buradayız 💗",
    "Bilmediklerin bulunmayı bekleyen yeni bilgiler 💗"
  ],
  orta: [
    "Çok güzel gidiyorsun, her tur biraz daha 💗",
    "Yarısından fazlasını biliyorsun, gerisi gelir 💗",
    "Emeğin görünüyor, devam 💗"
  ],
  yuksek: [
    "İşte böyle! Süpersin 💗",
    "Harikaydın, bir mola hak ettin 💗",
    "Seninle gurur duyuyorum 💗"
  ]
};

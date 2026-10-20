// =====================================================
//  KİŞİSEL AYARLAR VE NOTLAR
//  Supabase aşamasına (1.6) kadar notlar buradan okunur.
// =====================================================

// Karşılamada görünecek isim. Boş bırakılırsa yalnızca "Günaydın" yazar.
var ISIM = "";

// Motivasyon notları. "sevgili: true" olanlar senin yazdıkların; öncelikli
// gösterilir ve altında küçük bir kalp çıkar.
// ⚠️ GEÇİCİ ÖRNEKLER: asıl notlar gelince bu liste değişecek.
var MOTIVASYON = [
  { metin: "(örnek not) Bugün küçük bir adım bile adımdır.", sevgili: false },
  { metin: "(örnek not) Dinlenmek de çalışmanın bir parçası. Su içmeyi unutma.", sevgili: false },
  { metin: "(örnek not) Yorulursan mola ver; mola vermek vazgeçmek değildir.", sevgili: false },
  { metin: "(örnek not) Seninle gurur duyuyorum.", sevgili: true }
];

// Test sonu aşk notları, başarı oranına göre 3 basamak.
// Düşük: %0–40 · Orta: %40–75 · Yüksek: %75–100
// ⚠️ GEÇİCİ ÖRNEKLER: asıl notlar gelince bu liste değişecek.
var ASK_NOTLARI = {
  dusuk: [
    "(örnek) Pes etmek yok sevgilim, devam et 💗"
  ],
  orta: [
    "(örnek) Çok güzel gidiyorsun, her tur biraz daha 💗"
  ],
  yuksek: [
    "(örnek) İşte böyle! Süpersin doktor hanım 💗"
  ]
};

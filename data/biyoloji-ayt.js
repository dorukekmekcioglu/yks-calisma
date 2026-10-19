// ⚠️ ÖRNEK İÇERİK: yalnızca arayüzü denemek için. Gerçek bilgi değildir.
// Kaynak PDF'ler gelince bu dosyanın yerine kaynaklara dayanan içerik yazılır.
icerikKaydet("biyoloji-ayt", {
  maddeler: [
    { id: "biy-ayt-sinir-001", konu: "biy-ayt-sinir", baslik: "Örnek başlık A",
      bilgi: "(örnek) Burada kısa bir bilgi cümlesi görünecek.", dipnot: "(örnek) Dipnot burada olacak." },
    { id: "biy-ayt-sinir-002", konu: "biy-ayt-sinir", baslik: "Örnek başlık A",
      bilgi: "(örnek) Aynı başlığın altına ikinci bir madde gelir.", dipnot: "(örnek) Dipnot." },
    { id: "biy-ayt-sinir-003", konu: "biy-ayt-sinir", baslik: "Örnek başlık B",
      bilgi: "(örnek) Başka bir başlığın altındaki madde.", dipnot: "(örnek) Dipnot." }
  ],
  sorular: [
    { id: "biy-ayt-sinir-q001", konu: "biy-ayt-sinir", maddeler: ["biy-ayt-sinir-001"],
      soru: "(örnek soru) Doğru şık hangisidir?",
      secenekler: ["(örnek) A şıkkı", "(örnek) B şıkkı", "(örnek) C şıkkı", "(örnek) D şıkkı", "(örnek) E şıkkı"],
      dogru: 2, dipnot: "(örnek) Açıklama burada olacak." }
  ]
});

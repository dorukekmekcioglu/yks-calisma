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
    { id: "biy-ayt-sinir-q001", konu: "biy-ayt-sinir", maddeler: ["biy-ayt-sinir-001"], sabit: false,
      soru: "(örnek soru 1) Doğru şık hangisidir?",
      secenekler: ["(örnek) A şıkkı", "(örnek) B şıkkı", "(örnek) C şıkkı", "(örnek) D şıkkı", "(örnek) E şıkkı"],
      dogru: 2, dipnot: "(örnek) Açıklama burada olacak; kısa ve öğretici bir cümle." },
    { id: "biy-ayt-sinir-q002", konu: "biy-ayt-sinir", maddeler: ["biy-ayt-sinir-002"], sabit: false,
      soru: "(örnek soru 2) Aşağıdakilerden hangisi doğrudur?",
      secenekler: ["(örnek) Birinci seçenek", "(örnek) İkinci seçenek", "(örnek) Üçüncü seçenek", "(örnek) Dördüncü seçenek", "(örnek) Beşinci seçenek"],
      dogru: 0, dipnot: "(örnek) İkinci sorunun dipnotu." },
    { id: "biy-ayt-sinir-q003", konu: "biy-ayt-sinir", maddeler: ["biy-ayt-sinir-003"], sabit: true,
      soru: "(örnek öncüllü soru) Yukarıdakilerden hangileri doğrudur?",
      oncul: ["I. (örnek) Birinci öncül", "II. (örnek) İkinci öncül", "III. (örnek) Üçüncü öncül"],
      secenekler: ["Yalnız I", "Yalnız II", "I ve II", "II ve III", "I, II ve III"],
      dogru: 3, dipnot: "(örnek) Öncüllü sorularda şıklar sırasıyla kalır." },
    { id: "biy-ayt-endokrin-q001", konu: "biy-ayt-endokrin", maddeler: [], sabit: false,
      soru: "(örnek soru 4) Başka bir konudan örnek soru.",
      secenekler: ["(örnek) A", "(örnek) B", "(örnek) C", "(örnek) D", "(örnek) E"],
      dogru: 4, dipnot: "(örnek) Dördüncü sorunun dipnotu." }
  ]
});

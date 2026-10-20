// Hafif liste: dersler ve konular. Her açılışta yüklenir.
// Konu içeriği (bilgi maddeleri, sorular) ders bazında ayrı dosyalarda durur
// ve o derse girilince yüklenir (PLAN.md §7).
// Konu adları PLAN.md §2'deki taslaktır; kaynaklar gelince kesinleşir.
// hazir: konunun içerik dosyası var mı.
var DERSLER = [
  { id: "fizik",    ad: "Fizik",      sinav: "tyt", ikon: "🔭" },
  { id: "kimya",    ad: "Kimya",      sinav: "tyt", ikon: "🧪" },
  { id: "biyoloji", ad: "Biyoloji",   sinav: "tyt", ikon: "🌱" },
  { id: "sosyal",   ad: "Coğrafya", sinav: "tyt", ikon: "🗺️" },
  { id: "turkce",   ad: "TYT Türkçe", sinav: "tyt", ikon: "📖" },
  { id: "fizik",    ad: "Fizik",      sinav: "ayt", ikon: "🔭" },
  { id: "kimya",    ad: "Kimya",      sinav: "ayt", ikon: "🧪" },
  { id: "biyoloji", ad: "Biyoloji",   sinav: "ayt", ikon: "🌱" }
];

function _k(sinav, ders, kod, ad, hazir) {
  return { id: ders.slice(0, 3) + "-" + sinav + "-" + kod, sinav: sinav, ders: ders,
           ad: ad, dosya: ders + "-" + sinav, oncelik: true, hazir: !!hazir };
}

var KONULAR = [
  _k("tyt", "fizik", "giris", "Fizik Bilimine Giriş"),
  _k("tyt", "fizik", "madde", "Madde ve Özellikleri"),
  _k("tyt", "fizik", "hareket", "Hareket ve Kuvvet"),
  _k("tyt", "fizik", "enerji", "İş, Güç, Enerji"),
  _k("tyt", "fizik", "isi", "Isı, Sıcaklık, Genleşme"),
  _k("tyt", "fizik", "elektrostatik", "Elektrostatik"),
  _k("tyt", "fizik", "akim", "Elektrik Akımı ve Devreler"),
  _k("tyt", "fizik", "manyetizma", "Manyetizma"),
  _k("tyt", "fizik", "basinc", "Basınç ve Kaldırma Kuvveti"),
  _k("tyt", "fizik", "dalga", "Dalgalar"),
  _k("tyt", "fizik", "optik", "Optik"),

  _k("tyt", "kimya", "bilim", "Kimya Bilimi"),
  _k("tyt", "kimya", "atom", "Atom Modelleri ve Periyodik Sistem"),
  _k("tyt", "kimya", "etkilesim", "Kimyasal Türler Arası Etkileşimler"),
  _k("tyt", "kimya", "hal", "Maddenin Halleri"),
  _k("tyt", "kimya", "karisim", "Karışımlar ve Ayırma Yöntemleri"),
  _k("tyt", "kimya", "asit", "Asitler, Bazlar, Tuzlar"),
  _k("tyt", "kimya", "her-yerde", "Kimya Her Yerde"),
  _k("tyt", "kimya", "doga", "Doğa ve Kimya"),

  _k("tyt", "sosyal", "harita", "Harita Bilgisi"),
  _k("tyt", "sosyal", "dunya", "Dünya'nın Şekli ve Hareketleri"),
  _k("tyt", "sosyal", "konum", "Coğrafi Konum"),
  _k("tyt", "sosyal", "iklim", "Atmosfer ve İklim"),
  _k("tyt", "sosyal", "kuvvetler", "İç ve Dış Kuvvetler"),
  _k("tyt", "sosyal", "yer-sekilleri", "Türkiye'nin Yer Şekilleri"),
  _k("tyt", "sosyal", "nufus", "Nüfus, Göç, Yerleşme"),
  _k("tyt", "sosyal", "ekonomi", "Ekonomik Faaliyetler"),
  _k("tyt", "sosyal", "afet", "Doğal Afetler"),

  _k("ayt", "biyoloji", "sinir", "Sinir Sistemi", true),
  _k("ayt", "biyoloji", "endokrin", "Endokrin Sistem", true)
];

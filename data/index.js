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

  // TYT Biyoloji (kaynak: OGM Materyal TYT-AYT ve kullanıcının el yazısı notları)
  _k("tyt", "biyoloji", "giris", "Biyolojiye Giriş ve Canlıların Ortak Özellikleri", true),
  _k("tyt", "biyoloji", "bilesen", "Canlıların Temel Bileşenleri", true),
  _k("tyt", "biyoloji", "hucre", "Hücre", true),
  _k("tyt", "biyoloji", "bolunme", "Hücre Bölünmeleri ve Üreme", true),
  _k("tyt", "biyoloji", "canlilar", "Canlılar Dünyası ve Sınıflandırma", true),
  _k("tyt", "biyoloji", "ekoloji", "Ekosistem Ekolojisi", true),
  _k("tyt", "biyoloji", "kalitim", "Kalıtım", true),
  _k("tyt", "biyoloji", "hayvan", "Hayvanlar Âlemi", true),
  _k("tyt", "biyoloji", "virus", "Virüsler", true),

  // Sıra: "12 Günde TYT Coğrafya" kampının gün sırasına göre (kullanıcının önerdiği oynatma listesi)
  _k("tyt", "sosyal", "doga-insan", "Doğa ve İnsan Etkileşimi", true),
  _k("tyt", "sosyal", "dunya", "Dünya'nın Şekli ve Hareketleri"),
  _k("tyt", "sosyal", "bolgeler", "Bölgeler", true),
  _k("tyt", "sosyal", "iklim", "Atmosfer, Hava Durumu ve İklim", true),
  _k("tyt", "sosyal", "nufus", "Nüfus", true),
  _k("tyt", "sosyal", "afet", "Doğal Afetler"),
  _k("tyt", "sosyal", "yapi", "Dünya'nın Yapısı ve Levha Tektoniği", true),
  _k("tyt", "sosyal", "jeoloji", "Jeolojik Zamanlar ve Türkiye'nin Jeolojik Geçmişi", true),
  _k("tyt", "sosyal", "kuvvetler", "İç Kuvvetler", true),
  _k("tyt", "sosyal", "dis-kuvvetler", "Dış Kuvvetler"),
  _k("tyt", "sosyal", "yer-sekilleri", "Türkiye'nin Yer Şekilleri"),
  _k("tyt", "sosyal", "su-toprak-bitki", "Su, Toprak ve Bitki Örtüsü"),
  _k("tyt", "sosyal", "yerlesme-ekonomi", "Yerleşme, Ekonomi ve Göç"),
  _k("tyt", "sosyal", "ulasim", "Ulaşım"),
  _k("tyt", "sosyal", "koordinat", "Coğrafi Konum: Koordinat Sistemi ve Yerel Saat", true),
  _k("tyt", "sosyal", "harita", "Harita Bilgisi", true),

  // TYT Türkçe: yazım kuralları (kaynak: kullanıcının Suat Toker notları)
  _k("tyt", "turkce", "ses", "Ses Bilgisi", true),
  _k("tyt", "turkce", "buyuk-harf", "Büyük Harflerin Kullanımı", true),
  _k("tyt", "turkce", "sayi-ikileme", "Sayıların ve İkilemelerin Yazımı", true),
  _k("tyt", "turkce", "ayri-birlesik", "Ayrı Yazılan Birleşik Kelimeler", true),
  _k("tyt", "turkce", "bitisik-birlesik", "Bitişik Yazılan Birleşik Kelimeler", true),
  _k("tyt", "turkce", "mi-ki-kisaltma", "mi, ki, de ve Kısaltmaların Yazımı", true),
  _k("tyt", "turkce", "noktalama-1", "Noktalama 1: Nokta, Virgül, Noktalı Virgül", true),
  _k("tyt", "turkce", "noktalama-2", "Noktalama 2: İki Nokta, Üç Nokta, Soru ve Ünlem", true),
  _k("tyt", "turkce", "noktalama-3", "Noktalama 3: Çizgiler, Tırnak, Ayraç, Kesme", true),
  _k("tyt", "turkce", "bicim", "Kök, Ekler ve Sözcüğün Yapısı", true),
  _k("tyt", "turkce", "isim", "İsim (Ad)", true),
  _k("tyt", "turkce", "sifat", "Sıfat (Ön Ad)", true),
  _k("tyt", "turkce", "zamir", "Zamir (Adıl)", true),
  _k("tyt", "turkce", "tamlama", "İsim ve Sıfat Tamlamaları", true),
  _k("tyt", "turkce", "zarf", "Zarf (Belirteç)", true),
  _k("tyt", "turkce", "edat-baglac-unlem", "Edat, Bağlaç, Ünlem", true),
  _k("tyt", "turkce", "fiil-kip", "Fiil ve Fiilde Kip", true),
  _k("tyt", "turkce", "ek-fiil", "Ek-Fiil (Ek Eylem)", true),
  _k("tyt", "turkce", "fiil-yapi", "Fiilde Yapı", true),
  _k("tyt", "turkce", "fiilimsi", "Fiilimsiler (Eylemsiler)", true),
  _k("tyt", "turkce", "cati", "Fiilde Çatı", true),
  _k("tyt", "turkce", "cumle-ogeleri", "Cümlenin Ögeleri", true),
  _k("tyt", "turkce", "cumle-turleri", "Cümle Türleri", true),
  _k("tyt", "turkce", "anlatim-1", "Anlatım Bozuklukları 1: Anlama Dayalı", true),
  _k("tyt", "turkce", "anlatim-2", "Anlatım Bozuklukları 2: Yapıya Dayalı", true),

  _k("ayt", "biyoloji", "sinir", "Sinir Sistemi", true),
  _k("ayt", "biyoloji", "endokrin", "Endokrin Sistem", true)
];

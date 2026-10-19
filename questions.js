// =====================================================
//  SORU BANKASI
//  Yeni soru eklemek için aşağıdaki biçimi kopyalayıp
//  ilgili konunun altına yapıştırman yeterli:
//
//  Q("konu-id", "Soru metni?",
//    ["A şıkkı", "B şıkkı", "C şıkkı", "D şıkkı", "E şıkkı"],
//    1,                       // doğru cevabın sırası (0 = ilk şık, 1 = ikinci şık ...)
//    "Dipnot: bilgiyi pekiştiren kısa açıklama",
//    false);                  // "Yalnız I", "I ve II" gibi sabit sıralı şıklar için true
// =====================================================

const DERSLER = [
  { id: "cografya", ad: "Coğrafya" },
  { id: "biyoloji", ad: "Biyoloji" },
];

const KONULAR = [
  { id: "cog-akarsu", ders: "cografya", ad: "Akarsular ve Ovalar" },
  { id: "cog-iklim", ders: "cografya", ad: "İklim ve Dünya'nın Hareketleri" },
  { id: "cog-nufus", ders: "cografya", ad: "Nüfus ve Yerleşme" },
  { id: "cog-yersekli", ders: "cografya", ad: "Türkiye'nin Yer Şekilleri" },
  { id: "bio-hormon", ders: "biyoloji", ad: "Hormonlar" },
  { id: "bio-hucre", ders: "biyoloji", ad: "Hücre" },
  { id: "bio-sindirim", ders: "biyoloji", ad: "Sindirim Sistemi" },
  { id: "bio-kalitim", ders: "biyoloji", ad: "Kalıtım ve Nükleik Asitler" },
];

const SORULAR = [];
const _say = {};
function Q(konu, soru, secenekler, dogru, not, sabit) {
  _say[konu] = (_say[konu] || 0) + 1;
  SORULAR.push({
    id: konu + "-" + _say[konu],
    konu,
    soru,
    secenekler,
    dogru,
    not,
    sabit: !!sabit,
  });
}

// ---------------------------------------------------
//  COĞRAFYA · Akarsular ve Ovalar
// ---------------------------------------------------
Q("cog-akarsu",
  "Aşağıdakilerden hangisi Türkiye'deki delta ovalarından biri değildir?",
  ["Bafra Ovası", "Çarşamba Ovası", "Çukurova", "Silifke Ovası", "Konya Ovası"],
  4,
  "Delta ovaları, akarsuyun denize (ya da göle) döküldüğü yerde taşıdığı alüvyonu biriktirmesiyle oluşur. Bafra (Kızılırmak), Çarşamba (Yeşilırmak), Çukurova (Seyhan-Ceyhan), Silifke (Göksu), Gediz ve Büyük Menderes başlıca delta ovalarıdır. Konya Ovası ise eski bir göl tabanıdır (kapalı havza).");

Q("cog-akarsu",
  "Bir akarsu ağzında delta ovası oluşabilmesi için aşağıdakilerden hangisinin gerçekleşmesi beklenmez?",
  [
    "Akarsuyun taşıdığı alüvyon miktarının fazla olması",
    "Denizin kıyıda sığ olması",
    "Dalga ve akıntıların etkisinin az olması",
    "Kıyının dik ve denizin derin olması",
    "Akarsuyun ağız kesiminde eğimin azalması",
  ],
  3,
  "Delta için üç şey lazım: bol alüvyon, sığ deniz, zayıf dalga/akıntı. Kıyı dik ve deniz derinse malzeme birikemez, açığa taşınır.");

Q("cog-akarsu",
  "Türkiye'de doğup yine Türkiye sınırları içinde denize dökülen en uzun akarsu aşağıdakilerden hangisidir?",
  ["Fırat", "Dicle", "Kızılırmak", "Sakarya", "Seyhan"],
  2,
  "Kızılırmak (yaklaşık 1355 km) Türkiye'nin sınırları içinde kalan en uzun akarsudur ve Karadeniz'e dökülür. Fırat ile Dicle ülke sınırını aşan akarsulardır; Sakarya ise 824 km uzunluğundadır.");

Q("cog-akarsu",
  "Karadeniz'e dökülen akarsuların rejimlerinin düzenli olmasında aşağıdakilerden hangisi etkilidir?",
  [
    "Yaz mevsiminin kurak geçmesi",
    "Yağışın bütün mevsimlere dağılması",
    "Kar erimelerinin ilkbaharda yoğun olması",
    "Dağların kıyıya dik uzanması",
    "Yer altı su kaynaklarının az olması",
  ],
  1,
  "Rejim, akarsuyun su miktarının yıl içindeki değişimidir. Karadeniz'de her mevsim yağış düştüğü için akarsuların debisi yıl boyunca birbirine yakındır. Akdeniz ve Doğu Anadolu akarsularında ise yağış/kar erimesi belli mevsimlerde toplandığı için rejim düzensizdir.");

Q("cog-akarsu",
  "Aşağıdakilerden hangileri akarsuların biriktirme (yığılma) şekillerindendir?\n\nI. Delta\nII. Birikinti konisi\nIII. Kanyon\nIV. Taşkın ovası",
  ["Yalnız I", "I ve II", "I, II ve IV", "II ve III", "I, III ve IV"],
  2,
  "Delta, birikinti konisi ve taşkın ovası biriktirme şekilleridir. Kanyon ve V şekilli vadi gibi şekiller ise akarsuyun aşındırması sonucu oluşur.",
  true);

// ---------------------------------------------------
//  COĞRAFYA · İklim ve Dünya'nın Hareketleri
// ---------------------------------------------------
Q("cog-iklim",
  "Akdeniz iklim bölgesinde yaygın olan doğal bitki örtüsü aşağıdakilerden hangisidir?",
  ["Bozkır", "Maki", "Kayın ormanı", "Tundra", "Savan"],
  1,
  "Akdeniz ikliminin yazı sıcak ve kurak olduğu için bitkiler kurağa dayanıklıdır: maki (kısa boylu, herdem yeşil çalılar) yaygındır. Bozkır İç Anadolu'nun, kayın ormanı Karadeniz'in bitki örtüsüdür.");

Q("cog-iklim",
  "Türkiye'de yıllık sıcaklık farkının en fazla olduğu bölge aşağıdakilerden hangisidir?",
  ["Marmara kıyıları", "Karadeniz kıyıları", "Akdeniz kıyıları", "Doğu Anadolu", "Ege kıyıları"],
  3,
  "Denizden uzak ve yüksek olan yerlerde karasal iklim görülür; yazlar sıcak, kışlar çok soğuk olduğu için yıllık sıcaklık farkı artar. Kıyılarda deniz ılımanlaştırıcı etki yaptığı için fark azdır.");

Q("cog-iklim",
  "Dünya'nın eksen eğikliğinin sonuçlarından biri aşağıdakilerden hangisidir?",
  ["Gece ile gündüzün oluşması", "Mevsimlerin oluşması", "Yerel saat farklarının oluşması", "Rüzgârların yön değiştirmesi", "Gelgit olayının görülmesi"],
  1,
  "Mevsimler, eksen eğikliği ve Güneş etrafında dolanma birlikte olduğu için oluşur. Gece-gündüz, yerel saat farkları ve rüzgârların sapması Dünya'nın kendi ekseni etrafında dönmesinin sonucudur. Gelgit ise Ay ve Güneş'in çekim etkisiyle olur.");

Q("cog-iklim",
  "Karadeniz Bölgesi'nin Türkiye'nin en fazla yağış alan bölgesi olmasında aşağıdakilerden hangisinin etkisi en fazladır?",
  [
    "Denizden uzak olması",
    "Dağların kıyıya paralel uzanması",
    "Enleminin düşük olması",
    "Yükseltinin az olması",
    "Akarsularının çok olması",
  ],
  1,
  "Nemli hava kütleleri kıyıya paralel dağlara çarpıp yükselir, soğur ve yağış bırakır. Buna yamaç (orografik) yağışı denir. Dağlar rüzgâr altı yamaçlarda ise yağış azalır, bu yüzden Karadeniz dağlarının güneyi çok daha kuraktır.");

Q("cog-iklim",
  "21 Haziran'da Güneş ışınları öğle vakti hangi enleme dik gelir?",
  ["Ekvator", "Oğlak Dönencesi", "Yengeç Dönencesi", "Kuzey Kutup Dairesi", "Güney Kutup Dairesi"],
  2,
  "21 Haziran, Kuzey Yarım Küre'de yaz gündönümüdür: ışınlar 23°27' Kuzey enlemindeki Yengeç Dönencesi'ne dik gelir ve Kuzey Yarım Küre'de en uzun gündüz yaşanır. 22 Aralık'ta ışınlar Oğlak Dönencesi'ne dik gelir.");

// ---------------------------------------------------
//  COĞRAFYA · Nüfus ve Yerleşme
// ---------------------------------------------------
Q("cog-nufus",
  "Genel nüfus yoğunluğu aşağıdakilerden hangisiyle hesaplanır?",
  [
    "Toplam nüfusun yüzölçümüne bölünmesi",
    "Kentsel nüfusun toplam nüfusa bölünmesi",
    "Doğum sayısının ölüm sayısına bölünmesi",
    "Yüzölçümünün toplam nüfusa bölünmesi",
    "Göç eden sayısının toplam nüfusa bölünmesi",
  ],
  0,
  "Nüfus yoğunluğu = toplam nüfus / yüzölçümü (km²). Yani 1 km² alana düşen kişi sayısıdır. Tarım alanına göre hesaplanırsa buna tarımsal (fizyolojik) yoğunluk denir.");

Q("cog-nufus",
  "Türkiye'de iç göçlerin genel yönü aşağıdakilerden hangisidir?",
  ["Batıdan doğuya", "Kentlerden kırsala", "Doğudan batıya", "Kıyılardan iç kesimlere", "Güneyden kuzeye"],
  2,
  "Türkiye'de iç göçler ağırlıklı olarak doğudan batıya ve kırsal alanlardan kentlere doğrudur. Sanayi ve hizmet sektörünün batıda gelişmiş olması, iş imkânlarını artırdığı için göçü çeker.");

Q("cog-nufus",
  "Doğum oranı ile ölüm oranı arasındaki farktan aşağıdakilerden hangisi elde edilir?",
  ["Net göç hızı", "Doğal nüfus artış hızı", "Nüfus yoğunluğu", "Bağımlı nüfus oranı", "Şehirleşme oranı"],
  1,
  "Doğal nüfus artış hızı = doğum oranı - ölüm oranı. Göç hesaba katılırsa elde edilen artışa ise gerçek (toplam) nüfus artışı denir.");

Q("cog-nufus",
  "Nüfus piramidinin tabanının geniş, tepesinin dar olması aşağıdakilerden hangisini gösterir?",
  [
    "Yaşlı nüfus oranının yüksek olduğunu",
    "Genç nüfus oranının yüksek olduğunu",
    "Göç alan bir ülke olduğunu",
    "Kadın-erkek nüfusunun eşit olduğunu",
    "Nüfus artışının durduğunu",
  ],
  1,
  "Geniş taban, doğum oranının yüksek olduğunu ve genç nüfusun fazla olduğunu gösterir. Tabanı dar, gövdesi geniş olan piramit ise yaşlanan bir nüfusa işaret eder.");

Q("cog-nufus",
  "Karadeniz Bölgesi'nde kırsal yerleşmelerin dağınık olmasında aşağıdakilerden hangisinin etkisi vardır?",
  [
    "Suyun her yerde bulunması ve arazinin engebeli olması",
    "Düz arazilerin geniş yer kaplaması",
    "İklimin kurak geçmesi",
    "Ulaşım ağının çok gelişmiş olması",
    "Yağışın yetersiz olması",
  ],
  0,
  "Yağış bol olduğundan su her yerde bulunur, insanların su kaynağı çevresinde toplanma zorunluluğu kalmaz. Engebeli arazi de evleri yamaçlara dağıtır. Su kıt olan İç Anadolu ve Doğu Anadolu'da ise yerleşmeler su kaynakları çevresinde toplu kurulur.");

// ---------------------------------------------------
//  COĞRAFYA · Türkiye'nin Yer Şekilleri
// ---------------------------------------------------
Q("cog-yersekli",
  "Aşağıdaki dağlardan hangisi Türkiye'nin en yüksek dağıdır?",
  ["Erciyes", "Uludağ", "Ağrı", "Kaçkar", "Süphan"],
  2,
  "Ağrı Dağı yaklaşık 5137 m ile Türkiye'nin en yüksek dağıdır. Volkanik bir dağdır ve Doğu Anadolu'dadır. Erciyes (İç Anadolu) ve Süphan da volkanik dağlardır; Kaçkarlar ise Doğu Karadeniz'deki en yüksek sıradağdır.");

Q("cog-yersekli",
  "Aşağıdakilerden hangisi Türkiye'nin en büyük gölüdür?",
  ["Tuz Gölü", "Beyşehir Gölü", "Van Gölü", "Eğirdir Gölü", "İznik Gölü"],
  2,
  "Van Gölü, Türkiye'nin en büyük gölüdür ama suyu sodalıdır. En büyük tatlı su gölü Beyşehir Gölü'dür. Tuz Gölü ise Türkiye'nin ikinci büyük gölüdür ve yazın kuruyup tuz bırakır.");

Q("cog-yersekli",
  "Dolin, uvala ve polye gibi karstik şekiller aşağıdaki kayaç türlerinden hangisinde gelişir?",
  ["Granit", "Bazalt", "Kalker", "Kuvarsit", "Gnays"],
  2,
  "Karstik şekiller suda çözünebilen kayaçlarda, özellikle kalkerde (kireç taşında) oluşur. Küçük çukurlar dolin, onların birleşmesiyle uvala, çok geniş karstik ovalar ise polye adını alır. Teke Yöresi ve Taşeli Platosu karstik şekillerin yaygın olduğu yerlerdendir.");

Q("cog-yersekli",
  "Ege Bölgesi'ndeki Gediz ve Büyük Menderes ovalarının oluşumunda aşağıdakilerden hangisi etkili olmuştur?",
  [
    "Buzulların aşındırması",
    "Karstik erimeler",
    "Volkanik püskürmeler",
    "Faylanmayla çöken alanların akarsu alüvyonlarıyla dolması",
    "Rüzgâr birikimi",
  ],
  3,
  "Bu ovalar graben (çöküntü) ovalarıdır: fay hatları boyunca çöken alanlar akarsuların taşıdığı alüvyonlarla dolmuştur. Kıyıya dik uzanan bu çöküntüler Ege kıyılarının girintili çıkıntılı olmasına da yol açmıştır.");

Q("cog-yersekli",
  "Kapadokya'daki peribacalarının oluşumunda en etkili süreç aşağıdakilerden hangisidir?",
  [
    "Dalgaların kıyıyı aşındırması",
    "Buzulların vadi açması",
    "Volkanik tüflerin akarsu ve rüzgârla aşındırılması",
    "Karstik çözünme",
    "Heyelan",
  ],
  2,
  "Erciyes, Hasan Dağı gibi volkanların püskürttüğü yumuşak tüfler, üzerlerinde sert bir lav tabakası kalacak biçimde akarsu ve rüzgârla aşındırılmıştır. Bu şekilde peribacaları ortaya çıkmıştır.");

// ---------------------------------------------------
//  BİYOLOJİ · Hormonlar
// ---------------------------------------------------
Q("bio-hormon",
  "STH (büyüme hormonu) hormonunun görevi aşağıdakilerden hangisidir?",
  [
    "Kandaki şeker düzeyini azaltmak",
    "Kemik ve kas gelişimini uyararak büyümeyi sağlamak",
    "Metabolizma hızını düzenlemek",
    "Süt salgılanmasını uyarmak",
    "Kandaki kalsiyum düzeyini azaltmak",
  ],
  1,
  "STH, hipofizin ön lobundan salgılanır ve büyümeyi uyarır. Çocukluk döneminde fazlalığı devliğe, azlığı cücelik; yetişkinlikte fazlalığı akromegaliye (el, ayak, çene uçlarının büyümesi) yol açar. Metabolizma hızını tiroksin, süt salgısını prolaktin, kan kalsiyumunu azaltmayı kalsitonin yapar.");

Q("bio-hormon",
  "İnsülin hormonu aşağıdaki organlardan hangisi tarafından salgılanır?",
  ["Karaciğer", "Böbrek üstü bezi", "Pankreas", "Tiroit bezi", "Hipofiz"],
  2,
  "İnsülin, pankreastaki Langerhans adacıklarının beta hücrelerinden salgılanır ve kan şekerini düşürür. Alfa hücrelerinden salgılanan glukagon ise kan şekerini yükseltir. İnsülin eksikliği diyabet (şeker hastalığı) yapar.");

Q("bio-hormon",
  "İyot eksikliğinde tiroit bezinin büyümesi sonucu ortaya çıkan rahatsızlık aşağıdakilerden hangisidir?",
  ["Şeker hastalığı", "Guatr", "Akromegali", "Devlik", "Raşitizm"],
  1,
  "Tiroit bezi, tiroksin yapımında iyot kullanır. İyot yetersizse tiroksin eksik kalır ve bez büyür; buna guatr denir. Bu yüzden iyotlu tuz kullanımı önerilir.");

Q("bio-hormon",
  "Aşağıdaki hormon-salgılandığı yer eşleştirmelerinden hangisi yanlıştır?",
  [
    "Adrenalin - Böbrek üstü bezi",
    "Kalsitonin - Tiroit bezi",
    "Prolaktin - Hipofiz",
    "Parathormon - Paratiroit bezi",
    "İnsülin - Karaciğer",
  ],
  4,
  "İnsülin karaciğerde değil pankreasta üretilir. Karaciğer ise insülinin etkisiyle kan şekerini glikojen olarak depolar. Parathormon kan kalsiyumunu artırır, kalsitonin ise azaltır; ikisi birbirine zıt çalışır.");

Q("bio-hormon",
  "Diğer endokrin bezlerin salgısını uyaran hormonlar ürettiği için \"şef (kumanda) bez\" olarak adlandırılan bez aşağıdakilerden hangisidir?",
  ["Tiroit", "Hipofiz", "Timüs", "Pankreas", "Epifiz"],
  1,
  "Hipofiz, TSH, ACTH, FSH, LH gibi diğer bezleri uyaran hormonlar salgılar. Kendisi de beyindeki hipotalamus tarafından denetlenir. ADH ve oksitosin hipotalamusta üretilir, hipofizin arka lobundan salgılanır.");

// ---------------------------------------------------
//  BİYOLOJİ · Hücre
// ---------------------------------------------------
Q("bio-hucre",
  "Hücrede ATP üretimiyle \"enerji santrali\" olarak bilinen organel aşağıdakilerden hangisidir?",
  ["Ribozom", "Golgi aygıtı", "Mitokondri", "Lizozom", "Koful"],
  2,
  "Mitokondri, hücresel solunumla besinlerdeki enerjiyi ATP'ye çevirir. Enerji ihtiyacı yüksek hücrelerde (kas hücresi gibi) mitokondri sayısı fazladır.");

Q("bio-hucre",
  "Aşağıdaki organellerden hangisi zarsızdır?",
  ["Mitokondri", "Golgi aygıtı", "Lizozom", "Ribozom", "Endoplazmik retikulum"],
  3,
  "Ribozom zarsızdır; protein sentezinin yapıldığı yerdir ve hem prokaryot hem ötekaryot hücrelerde bulunur. Sentrozom da zarsız organellerden biridir.");

Q("bio-hucre",
  "Aşağıdakilerden hangisi yalnızca bitki hücrelerinde bulunur?",
  ["Mitokondri", "Ribozom", "Kloroplast", "Golgi aygıtı", "Çekirdek"],
  2,
  "Kloroplast, fotosentezin yapıldığı organeldir ve sadece bitkilerde (ve alglerde) bulunur. Bitki hücresinde ayrıca hücre duvarı ve büyük merkezi koful bulunur. Mitokondri hem bitki hem hayvan hücresinde vardır.");

Q("bio-hucre",
  "Maddelerin enerji (ATP) harcanmadan, yoğun ortamdan seyrek ortama geçişine ne denir?",
  ["Aktif taşıma", "Difüzyon", "Endositoz", "Ekzositoz", "Pinositoz"],
  1,
  "Difüzyon, pasif taşımanın bir türüdür: enerji gerekmez, madde yoğun yerden seyrek yere doğru gider. Aktif taşıma ise maddeyi seyrek ortamdan yoğun ortama taşır ve ATP gerektirir. Suyun yarı geçirgen zardan geçişine ozmoz denir.");

Q("bio-hucre",
  "Aşağıdaki organellerden hangileri çift zarlıdır?\n\nI. Mitokondri\nII. Kloroplast\nIII. Golgi aygıtı",
  ["Yalnız I", "Yalnız II", "I ve II", "II ve III", "I, II ve III"],
  2,
  "Mitokondri ve kloroplast çift zarlıdır (çekirdek de çift zarlıdır). Golgi aygıtı, lizozom, koful ve endoplazmik retikulum tek zarlıdır. Mitokondri ve kloroplast kendi DNA'larını taşıdıkları için yarı bağımsız organellerdir.",
  true);

// ---------------------------------------------------
//  BİYOLOJİ · Sindirim Sistemi
// ---------------------------------------------------
Q("bio-sindirim",
  "Karbonhidratların kimyasal sindirimi ağızda hangi enzimle başlar?",
  ["Pepsin", "Tükürük amilazı", "Lipaz", "Tripsin", "Maltaz"],
  1,
  "Tükürük amilazı (ptyalin) nişastayı daha küçük şekerlere parçalar. Pepsin mide proteini, lipaz yağı, tripsin ise ince bağırsakta proteinleri sindirir. Bu yüzden ekmeği uzun çiğnerken hafif tatlı bir tat hissedilir.");

Q("bio-sindirim",
  "Proteinlerin kimyasal sindirimi hangi organda başlar?",
  ["Ağız", "Yemek borusu", "Mide", "İnce bağırsak", "Kalın bağırsak"],
  2,
  "Mide özsuyundaki pepsin enzimi, asidik ortamda (HCl varlığında) proteinleri parçalamaya başlar. Sindirim ince bağırsakta tamamlanır. Yemek borusunda kimyasal sindirim olmaz.");

Q("bio-sindirim",
  "Besinlerin kana geçişi (emilim) en fazla hangi organda gerçekleşir?",
  ["Mide", "İnce bağırsak", "Kalın bağırsak", "Karaciğer", "Yemek borusu"],
  1,
  "İnce bağırsak, içindeki villus (bağırsak tüycükleri) sayesinde yüzeyi çok genişlemiş olduğundan emilimin en çok yapıldığı yerdir. Kalın bağırsakta ise ağırlıklı olarak su ve mineral emilir.");

Q("bio-sindirim",
  "Safra sıvısı ile ilgili aşağıdakilerden hangisi doğrudur?",
  [
    "Safra kesesinde üretilir.",
    "Sindirim enzimi içerir.",
    "Yağların küçük damlacıklara ayrılmasını (emülsiyon) sağlar.",
    "Proteinleri amino asitlere kadar parçalar.",
    "Mideye salgılanır.",
  ],
  2,
  "Safra karaciğerde üretilir, safra kesesinde depolanır ve onikiparmak bağırsağına dökülür. Enzim içermez; yağı küçük damlacıklara ayırarak lipazın etkisini kolaylaştırır.");

Q("bio-sindirim",
  "Pankreas özsuyu aşağıdaki yapılardan hangisine dökülür?",
  ["Mide", "Onikiparmak bağırsağı", "Kalın bağırsak", "Safra kesesi", "Yemek borusu"],
  1,
  "Pankreas özsuyu onikiparmak bağırsağına dökülür. Amilaz, lipaz ve tripsin gibi enzimlerle birlikte bikarbonat içerir; bikarbonat mideden gelen asidik besin lapasını nötrleştirir.");

// ---------------------------------------------------
//  BİYOLOJİ · Kalıtım ve Nükleik Asitler
// ---------------------------------------------------
Q("bio-kalitim",
  "İnsanda bir vücut (somatik) hücresinde kaç kromozom bulunur?",
  ["23", "44", "46", "48", "92"],
  2,
  "İnsan vücut hücrelerinde 46 kromozom (44 otozom + 2 gonozom) vardır. Üreme hücreleri (gametler) mayoz bölünmeyle oluştuğu için 23 kromozom taşır.");

Q("bio-kalitim",
  "Bir karakter için iki farklı allel taşıyan (Aa) bireye ne denir?",
  ["Homozigot baskın", "Homozigot çekinik", "Heterozigot (melez)", "Saf döl", "Mutant"],
  2,
  "Aynı karakter için iki farklı allel taşıyan bireye heterozigot (melez) denir. AA ve aa ise homozigot (saf döl) bireylerdir. Genotip Aa ise baskın allel fenotipte kendini gösterir.");

Q("bio-kalitim",
  "Aa x Aa çaprazlamasından doğan bir yavrunun aa genotipinde olma olasılığı kaçtır?",
  ["0", "1/4", "1/2", "3/4", "1"],
  1,
  "Genotip oranı AA : Aa : aa = 1 : 2 : 1 olduğu için aa olma olasılığı 1/4'tür. Fenotip oranı ise 3 baskın : 1 çekiniktir.");

Q("bio-kalitim",
  "Renk körlüğü X kromozomuna bağlı çekinik bir özelliktir. Renk körü bir anne ile sağlıklı bir babanın erkek çocukları için aşağıdakilerden hangisi doğrudur?",
  [
    "Hepsi sağlıklıdır.",
    "Hepsinin renk körü olması beklenir.",
    "Yarısı renk körü olur.",
    "Renk körü olma olasılığı 1/4'tür.",
    "Yalnızca kız çocukları renk körü olur.",
  ],
  1,
  "Erkek çocuk X kromozomunu anneden, Y kromozomunu babadan alır. Anne renk körü (XᵈXᵈ) olduğu için tüm erkek çocuklar renk körü olur. Kız çocuklar ise babadan sağlıklı X aldığı için taşıyıcı olur.");

Q("bio-kalitim",
  "Aşağıdaki bazlardan hangisi RNA'da bulunmaz?",
  ["Adenin", "Guanin", "Sitozin", "Timin", "Urasil"],
  3,
  "RNA'da timin yerine urasil bulunur. DNA'da adenin-timin ve guanin-sitozin eşleşir. Ayrıca RNA tek zincirlidir ve şekeri riboz, DNA'nınki ise deoksiribozdur.");

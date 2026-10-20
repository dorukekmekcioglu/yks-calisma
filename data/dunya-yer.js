// Mola: dünya haritasında boğaz, deniz, körfez, ada, yarımada, çöl, dağ. Konumlar yaklaşıktır.
// [ad, tür, konum, r]  tür: bogaz (boğaz ve kanal), deniz, korfez, ada, yarimada, col, dag. Konum: nokta [lon,lat] ya da çizgi.
window.DUNYA_YERLER = [
  // Boğaz ve kanallar
  ["İstanbul Boğazı", "bogaz", [29.05, 41.1], 1.5], ["Çanakkale Boğazı", "bogaz", [26.4, 40.2], 1.5], ["Cebelitarık Boğazı", "bogaz", [-5.6, 36.0], 2],
  ["Bering Boğazı", "bogaz", [-169.0, 65.8], 2.5], ["Hürmüz Boğazı", "bogaz", [56.5, 26.5], 2], ["Babülmendep Boğazı", "bogaz", [43.3, 12.6], 2],
  ["Malakka Boğazı", "bogaz", [101.0, 3.0], 3], ["Magellan Boğazı", "bogaz", [-70.5, -53.5], 3], ["Drake Geçidi", "bogaz", [-65.0, -58.5], 3.5],
  ["Süveyş Kanalı", "bogaz", [32.5, 30.5], 2], ["Panama Kanalı", "bogaz", [-79.7, 9.1], 2], ["Tayvan Boğazı", "bogaz", [119.5, 24.5], 2.5],
  ["Bass Boğazı", "bogaz", [146.0, -39.5], 2.5], ["Mozambik Kanalı", "bogaz", [41.0, -17.5], 4],
  // Denizler
  ["Karadeniz", "deniz", [35.0, 43.5], 4], ["Akdeniz", "deniz", [18.0, 35.0], 6], ["Ege Denizi", "deniz", [25.0, 38.5], 2.5],
  ["Marmara Denizi", "deniz", [28.2, 40.7], 1.5], ["Kızıldeniz", "deniz", [38.0, 20.0], 4], ["Hazar Denizi", "deniz", [51.0, 41.5], 3.5],
  ["Baltık Denizi", "deniz", [19.0, 58.0], 4], ["Kuzey Denizi", "deniz", [3.0, 56.0], 4], ["Adriyatik Denizi", "deniz", [15.0, 42.5], 3],
  ["Japon Denizi", "deniz", [134.0, 40.0], 4], ["Güney Çin Denizi", "deniz", [114.0, 14.0], 5], ["Sarı Deniz", "deniz", [123.0, 35.5], 3.5],
  ["Arap Denizi", "deniz", [65.0, 15.0], 6], ["Bering Denizi", "deniz", [-175.0, 58.0], 5], ["Karayip Denizi", "deniz", [-75.0, 15.0], 5],
  ["Barents Denizi", "deniz", [40.0, 73.0], 5], ["Norveç Denizi", "deniz", [3.0, 69.0], 5], ["Tasman Denizi", "deniz", [160.0, -38.0], 5],
  ["Mercan Denizi", "deniz", [155.0, -17.0], 5], ["Ohotsk Denizi", "deniz", [150.0, 55.0], 5],
  // Körfezler
  ["Basra Körfezi", "korfez", [51.5, 27.0], 2.5], ["Umman Körfezi", "korfez", [58.5, 24.5], 2.5], ["Aden Körfezi", "korfez", [47.0, 12.0], 3],
  ["Bengal Körfezi", "korfez", [88.0, 15.0], 5], ["Meksika Körfezi", "korfez", [-90.0, 25.0], 5], ["Hudson Körfezi", "korfez", [-85.0, 60.0], 5],
  ["Biskay Körfezi", "korfez", [-5.0, 45.0], 3], ["Gine Körfezi", "korfez", [2.0, 3.0], 5], ["Alaska Körfezi", "korfez", [-145.0, 58.0], 4],
  ["Kaliforniya Körfezi", "korfez", [-111.0, 27.0], 3], ["Finlandiya Körfezi", "korfez", [25.0, 60.0], 2.5], ["Botni Körfezi", "korfez", [21.0, 63.0], 3],
  ["Tayland Körfezi", "korfez", [101.0, 10.0], 3], ["Sirte Körfezi", "korfez", [18.0, 31.0], 3], ["Carpentaria Körfezi", "korfez", [140.0, -14.0], 4],
  // Adalar
  ["Grönland", "ada", [-42.0, 72.0], 8], ["Madagaskar", "ada", [46.8, -19.0], 4], ["Borneo", "ada", [114.0, 0.5], 4], ["Sumatra", "ada", [101.5, -0.5], 4],
  ["Java", "ada", [110.5, -7.5], 3], ["Sulawesi", "ada", [121.0, -2.0], 3.5], ["Yeni Gine", "ada", [141.0, -5.5], 5], ["Büyük Britanya", "ada", [-2.0, 54.0], 3],
  ["İrlanda", "ada", [-8.0, 53.2], 2], ["İzlanda", "ada", [-19.0, 64.8], 3], ["Küba", "ada", [-79.0, 21.7], 4], ["Sicilya", "ada", [14.0, 37.5], 1.5],
  ["Sardinya", "ada", [9.0, 40.0], 1.5], ["Girit", "ada", [24.9, 35.2], 1.5], ["Kıbrıs", "ada", [33.0, 35.0], 1.5], ["Tazmanya", "ada", [146.7, -42.0], 2.5],
  ["Yeni Zelanda Güney Adası", "ada", [171.0, -43.5], 3], ["Sri Lanka", "ada", [80.7, 7.8], 2], ["Tayvan", "ada", [121.0, 23.7], 2],
  ["Hawaii Adaları", "ada", [-155.5, 19.6], 3], ["Baffin Adası", "ada", [-72.0, 68.0], 6], ["Newfoundland", "ada", [-56.0, 48.5], 3],
  ["Honşu (Japonya)", "ada", [138.0, 36.5], 4], ["Sahalin", "ada", [143.0, 51.0], 3], ["Svalbard", "ada", [16.0, 78.5], 4], ["Kanarya Adaları", "ada", [-15.5, 28.3], 3],
  ["Korsika", "ada", [9.0, 42.2], 1.2], ["Ateş Toprakları", "ada", [-68.0, -54.0], 3],
  // Yarımadalar
  ["İber Yarımadası", "yarimada", [-4.0, 40.0], 5], ["İskandinav Yarımadası", "yarimada", [15.0, 63.0], 6], ["Balkan Yarımadası", "yarimada", [21.0, 42.0], 4],
  ["İtalya Yarımadası", "yarimada", [13.0, 43.0], 3.5], ["Anadolu Yarımadası", "yarimada", [33.0, 39.0], 4], ["Arap Yarımadası", "yarimada", [45.0, 24.0], 6],
  ["Hindistan Yarımadası", "yarimada", [78.0, 18.0], 6], ["Hint-Çin Yarımadası", "yarimada", [102.0, 15.0], 5], ["Malay Yarımadası", "yarimada", [101.0, 5.0], 3],
  ["Kore Yarımadası", "yarimada", [127.5, 37.5], 3], ["Kamçatka Yarımadası", "yarimada", [159.0, 56.0], 4], ["Florida Yarımadası", "yarimada", [-81.5, 28.0], 3],
  ["Yucatan Yarımadası", "yarimada", [-89.0, 19.5], 3], ["Baja California Yarımadası", "yarimada", [-112.0, 28.0], 4], ["Somali Yarımadası (Afrika Boynuzu)", "yarimada", [46.0, 8.0], 5],
  ["Labrador Yarımadası", "yarimada", [-62.0, 54.0], 6], ["Jutland (Jütland) Yarımadası", "yarimada", [9.0, 56.0], 2], ["Kola Yarımadası", "yarimada", [36.0, 67.5], 4],
  // Çöller
  ["Sahra Çölü", "col", [15.0, 23.0], 8], ["Arabistan (Rubülhali) Çölü", "col", [50.0, 21.0], 5], ["Gobi Çölü", "col", [105.0, 43.0], 6], ["Thar Çölü", "col", [71.0, 27.0], 3.5],
  ["Taklamakan Çölü", "col", [84.0, 39.0], 4], ["Kalahari Çölü", "col", [22.0, -23.5], 5], ["Namib Çölü", "col", [15.0, -23.0], 3], ["Atacama Çölü", "col", [-69.0, -24.0], 3],
  ["Büyük Victoria Çölü", "col", [125.0, -28.5], 4], ["Karakum Çölü", "col", [58.0, 40.0], 4], ["Kızılkum Çölü", "col", [64.0, 42.0], 3.5],
  // Dağlar
  ["Alpler", "dag", [[6.0, 44.5], [8.0, 46.0], [11.0, 46.5], [14.0, 47.0]], 2], ["Pireneler", "dag", [[-2.0, 43.0], [0.5, 42.7], [3.0, 42.5]], 1.5],
  ["Karpatlar", "dag", [[19.0, 49.3], [24.0, 48.5], [25.0, 46.0], [22.0, 45.0]], 2], ["Kafkas Dağları", "dag", [[38.0, 44.5], [43.0, 42.8], [48.0, 41.8]], 2],
  ["Ural Dağları", "dag", [[60.0, 68.0], [59.0, 60.0], [58.0, 55.0], [58.0, 50.0]], 2.5], ["Himalaya Dağları", "dag", [[73.0, 34.0], [80.0, 30.0], [88.0, 28.0], [95.0, 28.0]], 2.5],
  ["Tanrı Dağları", "dag", [[70.0, 41.0], [78.0, 42.2], [85.0, 42.5]], 2.5], ["Altay Dağları", "dag", [[85.0, 50.0], [88.0, 49.0], [92.0, 49.0]], 2.5],
  ["And Dağları", "dag", [[-72.0, 7.0], [-77.0, -3.0], [-75.0, -12.0], [-70.0, -20.0], [-70.0, -33.0], [-72.0, -45.0], [-73.0, -52.0]], 3],
  ["Kayalık Dağlar", "dag", [[-120.0, 55.0], [-115.0, 50.0], [-109.0, 44.0], [-106.0, 37.0]], 3], ["Appalaşlar", "dag", [[-85.0, 34.0], [-80.0, 37.0], [-75.0, 41.0]], 2.5],
  ["Atlas Dağları", "dag", [[-8.0, 31.0], [-3.0, 32.5], [5.0, 35.5], [10.0, 36.5]], 2.5], ["Zagros Dağları", "dag", [[46.0, 36.0], [49.0, 33.0], [53.0, 30.0]], 2.5],
  ["Kilimanjaro", "dag", [37.35, -3.07], 3], ["Drakensberg", "dag", [29.0, -29.0], 3]
];
window.DUNYA_TURLER = [["hepsi", "Hepsi"], ["bogaz", "Boğaz ve kanallar"], ["deniz", "Denizler"], ["korfez", "Körfezler"], ["ada", "Adalar"], ["yarimada", "Yarımadalar"], ["col", "Çöller"], ["dag", "Dağlar"]];

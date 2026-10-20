// Mola: Türkiye'de yer şekilleri, göller ve akarsular. Konumlar yaklaşık (boylam, enlem); dokunma oyununda hoşgörü payı (r, derece) vardır.
// [ad, tür, konum, r]  tür: dag, ova, plato, gol, akarsu. Konum: nokta [lon,lat] ya da çizgi [[lon,lat],…]
window.TR_YERLER = [
  // Dağlar
  ["Kaçkar Dağları", "dag", [41.15, 40.84], 0.6], ["Ağrı Dağı", "dag", [44.30, 39.70], 0.5], ["Erciyes Dağı", "dag", [35.45, 38.53], 0.5],
  ["Uludağ", "dag", [29.13, 40.07], 0.5], ["Palandöken Dağları", "dag", [41.28, 39.85], 0.5], ["Süphan Dağı", "dag", [42.83, 38.92], 0.5],
  ["Hasan Dağı", "dag", [34.17, 38.13], 0.5], ["Karacadağ", "dag", [39.83, 37.67], 0.5], ["Munzur Dağları", "dag", [39.9, 39.4], 0.6],
  ["Aladağlar", "dag", [35.15, 37.85], 0.5], ["Bolkar Dağları", "dag", [34.6, 37.4], 0.5], ["Kaz Dağları", "dag", [26.85, 39.7], 0.5],
  ["Ilgaz Dağları", "dag", [33.7, 41.05], 0.5], ["Köroğlu Dağları", "dag", [32.0, 40.6], 0.5], ["Yıldız (Istranca) Dağları", "dag", [27.7, 41.8], 0.5],
  ["Sultan Dağları", "dag", [31.2, 38.5], 0.5], ["Cudi Dağı", "dag", [42.2, 37.35], 0.5], ["Zigana Dağları", "dag", [39.4, 40.6], 0.5],
  ["Toros Dağları", "dag", [[30.0, 37.0], [31.3, 36.9], [32.8, 36.8], [34.3, 37.2], [35.6, 37.8]], 0.5],
  ["Kuzey Anadolu Dağları", "dag", [[30.0, 40.7], [32.0, 41.1], [34.0, 41.6], [36.0, 41.0], [38.5, 40.7], [41.0, 40.85]], 0.5],
  // Ovalar
  ["Çukurova", "ova", [35.3, 37.0], 0.6], ["Konya Ovası", "ova", [32.8, 37.8], 0.7], ["Harran Ovası", "ova", [39.0, 36.9], 0.5],
  ["Bafra Ovası", "ova", [35.9, 41.6], 0.4], ["Çarşamba Ovası", "ova", [36.7, 41.2], 0.4], ["Erzurum Ovası", "ova", [41.3, 39.95], 0.5],
  ["Iğdır Ovası", "ova", [44.0, 39.9], 0.4], ["Muş Ovası", "ova", [41.5, 38.75], 0.5], ["Malatya Ovası", "ova", [38.3, 38.35], 0.5],
  ["Antalya Ovası", "ova", [30.7, 36.95], 0.5], ["Bursa Ovası", "ova", [29.0, 40.2], 0.4], ["Gediz Ovası", "ova", [27.8, 38.6], 0.5],
  ["Büyük Menderes Ovası", "ova", [28.5, 37.8], 0.5], ["Küçük Menderes Ovası", "ova", [27.6, 38.0], 0.4], ["Amik Ovası", "ova", [36.3, 36.4], 0.4],
  ["Ergene Ovası", "ova", [27.2, 41.2], 0.5], ["Eskişehir Ovası", "ova", [30.5, 39.75], 0.5], ["Elbistan Ovası", "ova", [37.2, 38.2], 0.4],
  // Platolar
  ["Teke Platosu", "plato", [30.5, 37.2], 0.6], ["Cihanbeyli Platosu", "plato", [32.9, 38.6], 0.6], ["Haymana Platosu", "plato", [32.5, 39.4], 0.5],
  ["Obruk Platosu", "plato", [33.5, 38.1], 0.6], ["Şanlıurfa Platosu", "plato", [38.8, 37.2], 0.5], ["Gaziantep Platosu", "plato", [37.4, 37.1], 0.5],
  ["Kars Platosu", "plato", [43.0, 40.6], 0.6], ["Ardahan Platosu", "plato", [42.7, 41.1], 0.5], ["Bozok Platosu", "plato", [34.8, 39.8], 0.6],
  // Göller
  ["Van Gölü", "gol", [42.9, 38.6], 0.6], ["Tuz Gölü", "gol", [33.4, 38.75], 0.5], ["Beyşehir Gölü", "gol", [31.55, 37.75], 0.4],
  ["Eğirdir Gölü", "gol", [30.85, 37.9], 0.35], ["Burdur Gölü", "gol", [30.2, 37.75], 0.35], ["İznik Gölü", "gol", [29.5, 40.45], 0.3],
  ["Sapanca Gölü", "gol", [30.25, 40.7], 0.3], ["Atatürk Baraj Gölü", "gol", [38.5, 37.5], 0.4], ["Keban Baraj Gölü", "gol", [38.8, 38.8], 0.4],
  ["Hazar Gölü", "gol", [39.4, 38.5], 0.3], ["Çıldır Gölü", "gol", [43.25, 41.05], 0.3], ["Akşehir Gölü", "gol", [31.4, 38.4], 0.3],
  ["Manyas (Kuş) Gölü", "gol", [28.0, 40.2], 0.3], ["Uluabat Gölü", "gol", [28.6, 40.18], 0.3], ["Köyceğiz Gölü", "gol", [28.65, 36.97], 0.3],
  ["Bafa Gölü", "gol", [27.5, 37.5], 0.3], ["Marmara Gölü", "gol", [28.0, 38.65], 0.3], ["Salda Gölü", "gol", [29.7, 37.55], 0.3],
  // Akarsular
  ["Kızılırmak", "akarsu", [[37.2, 39.7], [36.0, 39.2], [34.5, 39.15], [33.5, 39.2], [33.9, 40.0], [34.8, 40.95], [35.5, 41.5], [35.95, 41.7]], 0.35],
  ["Sakarya Nehri", "akarsu", [[31.0, 39.4], [31.5, 39.9], [30.8, 40.4], [30.4, 40.75], [30.7, 41.1]], 0.35],
  ["Fırat Nehri", "akarsu", [[41.2, 39.9], [39.5, 39.75], [38.75, 38.8], [38.3, 37.9], [38.0, 37.0], [38.0, 36.7]], 0.35],
  ["Dicle Nehri", "akarsu", [[39.5, 38.45], [40.2, 37.95], [41.1, 37.95], [41.8, 37.6], [42.4, 37.3]], 0.35],
  ["Yeşilırmak", "akarsu", [[37.6, 40.2], [36.55, 40.3], [35.8, 40.65], [36.3, 41.0], [36.7, 41.4]], 0.3],
  ["Büyük Menderes Nehri", "akarsu", [[30.0, 38.1], [29.0, 38.0], [28.0, 37.85], [27.3, 37.65]], 0.3],
  ["Gediz Nehri", "akarsu", [[29.3, 39.0], [28.3, 38.7], [27.4, 38.6], [26.85, 38.55]], 0.3],
  ["Seyhan Nehri", "akarsu", [[36.5, 38.3], [35.8, 37.6], [35.3, 37.0], [35.05, 36.75]], 0.3],
  ["Ceyhan Nehri", "akarsu", [[37.0, 37.7], [36.2, 37.2], [35.8, 36.75]], 0.3],
  ["Aras Nehri", "akarsu", [[40.9, 39.9], [42.0, 40.0], [43.5, 40.0], [44.2, 39.8]], 0.3],
  ["Çoruh Nehri", "akarsu", [[40.2, 40.25], [41.0, 40.5], [41.55, 40.8], [41.82, 41.18], [41.57, 41.6]], 0.3],
  ["Meriç Nehri", "akarsu", [[26.55, 41.7], [26.4, 41.4], [26.2, 41.0], [26.05, 40.75]], 0.3]
];
window.TR_TURLER = [["hepsi", "Hepsi"], ["dag", "Dağlar"], ["ova", "Ovalar"], ["plato", "Platolar"], ["gol", "Göller"], ["akarsu", "Akarsular"]];

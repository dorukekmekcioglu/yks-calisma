// Mola oyunları: ülke ve başkent listesi. [ülke, başkent, kıta]
// Kıtalar: av (Avrupa), as (Asya), af (Afrika), ka (Kuzey ve Orta Amerika), ga (Güney Amerika), ok (Okyanusya)
window.MOLA_ULKELER = [
  // Avrupa
  ["Almanya", "Berlin", "av"], ["Fransa", "Paris", "av"], ["İtalya", "Roma", "av"], ["İspanya", "Madrid", "av"],
  ["Portekiz", "Lizbon", "av"], ["Birleşik Krallık", "Londra", "av"], ["İrlanda", "Dublin", "av"], ["Hollanda", "Amsterdam", "av"],
  ["Belçika", "Brüksel", "av"], ["Lüksemburg", "Lüksemburg", "av"], ["İsviçre", "Bern", "av"], ["Avusturya", "Viyana", "av"],
  ["Polonya", "Varşova", "av"], ["Çekya", "Prag", "av"], ["Slovakya", "Bratislava", "av"], ["Macaristan", "Budapeşte", "av"],
  ["Romanya", "Bükreş", "av"], ["Bulgaristan", "Sofya", "av"], ["Yunanistan", "Atina", "av"], ["Sırbistan", "Belgrad", "av"],
  ["Hırvatistan", "Zagreb", "av"], ["Slovenya", "Ljubljana", "av"], ["Bosna-Hersek", "Saraybosna", "av"], ["Karadağ", "Podgorica", "av"],
  ["Kuzey Makedonya", "Üsküp", "av"], ["Arnavutluk", "Tiran", "av"], ["Danimarka", "Kopenhag", "av"], ["İsveç", "Stokholm", "av"],
  ["Norveç", "Oslo", "av"], ["Finlandiya", "Helsinki", "av"], ["İzlanda", "Reykjavik", "av"], ["Estonya", "Tallinn", "av"],
  ["Letonya", "Riga", "av"], ["Litvanya", "Vilnius", "av"], ["Belarus", "Minsk", "av"], ["Ukrayna", "Kiev", "av"],
  ["Moldova", "Kişinev", "av"], ["Rusya", "Moskova", "av"], ["Malta", "Valletta", "av"], ["Kıbrıs", "Lefkoşa", "av"],
  // Asya
  ["Türkiye", "Ankara", "as"], ["Gürcistan", "Tiflis", "as"], ["Ermenistan", "Erivan", "as"], ["Azerbaycan", "Bakü", "as"],
  ["İran", "Tahran", "as"], ["Irak", "Bağdat", "as"], ["Suriye", "Şam", "as"], ["Lübnan", "Beyrut", "as"], ["Ürdün", "Amman", "as"],
  ["Suudi Arabistan", "Riyad", "as"], ["Yemen", "Sana", "as"], ["Umman", "Maskat", "as"], ["Birleşik Arap Emirlikleri", "Abu Dabi", "as"],
  ["Katar", "Doha", "as"], ["Bahreyn", "Manama", "as"], ["Kuveyt", "Kuveyt", "as"], ["Kazakistan", "Astana", "as"],
  ["Özbekistan", "Taşkent", "as"], ["Türkmenistan", "Aşkabat", "as"], ["Kırgızistan", "Bişkek", "as"], ["Tacikistan", "Duşanbe", "as"],
  ["Afganistan", "Kabil", "as"], ["Pakistan", "İslamabad", "as"], ["Hindistan", "Yeni Delhi", "as"], ["Nepal", "Katmandu", "as"],
  ["Bangladeş", "Dakka", "as"], ["Butan", "Thimphu", "as"], ["Moğolistan", "Ulan Batur", "as"], ["Çin", "Pekin", "as"],
  ["Japonya", "Tokyo", "as"], ["Güney Kore", "Seul", "as"], ["Kuzey Kore", "Pyongyang", "as"], ["Vietnam", "Hanoi", "as"],
  ["Laos", "Vientiane", "as"], ["Kamboçya", "Phnom Penh", "as"], ["Tayland", "Bangkok", "as"], ["Myanmar", "Naypyidaw", "as"],
  ["Malezya", "Kuala Lumpur", "as"], ["Singapur", "Singapur", "as"], ["Endonezya", "Cakarta", "as"], ["Filipinler", "Manila", "as"],
  ["Brunei", "Bandar Seri Begawan", "as"], ["Maldivler", "Male", "as"],
  // Afrika
  ["Mısır", "Kahire", "af"], ["Libya", "Trablus", "af"], ["Tunus", "Tunus", "af"], ["Cezayir", "Cezayir", "af"], ["Fas", "Rabat", "af"],
  ["Moritanya", "Nuakşot", "af"], ["Mali", "Bamako", "af"], ["Nijer", "Niamey", "af"], ["Çad", "Encamine", "af"], ["Sudan", "Hartum", "af"],
  ["Güney Sudan", "Cuba", "af"], ["Eritre", "Asmara", "af"], ["Etiyopya", "Addis Ababa", "af"], ["Cibuti", "Cibuti", "af"],
  ["Somali", "Mogadişu", "af"], ["Kenya", "Nairobi", "af"], ["Uganda", "Kampala", "af"], ["Ruanda", "Kigali", "af"],
  ["Tanzanya", "Dodoma", "af"], ["Mozambik", "Maputo", "af"], ["Malavi", "Lilongve", "af"], ["Zambiya", "Lusaka", "af"],
  ["Zimbabve", "Harare", "af"], ["Botsvana", "Gaborone", "af"], ["Namibya", "Windhoek", "af"], ["Güney Afrika", "Pretoria", "af"],
  ["Lesotho", "Maseru", "af"], ["Madagaskar", "Antananarivo", "af"], ["Angola", "Luanda", "af"],
  ["Kongo Demokratik Cumhuriyeti", "Kinşasa", "af"], ["Kongo Cumhuriyeti", "Brazzaville", "af"], ["Gabon", "Libreville", "af"],
  ["Ekvator Ginesi", "Malabo", "af"], ["Kamerun", "Yaoundé", "af"], ["Orta Afrika Cumhuriyeti", "Bangui", "af"], ["Nijerya", "Abuja", "af"],
  ["Benin", "Porto-Novo", "af"], ["Togo", "Lome", "af"], ["Gana", "Akra", "af"], ["Fildişi Sahili", "Yamusukro", "af"],
  ["Liberya", "Monrovia", "af"], ["Sierra Leone", "Freetown", "af"], ["Gine", "Konakri", "af"], ["Gine-Bissau", "Bissau", "af"],
  ["Senegal", "Dakar", "af"], ["Gambiya", "Banjul", "af"], ["Burkina Faso", "Vagadugu", "af"], ["Cabo Verde", "Praia", "af"],
  // Kuzey ve Orta Amerika
  ["Amerika Birleşik Devletleri", "Washington", "ka"], ["Kanada", "Ottawa", "ka"], ["Meksika", "Meksiko", "ka"],
  ["Guatemala", "Guatemala", "ka"], ["Belize", "Belmopan", "ka"], ["Honduras", "Tegucigalpa", "ka"], ["El Salvador", "San Salvador", "ka"],
  ["Nikaragua", "Managua", "ka"], ["Kosta Rika", "San José", "ka"], ["Panama", "Panama", "ka"], ["Küba", "Havana", "ka"],
  ["Haiti", "Port-au-Prince", "ka"], ["Dominik Cumhuriyeti", "Santo Domingo", "ka"], ["Jamaika", "Kingston", "ka"],
  ["Bahamalar", "Nassau", "ka"], ["Trinidad ve Tobago", "Port of Spain", "ka"], ["Barbados", "Bridgetown", "ka"],
  // Güney Amerika
  ["Brezilya", "Brasilia", "ga"], ["Arjantin", "Buenos Aires", "ga"], ["Şili", "Santiago", "ga"], ["Uruguay", "Montevideo", "ga"],
  ["Paraguay", "Asunción", "ga"], ["Peru", "Lima", "ga"], ["Ekvador", "Quito", "ga"], ["Kolombiya", "Bogota", "ga"],
  ["Venezuela", "Karakas", "ga"], ["Guyana", "Georgetown", "ga"], ["Surinam", "Paramaribo", "ga"],
  // Okyanusya
  ["Avustralya", "Canberra", "ok"], ["Yeni Zelanda", "Wellington", "ok"], ["Papua Yeni Gine", "Port Moresby", "ok"], ["Fiji", "Suva", "ok"],
  ["Samoa", "Apia", "ok"], ["Tonga", "Nukualofa", "ok"], ["Vanuatu", "Port Vila", "ok"], ["Solomon Adaları", "Honiara", "ok"]
];
window.MOLA_KITALAR = [["hepsi", "Hepsi"], ["av", "Avrupa"], ["as", "Asya"], ["af", "Afrika"], ["ka", "Kuzey ve Orta Amerika"], ["ga", "Güney Amerika"], ["ok", "Okyanusya"]];

// Adı çok tanınmayan ülkeler: oyunda seyrek sorulur (ağırlığı düşüktür).
window.MOLA_ZOR = ["Karadağ", "Moldova", "Kuzey Makedonya", "Butan", "Brunei", "Maldivler", "Bahreyn", "Umman", "Tacikistan", "Türkmenistan", "Kırgızistan", "Laos", "Eritre", "Cibuti", "Burkina Faso", "Gine-Bissau", "Cabo Verde", "Gambiya", "Sierra Leone", "Liberya", "Togo", "Benin", "Orta Afrika Cumhuriyeti", "Ekvator Ginesi", "Gabon", "Malavi", "Lesotho", "Botsvana", "Namibya", "Moritanya", "Nijer", "Çad", "Mali", "Güney Sudan", "Ruanda", "Gine", "Belize", "Barbados", "Trinidad ve Tobago", "Bahamalar", "Guyana", "Surinam", "Papua Yeni Gine", "Fiji", "Samoa", "Tonga", "Vanuatu", "Solomon Adaları", "Kongo Cumhuriyeti"];

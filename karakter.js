// Ana sayfayı selamlayan border collie (elle çizilmiş SVG).
// Gündüz: güneş ışığı ve fular. Gece: ay ışığı, yıldızlar ve takke.
// karakterSvg(true) → gece, karakterSvg(false) → gündüz.
function karakterSvg(gece) {
  var kol = gece ? "#86a9d6" : "#2f3a5a";      // kol/gövde rengi
  var kolAcik = gece ? "#a7c1e6" : "#3d4b73";

  var arka = gece
    ? '<circle cx="100" cy="104" r="84" fill="#cfd8ff" opacity=".22"/>' +
      '<circle cx="100" cy="104" r="62" fill="#e7ecff" opacity=".18"/>' +
      '<path class="ay" d="M156 26a26 26 0 1 0 22 40a22 22 0 1 1-22-40z" fill="#fff3c4"/>' +
      '<g fill="#fff6d6">' +
      '<path class="yildiz" style="animation-delay:0s" d="M34 40l2.4 6 6 2.4-6 2.4-2.4 6-2.4-6-6-2.4 6-2.4z"/>' +
      '<path class="yildiz" style="animation-delay:1.1s" d="M20 92l1.8 4.4 4.4 1.8-4.4 1.8-1.8 4.4-1.8-4.4-4.4-1.8 4.4-1.8z"/>' +
      '<path class="yildiz" style="animation-delay:.6s" d="M64 14l1.6 3.8 3.8 1.6-3.8 1.6-1.6 3.8-1.6-3.8-3.8-1.6 3.8-1.6z"/>' +
      '<path class="yildiz" style="animation-delay:1.7s" d="M182 112l1.6 3.8 3.8 1.6-3.8 1.6-1.6 3.8-1.6-3.8-3.8-1.6 3.8-1.6z"/>' +
      '</g>'
    : '<circle cx="100" cy="104" r="86" fill="#ffe7a0" opacity=".5"/>' +
      '<circle cx="100" cy="104" r="64" fill="#fff1bf" opacity=".55"/>' +
      '<g class="isinlar" stroke="#f4be4a" stroke-width="5" stroke-linecap="round">' +
      [0,30,60,90,120,150,180,210,240,270,300,330].map(function (a) {
        return '<line x1="100" y1="6" x2="100" y2="20" transform="rotate(' + a + ' 100 104)"/>';
      }).join("") +
      '</g>';

  var K = "#2b2b33", B = "#fffdf8", G = "#e9e2d6";
  // Gündüz: kiremit fular. Gece: pijama yakası ve takke.
  var aksesuar = gece
    ? '<path d="M70 176Q100 196 130 176L128 190Q100 206 72 190Z" fill="#86a9d6"/><circle cx="100" cy="196" r="3" fill="#f3ead8"/>'
    : '<path d="M72 174Q100 192 128 174L124 190Q100 206 76 190Z" fill="#b86b4b"/><path d="M94 192l6 22 6-22z" fill="#a15c3e"/>';
  var takke = gece
    ? '<path d="M64 62Q70 20 112 24Q146 30 138 66Q104 54 64 62Z" fill="#86a9d6"/>' +
      '<path d="M64 62Q104 52 138 66L136 74Q102 62 66 72Z" fill="#fffdf8"/><circle cx="118" cy="22" r="8" fill="#fffdf8"/>'
    : '';

  var govde =
    '<path d="M24 232C28 196 58 178 100 176C142 178 172 196 176 232Z" fill="' + K + '"/>' +
    '<path d="M78 180Q100 170 122 180L128 232H72Z" fill="' + B + '"/>' +
    '';

  var sallayanPati =
    '<g class="el" style="transform-origin:160px 190px">' +
    '<path d="M158 192Q172 160 170 132" stroke="' + K + '" stroke-width="22" stroke-linecap="round" fill="none"/>' +
    '<ellipse cx="170" cy="124" rx="13" ry="14" fill="' + B + '"/>' +
    '<g stroke="' + G + '" stroke-width="2.4" stroke-linecap="round"><path d="M165 120v6M171 118v8M177 120v6"/></g>' +
    '</g>';

  return '<svg viewBox="0 0 200 232" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Seni selamlayan border collie">' +
    arka +
    '<g class="kar-govde">' +
      govde +
      sallayanPati +
      // kulaklar (uçları öne kıvrık)
      '<path d="M52 84C38 60 46 38 62 36C76 44 84 62 82 82Z" fill="' + K + '"/>' +
      '<path d="M148 84C162 60 154 38 138 36C124 44 116 62 118 82Z" fill="' + K + '"/>' +
      '<path d="M62 44C52 60 56 70 62 76" stroke="#454553" stroke-width="3" stroke-linecap="round" fill="none"/>' +
      '<path d="M138 44C148 60 144 70 138 76" stroke="#454553" stroke-width="3" stroke-linecap="round" fill="none"/>' +
      // boyun ve göğüs: baş ile gövde arasını kapatır
      '<path d="M82 156Q100 180 118 156L124 190H76Z" fill="' + B + '"/>' +
      // baş: siyah, ortada beyaz şerit ve beyaz ağız
      '<ellipse cx="100" cy="112" rx="50" ry="46" fill="' + K + '"/>' +
      '<path d="M92 62Q100 58 108 62L112 104Q124 120 124 134Q124 158 100 160Q76 158 76 134Q76 120 88 104Z" fill="' + B + '"/>' +
      '<path d="M100 66V102" stroke="' + G + '" stroke-width="2" opacity=".6"/>' +
      // kaşlardaki küçük açık benekler
      '<circle cx="76" cy="90" r="3.2" fill="#c7a26a"/><circle cx="124" cy="90" r="3.2" fill="#c7a26a"/>' +
      // gözler
      '<g class="goz"><ellipse cx="80" cy="106" rx="7" ry="8" fill="#fff"/><ellipse cx="120" cy="106" rx="7" ry="8" fill="#fff"/>' +
      '<circle cx="81" cy="107" r="5" fill="#6b4226"/><circle cx="119" cy="107" r="5" fill="#6b4226"/>' +
      '<circle cx="81" cy="107" r="2.6" fill="#1b1410"/><circle cx="119" cy="107" r="2.6" fill="#1b1410"/>' +
      '<circle cx="83" cy="104.5" r="1.6" fill="#fff"/><circle cx="121" cy="104.5" r="1.6" fill="#fff"/></g>' +
      // burun ve ağız
      '<path d="M91 126Q100 120 109 126Q108 136 100 138Q92 136 91 126Z" fill="#1d1d24"/>' +
      '<ellipse cx="97" cy="127" rx="3" ry="1.6" fill="#555566" opacity=".8"/>' +
      '<path d="M100 138V144M100 144Q92 152 86 146M100 144Q108 152 114 146" stroke="#1d1d24" stroke-width="3" stroke-linecap="round" fill="none"/>' +
      '<path class="dil" d="M96 148Q100 168 106 148Z" fill="#f08a9a" stroke="#d96b7e" stroke-width="1.6" stroke-linejoin="round"/>' +
      takke +
    '</g></svg>';
}

function karakterGece() {
  var s = location.search;
  if (s.indexOf("gece=1") >= 0) return true;
  if (s.indexOf("gunduz=1") >= 0) return false;
  var saat = new Date().getHours();
  return saat >= 19 || saat < 6;
}

#!/usr/bin/env python3
"""İçerik denetimi: data/*.js ders dosyalarını SORU-REHBERI.md §8'e göre kontrol eder.

Kullanım:
  python3 araclar/denetim.py               # bütün dersler
  python3 araclar/denetim.py turkce-tyt    # tek ders (dosya adı, .js olmadan)
  python3 araclar/denetim.py --ozet        # yalnızca konu tablosu
  python3 araclar/denetim.py --hepsi       # bütün uyarıları listele (varsayılan: tür başına 10)

HATA varsa çıkış kodu 1'dir; commit'ten önce sıfır HATA olmalıdır.
Yalnızca Python standart kütüphanesi kullanılır.
"""
import difflib
import os
import re
import sys
from collections import Counter, defaultdict

KOK = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA = os.path.join(KOK, "data")
UYARI_LIMIT = 10


# ---------------------------------------------------------------------------
# JS nesne değişmezi okuyucu (tırnaksız anahtarlar, sondaki virgüller,
# yorumlar, tek/çift/ters tırnaklı dizgiler ve "a" + "b" birleştirmesi)
# ---------------------------------------------------------------------------
class JSOkuyucu:
    def __init__(self, metin, baslangic=0):
        self.s = metin
        self.i = baslangic

    def hata(self, mesaj):
        satir = self.s.count("\n", 0, self.i) + 1
        raise ValueError(f"{mesaj} (satır {satir})")

    def bosluk(self):
        s = self.s
        while self.i < len(s):
            c = s[self.i]
            if c in " \t\r\n":
                self.i += 1
            elif s.startswith("//", self.i):
                j = s.find("\n", self.i)
                self.i = len(s) if j < 0 else j + 1
            elif s.startswith("/*", self.i):
                j = s.find("*/", self.i + 2)
                if j < 0:
                    self.hata("kapanmamış yorum")
                self.i = j + 2
            else:
                break

    def bak(self):
        self.bosluk()
        return self.s[self.i] if self.i < len(self.s) else ""

    def bekle(self, c):
        if self.bak() != c:
            self.hata(f"'{c}' bekleniyordu, '{self.bak()}' bulundu")
        self.i += 1

    def deger(self):
        c = self.bak()
        if c == "{":
            v = self.nesne()
        elif c == "[":
            v = self.dizi()
        elif c in "\"'`":
            v = self.dizgi()
        elif c == "-" or c.isdigit():
            v = self.sayi()
        else:
            m = re.compile(r"[A-Za-z_$][\w$]*").match(self.s, self.i)
            if not m:
                self.hata(f"beklenmeyen karakter '{c}'")
            self.i = m.end()
            sozcuk = m.group(0)
            if sozcuk in ("true", "false"):
                v = sozcuk == "true"
            elif sozcuk in ("null", "undefined"):
                v = None
            else:
                self.hata(f"desteklenmeyen ifade '{sozcuk}'")
        while isinstance(v, str) and self.bak() == "+":
            self.i += 1
            ek = self.deger()
            v += ek if isinstance(ek, str) else str(ek)
        return v

    def nesne(self):
        self.bekle("{")
        o = {}
        while True:
            c = self.bak()
            if c == "}":
                self.i += 1
                return o
            if c in "\"'":
                anahtar = self.dizgi()
            else:
                m = re.compile(r"[A-Za-z_$][\w$]*").match(self.s, self.i)
                if not m:
                    self.hata("nesne anahtarı bekleniyordu")
                anahtar = m.group(0)
                self.i = m.end()
            self.bekle(":")
            o[anahtar] = self.deger()
            if self.bak() == ",":
                self.i += 1

    def dizi(self):
        self.bekle("[")
        a = []
        while True:
            if self.bak() == "]":
                self.i += 1
                return a
            a.append(self.deger())
            if self.bak() == ",":
                self.i += 1

    def dizgi(self):
        tirnak = self.s[self.i]
        self.i += 1
        parcalar = []
        kacis = {"n": "\n", "t": "\t", "r": "\r", "b": "\b", "f": "\f", "v": "\v", "0": "\0"}
        while self.i < len(self.s):
            c = self.s[self.i]
            if c == "\\":
                n = self.s[self.i + 1]
                if n == "u":
                    if self.s[self.i + 2] == "{":
                        j = self.s.index("}", self.i)
                        parcalar.append(chr(int(self.s[self.i + 3:j], 16)))
                        self.i = j + 1
                    else:
                        parcalar.append(chr(int(self.s[self.i + 2:self.i + 6], 16)))
                        self.i += 6
                    continue
                if n == "x":
                    parcalar.append(chr(int(self.s[self.i + 2:self.i + 4], 16)))
                    self.i += 4
                    continue
                if n == "\n":
                    self.i += 2
                    continue
                parcalar.append(kacis.get(n, n))
                self.i += 2
            elif c == tirnak:
                self.i += 1
                return "".join(parcalar)
            else:
                if tirnak == "`" and self.s.startswith("${", self.i):
                    self.hata("şablon dizgisinde ${} desteklenmiyor")
                parcalar.append(c)
                self.i += 1
        self.hata("kapanmamış dizgi")

    def sayi(self):
        m = re.compile(r"-?\d+(\.\d+)?([eE][+-]?\d+)?").match(self.s, self.i)
        if not m:
            self.hata("sayı bekleniyordu")
        self.i = m.end()
        return float(m.group(0)) if (m.group(1) or m.group(2)) else int(m.group(0))


def ders_oku(yol):
    metin = open(yol, encoding="utf-8").read()
    m = re.search(r"icerikKaydet\(\s*([\"'])([^\"']+)\1\s*,", metin)
    if not m:
        return None, None
    okuyucu = JSOkuyucu(metin, m.end())
    return m.group(2), okuyucu.deger()


# ---------------------------------------------------------------------------
# Yardımcılar
# ---------------------------------------------------------------------------
OLUMSUZ = re.compile(r"\b(değildir|değil|yoktur|söylenemez|olamaz|yanlıştır|beklenmez|ulaşılamaz)\b", re.I)
ALTI_CIZILI = re.compile(r"altı\s+çizili", re.I)
ISARET = re.compile(r"__(.+?)__")


def kucult(s):
    return s.replace("I", "ı").replace("İ", "i").lower()


def sade(s):
    s = kucult(ISARET.sub(r"\1", s))
    return re.sub(r"[\W_]+", " ", s).strip()


def benzer(a, b, esik):
    m = difflib.SequenceMatcher(None, a, b)
    return m.real_quick_ratio() >= esik and m.quick_ratio() >= esik and m.ratio() >= esik


def ortanca(liste):
    l = sorted(liste)
    n = len(l)
    return l[n // 2] if n % 2 else (l[n // 2 - 1] + l[n // 2]) / 2


def is_oncullu(q):
    return bool(q.get("oncul"))


# ---------------------------------------------------------------------------
# Denetim
# ---------------------------------------------------------------------------
def denetle(ders, veri):
    hatalar = []                     # (kimlik, mesaj)
    uyarilar = defaultdict(list)     # tür -> [(kimlik, mesaj)]
    maddeler = veri.get("maddeler") or []
    sorular = veri.get("sorular") or []
    testler = veri.get("testler") or []

    madde_idleri = set()
    tum_idler = Counter()
    for md in maddeler:
        tum_idler[md.get("id")] += 1
        madde_idleri.add(md.get("id"))
    soru_idleri = set()
    for q in sorular:
        tum_idler[q.get("id")] += 1
        soru_idleri.add(q.get("id"))
    for t in testler:
        tum_idler[t.get("id")] += 1
    for kimlik, n in tum_idler.items():
        if n > 1:
            hatalar.append((kimlik, f"kimlik {n} kez kullanılmış"))

    for md in maddeler:
        if not (md.get("bilgi") or "").strip():
            hatalar.append((md.get("id"), "maddenin 'bilgi' alanı boş"))

    konu_ist = defaultdict(lambda: {"n": 0, "en_uzun": 0, "oncullu": 0, "olumsuz": 0, "sabit_dogru": Counter(), "kokler": []})
    bagli_madde = set()

    for q in sorular:
        k = q.get("id", "?")
        sec = q.get("secenekler") or []
        d = q.get("dogru")
        soru = q.get("soru") or ""
        dipnot = (q.get("dipnot") or "").strip()
        ist = konu_ist[q.get("konu", "?")]
        ist["n"] += 1

        # --- HATA ---
        if len(sec) != 5:
            hatalar.append((k, f"{len(sec)} şık var (5 olmalı)"))
        if not all(isinstance(s, str) and s.strip() for s in sec):
            hatalar.append((k, "boş şık var"))
            continue
        # noktalama ve büyük/küçük harf anlamlı olabilir (noktalama soruları, "RR"/"rr"), yalnızca boşluk sadeleştirilir
        tekrar = [s for s, n in Counter(" ".join(s.split()) for s in sec).items() if n > 1]
        if tekrar:
            hatalar.append((k, f"tekrarlanan şık: {tekrar[0]!r}"))
        if not isinstance(d, int) or not 0 <= d < len(sec):
            hatalar.append((k, f"'dogru' aralık dışında: {d!r}"))
            continue
        if not dipnot:
            hatalar.append((k, "dipnot boş"))
        for mid in q.get("maddeler") or []:
            if mid not in madde_idleri:
                hatalar.append((k, f"var olmayan maddeye bağlı: {mid}"))
            bagli_madde.add(mid)
        if not q.get("maddeler"):
            hatalar.append((k, "hiçbir maddeye bağlı değil"))
        if ALTI_CIZILI.search(soru):
            kokte = len(ISARET.findall(soru)) >= 1
            siklarda = all(len(ISARET.findall(s)) == 1 for s in sec)
            if not (kokte or siklarda):
                hatalar.append((k, "kökte 'altı çizili' geçiyor ama __…__ işareti yok"))

        # --- istatistik ---
        uzunluk = [len(ISARET.sub(r"\1", s)) for s in sec]
        en_uzun = max(uzunluk)
        if uzunluk[d] == en_uzun and uzunluk.count(en_uzun) == 1:
            ist["en_uzun"] += 1
        if is_oncullu(q):
            ist["oncullu"] += 1
        if OLUMSUZ.search(soru):
            ist["olumsuz"] += 1
        if q.get("sabit"):
            ist["sabit_dogru"]["ABCDE"[d]] += 1
        if not q.get("gorsel"):  # görselli sorularda kök aynı, görsel farklı olabilir
            ist["kokler"].append((k, sade(soru), sade(sec[d])))

        # --- UYARI ---
        if not q.get("sabit") and not is_oncullu(q):
            digerleri = [u for i, u in enumerate(uzunluk) if i != d]
            if uzunluk[d] == en_uzun and uzunluk[d] > 1.5 * ortanca(digerleri) and uzunluk[d] - ortanca(digerleri) >= 15:
                uyarilar["Doğru şık belirgin biçimde en uzun"].append(
                    (k, f"doğru şık {uzunluk[d]} karakter, çeldiricilerin ortancası {ortanca(digerleri):.0f}"))
            # Kardeş kavramlardan oluşan benzer şık setleri iyi çeldiricidir (Ekzosfer/Mezosfer).
            # Sorun, doğru şıkkın tek bir "ikizi" olup diğer şıkların farklı olmasıdır: cevap o ikisinden biridir.
            sadeler = [sade(s) for s in sec]
            komsu = [i for i in range(5) if i != d and min(len(sadeler[i]), len(sadeler[d])) >= 6
                     and benzer(sadeler[i], sadeler[d], 0.85)]
            if len(komsu) == 1:
                e = komsu[0]
                baskalari = [i for i in range(5) if i not in (d, e)]
                if not any(benzer(sadeler[e], sadeler[i], 0.7) or benzer(sadeler[d], sadeler[i], 0.7) for i in baskalari):
                    uyarilar["Cevabı ele veren ikiz şık"].append((k, f"{sec[d]!r} ~ {sec[e]!r}"))
        if is_oncullu(q) and not q.get("sabit"):
            uyarilar["Öncüllü soru sabit değil"].append((k, "öncüllü sorularda sabit: true olmalı"))
        if dipnot and len(dipnot) < 20:
            uyarilar["Dipnot çok kısa"].append((k, repr(dipnot)))
        elif dipnot and benzer(sade(dipnot), sade(soru), 0.8):
            uyarilar["Dipnot soruyu tekrar ediyor"].append((k, repr(dipnot[:60])))

    # aynı konuda neredeyse aynı kök
    for konu, ist in konu_ist.items():
        kokler = ist["kokler"]
        for i in range(len(kokler)):
            for j in range(i + 1, len(kokler)):
                (k1, a, ca), (k2, b, cb) = kokler[i], kokler[j]
                # aynı genel kök ("hangisinde yazım yanlışı vardır?") normaldir; kök VE doğru cevap benzerse soru tekrar ediyordur
                if benzer(a, b, 0.9) and (ca == cb or benzer(ca, cb, 0.85)):
                    uyarilar["Aynı soru tekrar ediyor"].append((k1, f"≈ {k2}"))

    for t in testler:
        for sid in t.get("sorular") or []:
            if sid not in soru_idleri:
                hatalar.append((t.get("id"), f"test var olmayan soruyu listeliyor: {sid}"))

    sorusuz = [md.get("id") for md in maddeler if md.get("id") not in bagli_madde]
    return hatalar, uyarilar, konu_ist, len(maddeler), len(sorular), sorusuz


def yuzde(a, b):
    return f"%{round(100 * a / b)}" if b else "-"


def konu_tablosu(konu_ist):
    satirlar = []
    satirlar.append(f"  {'konu':34} {'soru':>5} {'en uzun':>8} {'öncüllü':>8} {'olumsuz':>8}  işaret")
    for konu in sorted(konu_ist):
        ist = konu_ist[konu]
        n = ist["n"]
        isaret = []
        if n >= 10 and ist["en_uzun"] / n > 0.30:
            isaret.append("en uzun >%30")
        if n >= 10 and ist["oncullu"] / n < 0.15:
            isaret.append("öncüllü <%15")
        if n and ist["olumsuz"] / n > 0.20:
            isaret.append("olumsuz >%20")
        sd = ist["sabit_dogru"]
        toplam_sabit = sum(sd.values())
        if toplam_sabit >= 10 and any(not 0.10 <= sd[h] / toplam_sabit <= 0.30 for h in "ABCDE"):
            isaret.append("sabit dağılım dengesiz")
        satirlar.append(f"  {konu[:34]:34} {n:>5} {yuzde(ist['en_uzun'], n):>8} {yuzde(ist['oncullu'], n):>8} "
                        f"{yuzde(ist['olumsuz'], n):>8}  {', '.join(isaret)}")
    return "\n".join(satirlar)


def main():
    argumanlar = [a for a in sys.argv[1:] if not a.startswith("--")]
    ozet = "--ozet" in sys.argv
    hepsi = "--hepsi" in sys.argv

    dosyalar = sorted(f for f in os.listdir(DATA) if f.endswith(".js"))
    if argumanlar:
        dosyalar = [f for f in dosyalar if f[:-3] in argumanlar]
        if not dosyalar:
            print("Böyle bir ders dosyası yok:", ", ".join(argumanlar))
            return 2

    toplam_hata = toplam_uyari = 0
    for f in dosyalar:
        yol = os.path.join(DATA, f)
        try:
            ders, veri = ders_oku(yol)
        except (ValueError, IndexError) as e:
            print(f"\n## {f}\n  HATA  dosya okunamadı: {e}")
            toplam_hata += 1
            continue
        if ders is None or not isinstance(veri, dict) or "sorular" not in veri:
            continue  # ders içeriği olmayan dosya (harita, oyun verisi …)

        hatalar, uyarilar, konu_ist, n_madde, n_soru, sorusuz = denetle(ders, veri)
        n_uyari = sum(len(v) for v in uyarilar.values())
        toplam_hata += len(hatalar)
        toplam_uyari += n_uyari
        print(f"\n## {ders}: {n_madde} madde, {n_soru} soru · {len(hatalar)} HATA · {n_uyari} UYARI")

        if not ozet:
            for kimlik, mesaj in hatalar:
                print(f"  HATA   {kimlik}: {mesaj}")
            for tur, liste in sorted(uyarilar.items(), key=lambda x: -len(x[1])):
                print(f"  UYARI  {tur} ({len(liste)})")
                for kimlik, mesaj in (liste if hepsi else liste[:UYARI_LIMIT]):
                    print(f"           {kimlik}: {mesaj}")
                if not hepsi and len(liste) > UYARI_LIMIT:
                    print(f"           … ve {len(liste) - UYARI_LIMIT} tane daha (--hepsi)")
            if sorusuz:
                print(f"  BİLGİ  sorusu olmayan madde: {len(sorusuz)}")
        print(konu_tablosu(konu_ist))

    print(f"\nToplam: {toplam_hata} HATA, {toplam_uyari} UYARI")
    return 1 if toplam_hata else 0


if __name__ == "__main__":
    sys.exit(main())

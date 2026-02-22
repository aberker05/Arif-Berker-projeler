import { useState, useEffect, useRef } from 'react'
import './App.css'

function App() {
  const [gorevler, setGorevler] = useState(() => {
    const kayitli = localStorage.getItem("gorevlerim");
    return kayitli ? JSON.parse(kayitli) : [];
  });

  const [yeniBaslik, setYeniBaslik] = useState("");
  const [yeniAciklama, setYeniAciklama] = useState("");
  
  // YENİ: Tarih ve Saat artık ayrı ayrı tutuluyor (Başlangıç için)
  const [bTarih, setBTarih] = useState(""); 
  const [bSaat, setBSaat] = useState(""); 
  
  // YENİ: Tarih ve Saat ayrı ayrı (Bitiş için)
  const [bitTarih, setBitTarih] = useState(""); 
  const [bitSaat, setBitSaat] = useState(""); 
  
  const [yeniKategori, setYeniKategori] = useState("Kişisel");
  const [yeniOzelKategori, setYeniOzelKategori] = useState(""); 
  const [yeniOncelik, setYeniOncelik] = useState("Normal"); 
  
  const kategoriler = ["Kişisel", "Okul", "İş", "Alışveriş", "Diğer"];
  const oncelikler = ["Acil", "Normal", "Düşük"];

  const [filtre, setFiltre] = useState("Tümü");
  const [aramaMetni, setAramaMetni] = useState(""); 

  const [sesKaydediliyor, setSesKaydediliyor] = useState(false);
  const [yeniSesKaydi, setYeniSesKaydi] = useState(null); 
  const mediaRecorderRef = useRef(null);
  const sesParcalariRef = useRef([]);

  const [duzenlenenId, setDuzenlenenId] = useState(null);
  const [duzenlenenBaslik, setDuzenlenenBaslik] = useState("");
  const [duzenlenenAciklama, setDuzenlenenAciklama] = useState("");
  
  const [duzBTarih, setDuzBTarih] = useState("");
  const [duzBSaat, setDuzBSaat] = useState("");
  const [duzBitTarih, setDuzBitTarih] = useState("");
  const [duzBitSaat, setDuzBitSaat] = useState("");
  
  const [duzenlenenKategori, setDuzenlenenKategori] = useState("");
  const [duzenlenenOzelKategori, setDuzenlenenOzelKategori] = useState(""); 
  const [duzenlenenOncelik, setDuzenlenenOncelik] = useState("Normal"); 

  useEffect(() => {
    localStorage.setItem("gorevlerim", JSON.stringify(gorevler));
  }, [gorevler]);

  const kaydaBasla = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      sesParcalariRef.current = [];
      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) sesParcalariRef.current.push(e.data);
      };
      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(sesParcalariRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => setYeniSesKaydi(reader.result);
        stream.getTracks().forEach(track => track.stop());
      };
      mediaRecorderRef.current.start();
      setSesKaydediliyor(true);
    } catch (err) {
      alert("Mikrofona erişilemedi! Lütfen tarayıcı izinlerini kontrol edin.");
    }
  };

  const kaydiDurdur = () => {
    if (mediaRecorderRef.current && sesKaydediliyor) {
      mediaRecorderRef.current.stop();
      setSesKaydediliyor(false);
    }
  };

  const ekle = () => {
    if (yeniBaslik.trim() === "" && !yeniSesKaydi) return; 

    const eklenecekKategori = yeniKategori === "Diğer" && yeniOzelKategori.trim() !== "" 
      ? yeniOzelKategori.trim() : yeniKategori;

    const yeniVeri = {
      id: Date.now(), 
      baslik: yeniBaslik.trim() === "" ? "🎵 Sesli Not" : yeniBaslik, 
      aciklama: yeniAciklama, 
      baslangicTarihi: bTarih, 
      baslangicSaati: bSaat,
      bitisTarihi: bitTarih,
      bitisSaati: bitSaat,
      kategori: eklenecekKategori, 
      oncelik: yeniOncelik, 
      ses: yeniSesKaydi, 
      tamamlandi: false
    }
    setGorevler([...gorevler, yeniVeri]); 
    setYeniBaslik(""); setYeniAciklama(""); 
    setBTarih(""); setBSaat(""); setBitTarih(""); setBitSaat(""); 
    setYeniKategori("Kişisel"); setYeniOzelKategori(""); 
    setYeniOncelik("Normal"); setYeniSesKaydi(null); 
  };

  const sil = (silinecekId) => setGorevler(gorevler.filter(gorev => gorev.id !== silinecekId));

  const durumDegistir = (tiklananId) => {
    setGorevler(gorevler.map(gorev => gorev.id === tiklananId ? { ...gorev, tamamlandi: !gorev.tamamlandi } : gorev));
  };

  // Eski verileri yeni "ayrı" formata uyarlamak için yardımcı fonksiyonlar
  const getEskiTarih = (isoString) => isoString ? isoString.split('T')[0] : "";
  const getEskiSaat = (isoString) => isoString && isoString.includes('T') ? isoString.split('T')[1] : "";

  const duzenlemeyiBaslat = (gorev) => {
    setDuzenlenenId(gorev.id);
    setDuzenlenenBaslik(gorev.baslik || gorev.yazi || "");
    setDuzenlenenAciklama(gorev.aciklama || "");
    
    // YENİ: Hem yeni formatı hem de eski 'datetime-local' formatını yakalar
    setDuzBTarih(gorev.baslangicTarihi !== undefined ? gorev.baslangicTarihi : getEskiTarih(gorev.baslangic || gorev.zaman));
    setDuzBSaat(gorev.baslangicSaati !== undefined ? gorev.baslangicSaati : getEskiSaat(gorev.baslangic || gorev.zaman));
    setDuzBitTarih(gorev.bitisTarihi !== undefined ? gorev.bitisTarihi : getEskiTarih(gorev.bitis));
    setDuzBitSaat(gorev.bitisSaati !== undefined ? gorev.bitisSaati : getEskiSaat(gorev.bitis));
    
    setDuzenlenenOncelik(gorev.oncelik || "Normal");
    const standartMi = kategoriler.includes(gorev.kategori);
    setDuzenlenenKategori(standartMi ? gorev.kategori : "Diğer");
    setDuzenlenenOzelKategori(standartMi ? "" : gorev.kategori);
  };

  const duzenlemeyiKaydet = () => {
    if (duzenlenenBaslik.trim() === "") return; 
    const kaydedilecekKategori = duzenlenenKategori === "Diğer" && duzenlenenOzelKategori.trim() !== "" 
      ? duzenlenenOzelKategori.trim() : duzenlenenKategori;

    setGorevler(gorevler.map(gorev => 
      gorev.id === duzenlenenId 
        ? { 
            ...gorev, baslik: duzenlenenBaslik, aciklama: duzenlenenAciklama, 
            baslangicTarihi: duzBTarih, baslangicSaati: duzBSaat,
            bitisTarihi: duzBitTarih, bitisSaati: duzBitSaat,
            baslangic: null, bitis: null, zaman: null, // Eski verileri temizle
            kategori: kaydedilecekKategori, oncelik: duzenlenenOncelik 
          } 
        : gorev
    ));
    setDuzenlenenId(null); 
  };

  const duzenlemeyiIptalEt = () => setDuzenlenenId(null);

  // Ekranda Sadece Tarih, Sadece Saat veya İkisini birden göstermek için formatlayıcı
  const zamanMetniOlustur = (tarih, saat) => {
    if (!tarih && !saat) return null;
    let metin = "";
    if (tarih) {
      const d = new Date(tarih);
      metin += d.toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    }
    if (saat) {
      metin += (metin ? " " : "") + saat;
    }
    return metin;
  };

  const oncelikDegerleri = { "Acil": 3, "Normal": 2, "Düşük": 1 };

  // Sıralama Motoru (Tarih ve saati birleştirip Date objesine çevirerek karşılaştırır)
  const siralamaIcinTarihAl = (tarih, saat) => {
    if (!tarih && !saat) return null;
    let dTarih = tarih || new Date().toISOString().split('T')[0]; // Sadece saat varsa bugünü baz al
    let dSaat = saat || "00:00"; // Sadece tarih varsa gece yarısını baz al
    return new Date(`${dTarih}T${dSaat}`);
  };

  const siraliGorevler = [...gorevler].sort((a, b) => {
    const degerA = oncelikDegerleri[a.oncelik] || 2; 
    const degerB = oncelikDegerleri[b.oncelik] || 2;
    if (degerA !== degerB) return degerB - degerA; 

    const zamanA = siralamaIcinTarihAl(
      a.baslangicTarihi !== undefined ? a.baslangicTarihi : getEskiTarih(a.baslangic || a.zaman),
      a.baslangicSaati !== undefined ? a.baslangicSaati : getEskiSaat(a.baslangic || a.zaman)
    );
    const zamanB = siralamaIcinTarihAl(
      b.baslangicTarihi !== undefined ? b.baslangicTarihi : getEskiTarih(b.baslangic || b.zaman),
      b.baslangicSaati !== undefined ? b.baslangicSaati : getEskiSaat(b.baslangic || b.zaman)
    );

    if (!zamanA && !zamanB) return 0; 
    if (!zamanA) return 1; if (!zamanB) return -1;
    return zamanA - zamanB;
  });

  const ekrandaGosterilecekler = siraliGorevler.filter(gorev => {
    const aramaKucuk = aramaMetni.toLowerCase();
    const baslikEslesiyor = (gorev.baslik || gorev.yazi || "").toLowerCase().includes(aramaKucuk);
    const aciklamaEslesiyor = (gorev.aciklama || "").toLowerCase().includes(aramaKucuk);
    const kategoriEslesiyor = gorev.kategori && gorev.kategori.toLowerCase().includes(aramaKucuk);
    
    if (!baslikEslesiyor && !aciklamaEslesiyor && !kategoriEslesiyor) return false;
    if (filtre === "Tamamlananlar") return gorev.tamamlandi;
    if (filtre === "Devam Edenler") return !gorev.tamamlandi;
    return true; 
  });

  return (
    <div className="kutu">
      <h1>Yapılacaklar Listesi</h1>
      
      <div className="arama-alani">
        <span className="arama-ikon">🔍</span>
        <input type="text" placeholder="Görevlerde ara..." value={aramaMetni} onChange={(e) => setAramaMetni(e.target.value)} className="arama-input" />
      </div>
      
      <div className="giris-alani dikey-form">
        <div className="metin-girdileri">
          <input type="text" placeholder="Görev Başlığı (Zorunlu)" value={yeniBaslik} onChange={(e) => setYeniBaslik(e.target.value)} className="metin-input ana-baslik-input" />
          <textarea placeholder="Detaylar / Açıklama (İsteğe Bağlı)..." value={yeniAciklama} onChange={(e) => setYeniAciklama(e.target.value)} className="metin-input aciklama-input" rows="2" />
        </div>

        <div className="alt-kontroller">
          {sesKaydediliyor ? (
            <button onClick={kaydiDurdur} className="ses-btn kaydi-durdur">🔴 Durdur</button>
          ) : (
            <button onClick={kaydaBasla} className="ses-btn kayda-basla" title="Sesli Not">🎤 Ses</button>
          )}

          <select value={yeniKategori} onChange={(e) => setYeniKategori(e.target.value)} className="kategori-secici">
            {kategoriler.map((kat, idx) => <option key={idx} value={kat}>{kat}</option>)}
          </select>
          {yeniKategori === "Diğer" && (
            <input type="text" placeholder="İsim verin..." value={yeniOzelKategori} onChange={(e) => setYeniOzelKategori(e.target.value)} className="ozel-kategori-input" autoFocus />
          )}

          <select value={yeniOncelik} onChange={(e) => setYeniOncelik(e.target.value)} className="oncelik-secici">
            {oncelikler.map((onc, idx) => <option key={idx} value={onc}>{onc === "Acil" ? "🔴 Acil" : onc === "Normal" ? "🟡 Normal" : "🟢 Düşük"}</option>)}
          </select>

          {/* YENİ: Tarih ve Saat Ayrı Ayrı (Esnek Yapı) */}
          <div className="tarih-grubu">
            <div className="zaman-kapsayici">
              <span className="tarih-etiket">Başlangıç:</span>
              <input type="date" value={bTarih} onChange={(e) => setBTarih(e.target.value)} className="tarih-input mini-tarih" title="Sadece tarih seçebilirsiniz" />
              <input type="time" value={bSaat} onChange={(e) => setBSaat(e.target.value)} className="tarih-input mini-tarih" title="Sadece saat seçebilirsiniz" />
              {(bTarih || bSaat) && <button onClick={() => {setBTarih(""); setBSaat("");}} className="temizle-btn" title="Başlangıç zamanını temizle">✖</button>}
            </div>
            <div className="zaman-kapsayici">
              <span className="tarih-etiket">Bitiş:</span>
              <input type="date" value={bitTarih} onChange={(e) => setBitTarih(e.target.value)} className="tarih-input mini-tarih" />
              <input type="time" value={bitSaat} onChange={(e) => setBitSaat(e.target.value)} className="tarih-input mini-tarih" />
              {(bitTarih || bitSaat) && <button onClick={() => {setBitTarih(""); setBitSaat("");}} className="temizle-btn" title="Bitiş zamanını temizle">✖</button>}
            </div>
          </div>

          <button onClick={ekle} className="ekle-btn">Ekle</button>
        </div>
      </div>

      {yeniSesKaydi && (
        <div className="ses-onizleme">
          <span style={{fontSize: '12px', color: '#aaa'}}>Kaydedilen Ses:</span>
          <audio src={yeniSesKaydi} controls className="mini-audio" />
          <button onClick={() => setYeniSesKaydi(null)} className="ses-sil-btn">🗑️</button>
        </div>
      )}

      <div className="filtre-alani">
        <button className={filtre === "Tümü" ? "aktif-filtre" : ""} onClick={() => setFiltre("Tümü")}>Tümü</button>
        <button className={filtre === "Devam Edenler" ? "aktif-filtre" : ""} onClick={() => setFiltre("Devam Edenler")}>Devam Edenler</button>
        <button className={filtre === "Tamamlananlar" ? "aktif-filtre" : ""} onClick={() => setFiltre("Tamamlananlar")}>Tamamlananlar</button>
      </div>

      <ul>
        {ekrandaGosterilecekler.map((gorev) => {
          const kategoriSinifi = kategoriler.includes(gorev.kategori) ? `kat-${gorev.kategori.toLowerCase()}` : "kat-ozel";
          const gosterilecekBaslik = gorev.baslik || gorev.yazi;
          
          // Ekranda gösterim için tarih ve saatleri birleştiriyoruz
          const gosterilecekBaslangic = zamanMetniOlustur(
            gorev.baslangicTarihi !== undefined ? gorev.baslangicTarihi : getEskiTarih(gorev.baslangic || gorev.zaman),
            gorev.baslangicSaati !== undefined ? gorev.baslangicSaati : getEskiSaat(gorev.baslangic || gorev.zaman)
          );
          const gosterilecekBitis = zamanMetniOlustur(
            gorev.bitisTarihi !== undefined ? gorev.bitisTarihi : getEskiTarih(gorev.bitis),
            gorev.bitisSaati !== undefined ? gorev.bitisSaati : getEskiSaat(gorev.bitis)
          );

          return (
            <li key={gorev.id} className={gorev.tamamlandi ? "cizili" : ""}>
              
              {duzenlenenId === gorev.id ? (
                 <div className="duzenleme-formu dikey-form">
                   <div className="metin-girdileri">
                     <input type="text" value={duzenlenenBaslik} onChange={(e) => setDuzenlenenBaslik(e.target.value)} className="metin-input ana-baslik-input" placeholder="Başlık" />
                     <textarea value={duzenlenenAciklama} onChange={(e) => setDuzenlenenAciklama(e.target.value)} className="metin-input aciklama-input" placeholder="Açıklama" rows="2" />
                   </div>
                   
                   <div className="alt-kontroller">
                     <select value={duzenlenenKategori} onChange={(e) => setDuzenlenenKategori(e.target.value)} className="kategori-secici">
                       {kategoriler.map((kat, idx) => <option key={idx} value={kat}>{kat}</option>)}
                     </select>
                     {duzenlenenKategori === "Diğer" && (
                       <input type="text" placeholder="İsim verin..." value={duzenlenenOzelKategori} onChange={(e) => setDuzenlenenOzelKategori(e.target.value)} className="ozel-kategori-input"/>
                     )}
                     <select value={duzenlenenOncelik} onChange={(e) => setDuzenlenenOncelik(e.target.value)} className="oncelik-secici">
                      {oncelikler.map((onc, idx) => <option key={idx} value={onc}>{onc === "Acil" ? "🔴 Acil" : onc === "Normal" ? "🟡 Normal" : "🟢 Düşük"}</option>)}
                     </select>
                     
                     {/* Düzenleme Formunda da Tarih ve Saat Ayrı */}
                     <div className="tarih-grubu">
                        <div className="zaman-kapsayici">
                          <span className="tarih-etiket">Başlangıç:</span>
                          <input type="date" value={duzBTarih} onChange={(e) => setDuzBTarih(e.target.value)} className="tarih-input mini-tarih" />
                          <input type="time" value={duzBSaat} onChange={(e) => setDuzBSaat(e.target.value)} className="tarih-input mini-tarih" />
                          {(duzBTarih || duzBSaat) && <button onClick={() => {setDuzBTarih(""); setDuzBSaat("");}} className="temizle-btn">✖</button>}
                        </div>
                        <div className="zaman-kapsayici">
                          <span className="tarih-etiket">Bitiş:</span>
                          <input type="date" value={duzBitTarih} onChange={(e) => setDuzBitTarih(e.target.value)} className="tarih-input mini-tarih" />
                          <input type="time" value={duzBitSaat} onChange={(e) => setDuzBitSaat(e.target.value)} className="tarih-input mini-tarih" />
                          {(duzBitTarih || duzBitSaat) && <button onClick={() => {setDuzBitTarih(""); setDuzBitSaat("");}} className="temizle-btn">✖</button>}
                        </div>
                     </div>

                     <button onClick={duzenlemeyiKaydet} className="kaydet-btn">✔️</button>
                     <button onClick={duzenlemeyiIptalEt} className="iptal-btn">❌</button>
                   </div>
                 </div>
              ) : (
                <>
                  <button onClick={() => durumDegistir(gorev.id)} className="tamamla-btn">{gorev.tamamlandi ? "✅" : "⬜"}</button>
                  <div className="gorev-icerik">
                    <div className="etiket-grubu">
                      {gorev.oncelik && <span className={`oncelik-etiket onc-${(gorev.oncelik || "normal").toLowerCase()}`}>{gorev.oncelik === "Acil" ? "🔴 Acil" : gorev.oncelik === "Normal" ? "🟡 Normal" : "🟢 Düşük"}</span>}
                      {gorev.kategori && <span className={`kategori-etiket ${kategoriSinifi}`}>{gorev.kategori}</span>}
                    </div>
                    {gosterilecekBaslik && <span className="gorev-baslik">{gosterilecekBaslik}</span>}
                    {gorev.aciklama && <span className="gorev-aciklama">{gorev.aciklama}</span>}
                    {gorev.ses && <div className="liste-ses-kapsayici"><audio src={gorev.ses} controls className="liste-audio" /></div>}

                    {/* Tarih ve Saat Gösterimi (Eğer sadece saat girildiyse bile formatlanıp gösterilir) */}
                    {(gosterilecekBaslangic || gosterilecekBitis) && (
                      <span className="gorev-tarihi">
                        🕒 {gosterilecekBaslangic ? gosterilecekBaslangic : "Belirsiz"} 
                        {gosterilecekBitis && ` ➔ ${gosterilecekBitis}`}
                      </span>
                    )}
                  </div>
                  <div className="buton-grubu">
                    <button onClick={() => duzenlemeyiBaslat(gorev)} className="duzenle-btn">✏️</button>
                    <button onClick={() => sil(gorev.id)} className="sil-btn">🗑️</button>
                  </div>
                </>
              )}
            </li>
          );
        })}
      </ul>
      {ekrandaGosterilecekler.length === 0 && <p style={{color: '#888', marginTop: '20px'}}>Görev bulunamadı.</p>}
    </div>
  )
}

export default App
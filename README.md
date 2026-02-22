# 📝 Gelişmiş Görev Yönetim Uygulaması (To-Do App)

React ve Vite kullanılarak geliştirilmiş, yerel depolama (LocalStorage) destekli, sesli not eklenebilen ve detaylı filtreleme özelliklerine sahip modern bir görev yöneticisi.

## 🚀 Özellikler

* **Kapsamlı Görev Ekleme:** Görevlere ayrı başlık ve detaylı açıklama ekleyebilme.
* **🎤 Sesli Notlar:** Tarayıcı mikrofonunu kullanarak görevlere sesli mesajlar ekleme ve liste üzerinden oynatma.
* **📅 Esnek Tarih Yönetimi:** Görevlere başlangıç ve bitiş tarihi/saati atayabilme. İsteğe bağlı olarak sadece saat veya sadece tarih seçilebilen esnek yapı.
* **🏷️ Kategorilendirme:** Hazır kategoriler (Okul, İş, Kişisel vb.) kullanma veya kendi özel kategorilerinizi oluşturabilme.
* **⚡ Öncelik Durumu:** Görevleri "Acil", "Normal" veya "Düşük" olarak etiketleme. Akıllı sıralama motoru sayesinde Acil görevlerin tarihlerine göre en üste yerleşmesi.
* **🔍 Akıllı Arama ve Filtreleme:** Anlık arama çubuğu ile görevleri başlık, açıklama veya kategoriye göre hızla bulma. Tamamlanan ve Devam eden görevler arasında geçiş yapma.
* **💾 Veri Kalıcılığı:** Tüm görevler ve Base64 formatına çevrilen ses kayıtları tarayıcının `localStorage` hafızasında tutulur; sayfa yenilense bile veriler kaybolmaz.
* **✏️ Düzenleme:** Eklenen görevlerin tüm detaylarını (tarih, kategori, başlık vb.) sonradan güncelleyebilme.

## 🛠️ Kullanılan Teknolojiler

* **Frontend:** React.js, Vite
* **Tasarım:** Saf CSS (Modern ve esnek arayüz)
* **Veri Depolama:** Tarayıcı LocalStorage API
* **Medya:** Web MediaRecorder API

## 💻 Kurulum ve Çalıştırma

Projeyi kendi bilgisayarınızda çalıştırmak için şu adımları izleyin:

1. Repoyu bilgisayarınıza klonlayın:
   ```bash
   git clone [https://github.com/aberker05/Arif-Berker-projeler.git](https://github.com/aberker05/Arif-Berker-projeler.git)
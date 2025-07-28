# **DekoAsistan.AI \- 2 Haftalık Geliştirme Planı**

* **Başlangıç:** 23 Temmuz 2025, 19:00  
* **Bitiş:** 6 Ağustos 2025, 19:00  
* **Ekip:** 2 Geliştirici \+ AI Asistanlar (GitHub Copilot, Gemini vb.)

### **Hafta 1: Temel Atma ve Çekirdek Fonksiyonların Geliştirilmesi (23 Temmuz \- 30 Temmuz)**

Bu haftanın ana hedefi, projenin iskeletini kurmak, backend ve frontend'in temel yapılarını oluşturmak ve AI servislerinin çekirdek mantığını entegre etmektir.

#### **🚀 Gün 1-2: Kurulum ve Altyapı (23-24 Temmuz)**

* **Görevler:**  
  * \[ \] GitHub repository oluşturma, main ve develop branch'lerini açma.  
  * \[ \] **Backend (Geliştirici 1):** FastAPI projesini başlatma, temel dosya yapısını (main.py, routers/, services/, models/) oluşturma.  
  * \[ \] **Backend (Geliştirici 1):** PostgreSQL veritabanı kurulumu ve SQLAlchemy ORM konfigürasyonu.  
  * \[ \] **Backend (Geliştirici 1):** Kullanıcı modeli ve JWT kimlik doğrulama sistemi altyapısı.  
  * \[ \] **Frontend (Geliştirici 2):** React (Vite) projesini başlatma, React Router ve Tailwind CSS entegrasyonu.  
  * \[ \] **Frontend (Geliştirici 2):** Temel sayfa yapısı (Ana sayfa, Giriş, Kayıt, Favoriler, Blog).  
  * \[ \] **Backend (Geliştirici 1):** .env dosyası ile API anahtarlarını güvenli bir şekilde yönetme altyapısını kurma.  
  * \[ \] **Ortak Görev:** products.json dosyasını oluşturma (15-20 örnek ürünle başlangıç).

#### **🧠 Gün 3-4: Kimlik Doğrulama ve Temel UI (25-26 Temmuz)**

* **Görevler (Backend \- Geliştirici 1):**  
  * \[ \] Kullanıcı kayıt ve giriş endpoint'lerini oluşturma (/auth/register, /auth/login).  
  * \[ \] JWT token oluşturma ve doğrulama middleware'i.  
  * \[ \] Favori sistemi için veritabanı modellerini oluşturma.  
  * \[ \] /api/tasarim endpoint'ini oluşturma.  
  * \[ \] multipart/form-data ile metin ve resim dosyasını alacak Pydantic modellerini tanımlama.  
* **Görevler (Frontend \- Geliştirici 2):**  
  * \[ \] Giriş ve kayıt sayfalarının UI'ını oluşturma.  
  * \[ \] JWT token yönetimi için context/state yapısı kurma.  
  * \[ \] Ana sayfa tasarım formunun temel yapısını oluşturma.  
  * \[ \] Pencere/kapı konumu seçimi için interaktif harita komponenti.

#### **🔗 Gün 5-7: AI Servisleri ve Function Calling (27-29 Temmuz)**

* **Görevler (Backend \- Geliştirici 1):**  
  * \[ \] Gemini API'ye metin ve görsel prompt gönderecek temel servis fonksiyonunu yazma.  
  * \[ \] Imagen API'ye prompt gönderip görsel üretecek temel servis fonksiyonunu yazma.  
  * \[ \] **Function Calling:** urun\_bul fonksiyonunu tanımlama (products.json içinde arama yapacak).  
  * \[ \] Ürün bazlı güncelleme için AI'ya istek atma endpoint'i (/api/update-product).  
  * \[ \] Gemini API isteğine fonksiyon tanımını ekleme ve konuşma geçmişini yönetme.  
  * \[ \] Favori ekleme/çıkarma endpoint'lerini oluşturma (/api/favorites).  
* **Görevler (Frontend \- Geliştirici 2):**  
  * \[ \] Tasarım sonuç sayfasının UI'ını oluşturma (mood board, ürün listesi).  
  * \[ \] Favori ekleme butonları ve favori sayfası UI'ı.  
  * \[ \] Ürün bazlı güncelleme için "Başka bir şey öner" butonları.  
  * \[ \] Blog sayfası ve tasarım paylaşım UI'ı.

#### **✅ Hafta 1 Sonu Değerlendirmesi (30 Temmuz Akşamı)**

* **Hedef:** Backend kimlik doğrulama sistemi, temel UI sayfaları ve AI servislerinin çekirdek mantığı tamamlanmış olmalı. Kullanıcı girişi yapabilmeli, tasarım formu doldurabilmeli ve favori sistemi altyapısı hazır olmalı.

### **Hafta 2: Entegrasyon, İyileştirme ve Teslimat (31 Temmuz \- 6 Ağustos)**

Bu haftanın ana hedefi, projeyi uçtan uca çalışır hale getirmek, kullanıcı deneyimini iyileştirmek, canlıya almak ve sunuma hazırlanmaktır.

#### **🤝 Gün 8-9: Uçtan Uca Entegrasyon ve Veritabanı (31 Temmuz \- 1 Ağustos)**

* **Görevler (Ortak Çalışma):**  
  * \[ \] Frontend ve Backend'i tam olarak birbirine bağlama.  
  * \[ \] Kullanıcı girişi ve JWT token doğrulamasını test etme.  
  * \[ \] Tasarım oluşturma, favori ekleme/çıkarma akışını uçtan uca test etme.  
  * \[ \] Blog paylaşım sistemi entegrasyonu.  
  * \[ \] Ürün güncelleme işlevselliğini test etme.  
  * \[ \] Veritabanı bağlantısı ve veri kalıcılığını test etme.  
  * \[ \] İlk uçtan uca MVP testini gerçekleştirme ve çıkan hataları (bug) çözme.

#### **✨ Gün 10-11: İyileştirme ve Kullanıcı Deneyimi (2-3 Ağustos)**

* **Görevler:**  
  * \[ \] **UI/UX (Geliştirici 2):** Tüm sayfalar arası geçişleri iyileştirme (animasyonlar, loading states).  
  * \[ \] **UI/UX (Geliştirici 2):** Favori sayfası ve blog sayfası kullanıcı deneyimini optimize etme.  
  * \[ \] **UI/UX (Geliştirici 2):** Mobil uyumluluk kontrolü ve düzenlemeler.  
  * \[ \] **Prompt Engineering (Geliştirici 1):** Gemini ve Imagen'den daha tutarlı ve kaliteli sonuçlar almak için prompt'ları iyileştirme.  
  * \[ \] **Backend (Geliştirici 1):** Veritabanı sorgu optimizasyonları ve performans iyileştirmeleri.  
  * \[ \] **Hata Yönetimi (Ortak):** Tüm API endpoint'leri için hata durumları ve kullanıcı dostu mesajlar.  
  * \[ \] **F2.1:** "Yeniden Dene" butonunu ekleme.  
  * \[ \] **F2.2:** "Panoya Kopyala" butonunu ekleme.

#### **🚀 Gün 12-13: Deployment ve Veritabanı Canlıya Alma (4-5 Ağustos)**

* **Görevler:**  
  * \[ \] **Backend Deployment (Geliştirici 1):** PostgreSQL veritabanını cloud'a kurma (DigitalOcean Managed Database).  
  * \[ \] **Backend Deployment (Geliştirici 1):** Backend uygulamasını DigitalOcean VDS'e deploy etme (Nginx \+ Gunicorn konfigürasyonu).  
  * \[ \] **Frontend Deployment (Geliştirici 2):** Frontend'i Vercel'e deploy etme ve backend API adresini doğru şekilde ayarlama.  
  * \[ \] **Database Migration (Geliştirici 1):** Production veritabanında tüm tabloları oluşturma ve test verilerini ekleme.  
  * \[ \] **Test (Ortak):** Canlı ortamda kapsamlı testler yapma (kullanıcı kayıt/giriş, tasarım oluşturma, favori ekleme, blog paylaşım).  
  * \[ \] **Test (Ortak):** Farklı tarayıcılar ve mobil cihazlarda test. CORS hatalarını çözme.

#### **🏆 Gün 14: Sunum Hazırlığı ve TESLİM\! (6 Ağustos, 19:00'a kadar)**

* **Görevler (Ortak):**  
  * \[ \] GitHub repository'sini temizleme, README.md dosyasını PRD ve plan doğrultusunda güncelleme.  
  * \[ \] 7 dakikalık jüri sunumunu planlama (kim ne anlatacak, demo akışı nasıl olacak).  
  * \[ \] Proje teslim formunu doldurmak için gerekli materyalleri (GitHub linki, canlı link, 1 dakikalık video) hazırlama.  
  * \[ \] Son bir kez canlı sistemi kontrol etme.  
  * \[ \] **PROJEYİ TESLİM ETME\!** 🎉
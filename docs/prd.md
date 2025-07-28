# **Ürün Gereksinimleri Dokümanı (PRD): DekoAsistan.AI**

* **Ürün Adı:** DekoAsistan.AI  
* **Versiyon:** 1.0 (Hackathon MVP)  
* **Tarih:** 24 Temmuz 2025  
* **Yazarlar:** Geliştirici 1, Geliştirici 2  
* **Paydaşlar:** BTK Akademi, Google, Girvak (Hackathon 2025 Komitesi)

### **1\. Genel Bakış**

DekoAsistan.AI, Hackathon 2025'in "E-ticaret" teması için geliştirilen, Google Gemini destekli bir web uygulamasıdır. Kullanıcıların, belirli parametreler, kişisel notlar ve isteğe bağlı olarak oda fotoğrafları sunarak, yapay zekadan kişiselleştirilmiş iç mekan tasarım önerileri almalarını sağlar. Uygulama, bu önerileri bir "ilham panosu" (mood board) ile görselleştirir ve Function Calling teknolojisini kullanarak tasarıma uygun, satın alınabilir bir ürünü statik bir e-ticaret veri setinden bularak kullanıcıya sunar.

### **2\. Çözülen Problem**

İnsanlar evlerini veya odalarını dekore etmek istediklerinde, ilham kaynaklarının dağınıklığı, kişisel zevklerine ve odalarının fiziksel özelliklerine uygun konseptler bulmanın zorluğu ve buldukları ilhamı satın alınabilir gerçek ürünlere dönüştürmenin karmaşıklığı gibi sorunlarla karşılaşırlar. DekoAsistan.AI, bu süreci tek bir platformda birleştirerek basitleştirir ve hızlandırır.

### **3\. Hedef Kitle**

Türkiye'de yaşayan, teknolojiye yatkın, evini/odasını yenilemek isteyen ancak nereden başlayacağını bilemeyen veya yaratıcı fikirlere ihtiyaç duyan 18 yaş üstü tüm bireyler.

### **4\. Proje Hedefleri ve Başarı Kriterleri**

* **Kullanıcı Hedefi:** Kullanıcının 2 dakikadan kısa bir sürede, kendi odası için özel olarak oluşturulmuş, görsel bir ilham panosu ve en az bir adet somut ürün önerisi içeren, uygulanabilir bir tasarım konsepti almasını sağlamak.  
* **Hackathon Hedefi:**  
  * Yarışma son tarihi olan **31 Temmuz 2025**'e kadar tüm "Olması Gereken" (Must-Have) özellikleri içeren, çalışan bir MVP (Minimum Uygulanabilir Ürün) sunmak.  
  * Gemini API'nin multimodal (metin+görsel) ve Function Calling gibi gelişmiş yeteneklerini yaratıcı bir şekilde sergileyerek ilk 10'a kalmak.  
  * 7 dakikalık jüri sunumunda etki yaratacak, akıcı ve yenilikçi bir ürün demosu ile ilk 3'e girmeyi hedeflemek.

### **5\. Özellikler ve Kapsam (Features & Scope)**

#### **V1.0 \- MVP (Olması Gerekenler / Must-Have)**

* **F1.1: Kullanıcı Arayüzü:** Çok sayfalı, temiz ve modern bir web arayüzü (Ana sayfa, Giriş, Favoriler, Blog).  
* **F1.2: Kullanıcı Girişi ve Yetkilendirme:** Basit email/şifre tabanlı kullanıcı girişi ve kayıt sistemi.  
* **F1.3: Yapısal Veri Girişi:** Odaklanmış bir form ile şu bilgilerin alınması: Oda Tipi, Tasarım Stili.  
* **F1.4: Mekan Detayları:** Kullanıcının odanın pencere ve kapı konumlarını belirtebileceği interaktif alan seçimi.  
* **F1.5: Serbest Metin Girişi:** Kullanıcının özel istekleri için bir "Notlarınız" metin alanı.  
* **F1.6: Görsel Yükleme:** Kullanıcının odasının fotoğrafını yükleyebileceği, isteğe bağlı bir alan.  
* **F1.7: Backend API Endpoint'leri:** Frontend'den gelen tüm verileri (multipart/form-data olarak) kabul eden ve Gemini API'sine gönderen tasarım endpoint'leri.  
* **F1.8: Tasarım Metni Gösterimi:** Gemini'dan dönen detaylı tasarım önerisi metninin ekranda gösterilmesi.  
* **F1.9: Mood Board Gösterimi:** Tasarım metnine uygun olarak Imagen API ile üretilen ilham panosu görselinin ekranda gösterilmesi.  
* **F1.10: Ürün Önerileri (Function Calling):** Gemini'ın Function Calling ile statik products.json dosyası içinden tasarıma uygun **birden fazla ürünü** bulup linklerini göstermesi.  
* **F1.11: Ürün Bazlı Güncelleme:** Kullanıcının belirli ürünler için AI'ya yeniden tasarım isteklerinde bulunabilmesi.  
* **F1.12: Favori Sistemi:** Kullanıcının tekil ürünleri veya tüm tasarım setini (input+output) favorilerine ekleyebilmesi.  
* **F1.13: Blog Paylaşım Sistemi:** Kullanıcının beğendiği tasarımları blog formatında paylaşabilmesi.  
* **F1.14: Yükleme Durumu (Loading State):** "Tasarla" butonuna basıldıktan sonra sonuçlar gelene kadar "DekoAsistan'ınız odanızı hayal ediyor..." gibi bir animasyon veya metin gösterilmesi.

#### **Olsa İyi Olur (Should-Have)**

* **F2.1:** Kullanıcının aynı bilgilerle farklı bir öneri istemesi için "Yeniden Dene" butonu.  
* **F2.2:** Üretilen tasarım metni için "Panoya Kopyala" butonu.  
* **F2.3:** Tasarım geçmişini görüntüleme özelliği.  
* **F2.4:** Sosyal medya entegrasyonu ile tasarım paylaşımı.

#### **Kapsam Dışı (Won't-Have)**

* Gerçek zamanlı web kazıma (scraping).  
* Çoklu dil desteği.  
* Üçüncü parti e-ticaret entegrasyonu.  
* Mobil uygulama geliştirme.

### **6\. Kullanıcı Akışı (User Flow)**

1. Kullanıcı web sitesine giriş yapar.  
2. Kullanıcı hesabı yoksa kayıt olur, varsa giriş yapar.  
3. Ana sayfada tasarım formunu görür ve alanları doldurur:  
   * Oda Tipi: Salon, Stil: Modern  
   * Pencere ve kapı konumlarını interaktif harita üzerinde işaretler  
4. Notlar kutusuna "Geniş bir kitaplık ve rahat bir okuma koltuğu istiyorum" yazar.  
5. (İsteğe bağlı) Salonunun boş bir köşesinin fotoğrafını yükler.  
6. "Hayal Et\!" butonuna tıklar.  
7. Ekranda yükleme animasyonu belirir.  
8. Yaklaşık 10-15 saniye sonra sayfa güncellenir ve sonuçlar gösterilir:  
   * Başlık: "Modern ve Aydınlık Okuma Köşeniz"  
   * Detaylı açıklama metni.  
   * Üretilmiş Mood Board görseli.  
   * Önerilen Ürünler listesi (3-5 adet).  
9. Kullanıcı beğendiği ürünleri favoriye ekler veya tüm tasarımı favoriye alır.  
10. İsterse belirli ürünler için "Bu ürün yerine başka bir şey öner" diyerek AI'dan güncelleme talep eder.  
11. Tasarımından memnunsa blog sayfasında paylaşır.

### **7\. Teknik Yığın (Tech Stack)**

* **Backend:** Python 3.11+, FastAPI, SQLAlchemy (ORM), PostgreSQL (Veritabanı)  
* **Frontend:** React (Vite), Tailwind CSS, React Router (Sayfa yönlendirme)  
* **AI API'leri:** Google Gemini API (Metin, Analiz, Function Calling), Google Imagen API (Görsel Üretme)  
* **Veri:** products.json (Statik ürün veri seti), PostgreSQL (Kullanıcı verileri, favoriler, blog yazıları)  
* **Kimlik Doğrulama:** JWT (JSON Web Tokens)  
* **Deployment:** Vercel (Frontend), DigitalOcean VDS \+ Nginx \+ Gunicorn (Backend)  
* **Geliştirme Araçları:** Git, GitHub, VS Code, GitHub Copilot, Gemini

### **8\. Riskler ve Varsayımlar**

* **Risk:** AI destekli frontend geliştirme sürecinin, component'leri entegre ederken beklenenden uzun sürmesi.  
  * *Önlem:* Basit ve atomik bileşenler istemek, ilk önce statik bir arayüzü çalışır hale getirmek.  
* **Risk:** Kendi sunucumuzda yapacağımız backend deployment'ında yaşanabilecek konfigürasyon sorunları.  
  * *Önlem:* Geliştirme sürecinin son 2 gününü tamamen deployment ve test süreçlerine ayırmak.  
* **Varsayım:** Yarışma süresince Google Cloud API'lerinin stabil ve erişilebilir olacağı varsayılmaktadır.  
* **Varsayım:** İki geliştiricinin AI asistanların desteğiyle yukarıdaki MVP kapsamını 2 hafta içinde tamamlayabileceği varsayılmaktadır.
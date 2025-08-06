# 🏡 Deko Asistan AI

> **Google Gemini destekli, kişiselleştirilmiş iç mekan tasarım asistanı**

Deko Asistan, yapay zeka gücüyle odalarınız için özel tasarım önerileri sunan, BTK Akademi Hackathon 2025 için geliştirilmiş yenilikçi bir web uygulamasıdır. Google Gemini'nin multimodal yetenekleri ve Function Calling teknolojisini kullanarak, kullanıcıların hayallerindeki mekanları tasarlamasına yardımcı olur.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Python](https://img.shields.io/badge/Python-3.11+-blue.svg)](https://python.org)
[![React](https://img.shields.io/badge/React-18+-61DAFB.svg)](https://reactjs.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.116+-009688.svg)](https://fastapi.tiangolo.com)

## 🌟 Özellikler

### 🎯 **Akıllı Tasarım Motoru**
- **Google Gemini AI** ile güçlendirilmiş tasarım önerileri
- **Metin tabanlı girdi**: Detaylı açıklamalar, renk paleti ve özel notlar
- **Kişiselleştirilmiş öneriler**: Oda tipi, tasarım stili ve ürün kategorileri
- **Gerçek zamanlı oda görselleştirmesi**: Google Imagen ile hibrit oda görselü üretimi

### 🛍️ **Akıllı Ürün Önerileri**
- **Function Calling** teknolojisiyle entegre ürün arama
- **Hibrit görselleştirme sistemi**: Gerçek e-ticaret ürün görselleri + AI ile oda kompozisyonu
- **Kategori bazlı filtreleme**: Mobilya, aydınlatma, aksesuar ve daha fazlası
- **Fiyat optimizasyonu**: Bütçe dostu alternatifler

### 👤 **Kullanıcı Deneyimi**
- **Sezgisel arayüz**: Kolay form tabanlı tasarım oluşturma
- **Favori sistemi**: Beğenilen tasarımları kaydetme
- **Blog paylaşımı**: Tasarımları toplulukla paylaşma
- **Tasarım arşivi**: Favori tasarımlar üzerinden geçmiş çalışmaları görüntüleme (gelecekte tam geçmiş özelliği eklenecek)

### 🔄 **Real-time İletişim**
- **WebSocket bağlantısı**: Canlı tasarım süreci takibi
- **Progresif yükleme**: Adım adım sonuç görüntüleme
- **Dinamik güncellemeler**: Ürün bazlı yeniden öneriler

## 🏗️ Teknik Mimari

### Backend (Python/FastAPI)
```
backend/
├── main.py                 # FastAPI ana uygulama
├── routers/               # API endpoint'leri
│   ├── design_router.py   # Tasarım operasyonları
│   ├── auth_router.py     # Kimlik doğrulama
│   ├── favorites_router.py # Favori yönetimi
│   └── blog_router.py     # Blog sistemi
├── services/              # İş mantığı katmanı
│   ├── ai/               # AI servisleri
│   │   ├── gemini_service.py
│   │   ├── gemini_client.py
│   │   └── product_service.py
│   ├── auth/             # Kimlik doğrulama
│   ├── design/           # Tasarım yönetimi
│   └── communication/    # WebSocket yönetimi
├── models/               # Veri modelleri
└── config/               # Konfigürasyon
```

### Frontend (React/Vite)
```
frontend/
├── src/
│   ├── pages/            # Sayfa bileşenleri
│   │   ├── HomePage.js
│   │   ├── RoomDesignStudio.js
│   │   └── DesignDetailPage.js
│   ├── components/       # UI bileşenleri
│   │   ├── studio/       # Tasarım stüdyosu
│   │   ├── design/       # Tasarım gösterimi
│   │   └── sections/     # Sayfa bölümleri
│   ├── services/         # API iletişimi
│   ├── hooks/           # React Hook'ları
│   └── contexts/        # State yönetimi
```

## 🛠️ Teknoloji Yığını

### **Backend**
- **Framework**: FastAPI 0.116+
- **Dil**: Python 3.11+
- **Veritabanı**: PostgreSQL + SQLAlchemy ORM
- **AI**: Google Gemini API + Imagen API
- **Kimlik Doğrulama**: JWT
- **Real-time**: WebSocket

### **Frontend**
- **Framework**: React 18+ (Vite)
- **Stil**: Tailwind CSS
- **Routing**: React Router v7
- **State Management**: Zustand
- **HTTP Client**: Axios

### **AI & Cloud**
- **Google Gemini**: Metin tabanlı AI model (tasarım önerileri ve ürün seçimi)
- **Google Imagen**: Multimodal görsel üretimi (metin + seçilen ürün görselleri)
- **Function Calling**: Dinamik ürün arama
- **Google Cloud Platform**: Hosting

## 🚀 Kurulum

### Ön Koşullar
- Python 3.11+
- Node.js 18+
- PostgreSQL 14+
- Google Cloud Platform hesabı

### 1. Repository'yi klonlayın
```bash
git clone https://github.com/cihanayindi/DekoAsistanAI.git
cd DekoAsistanAI
```

### 2. Backend Kurulumu
```bash
cd backend

# Sanal ortam oluşturun
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Bağımlılıkları yükleyin
pip install -r requirements.txt

# Ortam değişkenlerini ayarlayın
cp .env.example .env
# .env dosyasını düzenleyerek API anahtarlarınızı ekleyin

# Veritabanı migration'larını çalıştırın
alembic upgrade head

# Sunucuyu başlatın
python main.py
```

### 3. Frontend Kurulumu
```bash
cd frontend

# Bağımlılıkları yükleyin
npm install

# Geliştirme sunucusunu başlatın
npm start
```

### 4. Ortam Değişkenleri

#### Backend (.env)
```env
# Database
DATABASE_URL=postgresql://user:password@localhost/dekoasistan

# Google Cloud
GOOGLE_CLOUD_PROJECT=your-project-id
GOOGLE_APPLICATION_CREDENTIALS=path/to/service-account.json

# Gemini API
GEMINI_API_KEY=your-gemini-api-key

# JWT
JWT_SECRET_KEY=your-secret-key
JWT_ALGORITHM=HS256
JWT_ACCESS_TOKEN_EXPIRE_MINUTES=30

# CORS
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:8000
```

#### Frontend
```env
REACT_APP_API_URL=http://localhost:8000
REACT_APP_WS_URL=ws://localhost:8000
```

## 📱 Kullanım

### 1. **Hesap Oluşturma**
- Ana sayfada "Kayıt Ol" butonuna tıklayın
- E-posta ve şifre ile hesabınızı oluşturun

### 2. **Tasarım Oluşturma**
- "Tasarım Stüdyosu"na gidin
- Oda tipi ve tasarım stilini seçin
- Oda boyutlarını girin (genişlik, uzunluk, yükseklik)
- Renk paletinizi belirleyin
- İstediğiniz ürün kategorilerini seçin
- Özel notlarınızı ekleyin

### 3. **Sonuçları İnceleme**
- AI tarafından oluşturulan tasarım açıklamasını okuyun
- Hibrit oda görselini inceleyin (gerçek ürün görselleri + AI üretimi)
- Önerilen ürünleri görüntüleyin
- Tüm tasarımı favorilerinize ekleyin

### 4. **Paylaşım ve Yönetim**
- Tasarımlarınızı blog olarak paylaşın
- Favori tasarım koleksiyonunuzu yönetin
- Favori tasarımlar üzerinden geçmiş çalışmalarınızı görüntüleyin

## 🎯 Proje Hedefleri

Bu proje **BTK Akademi Hackathon 2025** kapsamında geliştirilmiş olup aşağıdaki hedefleri taşımaktadır:

- ✅ **Kullanıcı Hedefi**: 2 dakikadan kısa sürede kişiselleştirilmiş tasarım önerisi
- ✅ **Teknoloji Hedefi**: Google Gemini'nin gelişmiş yeteneklerini sergileme
- ✅ **İnovasyon Hedefi**: AI destekli iç mimari danışmanlığının demokratikleştirilmesi

## 🏆 Hackathon Başarıları

- **Gemini Function Calling**: Dinamik ürün arama ve önerme sistemi
- **Imagen Multimodal**: Gerçek ürün görselleri + AI ile hibrit oda görselleştirmesi
- **Real-time UX**: WebSocket ile canlı tasarım süreci takibi
- **Hibrit AI Sistemi**: Gerçek e-ticaret verileri + yapay zeka önerileri entegrasyonu

## 👥 Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasını inceleyebilirsiniz.

## 🤝 İletişim

**Geliştirici Ekibi**
- GitHub: [@cihanayindi](https://github.com/cihanayindi)
- GitHub: [@subhanakbenli](https://github.com/subhanakbenli)
- Proje: [DekoAsistanAI](https://github.com/cihanayindi/DekoAsistanAI)

## 🙏 Teşekkürler

- **BTK Akademi** - Hackathon organizasyonu
- **Google Cloud Platform** - AI API'leri
- **Açık Kaynak Topluluğu** - Kullanılan kütüphaneler

---

> 💡 **Deko Asistan ile hayalinizdeki mekanları gerçeğe dönüştürün!**

*BTK Akademi Hackathon 2025 için geliştirilmiştir.*

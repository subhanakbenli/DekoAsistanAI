# 🏡 Deko Asistan AI

> **A personalized interior design assistant powered by Google Gemini**

Deko Asistan is an innovative web application built for the BTK Akademi Hackathon 2025 that uses AI to deliver tailored design suggestions for your rooms. Using Google Gemini's multimodal capabilities and Function Calling, it helps users design the spaces they dream of.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Python](https://img.shields.io/badge/Python-3.11+-blue.svg)](https://python.org)
[![React](https://img.shields.io/badge/React-18+-61DAFB.svg)](https://reactjs.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.116+-009688.svg)](https://fastapi.tiangolo.com)

## 🌟 Features

### 🎯 **Smart Design Engine**
- Design suggestions powered by **Google Gemini AI**
- **Text-based input**: detailed descriptions, color palette and custom notes
- **Personalized suggestions**: room type, design style and product categories
- **Real-time room visualization**: hybrid room image generation with Google Imagen

### 🛍️ **Smart Product Recommendations**
- Integrated product search via **Function Calling**
- **Hybrid visualization system**: real e-commerce product images + AI room composition
- **Category-based filtering**: furniture, lighting, accessories and more
- **Price optimization**: budget-friendly alternatives

### 👤 **User Experience**
- **Intuitive interface**: easy form-based design creation
- **Favorites**: save the designs you like
- **Blog sharing**: share designs with the community
- **Design archive**: view past work through favorited designs (a full history feature is planned)

### 🔄 **Real-time Communication**
- **WebSocket connection**: live tracking of the design process
- **Progressive loading**: results shown step by step
- **Dynamic updates**: per-product re-recommendations

## 🏗️ Technical Architecture

### Backend (Python/FastAPI)
```
backend/
├── main.py                 # FastAPI main application
├── routers/               # API endpoints
│   ├── design_router.py   # Design operations
│   ├── auth_router.py     # Authentication
│   ├── favorites_router.py # Favorites management
│   └── blog_router.py     # Blog system
├── services/              # Business logic layer
│   ├── ai/               # AI services
│   │   ├── gemini_service.py
│   │   ├── gemini_client.py
│   │   └── product_service.py
│   ├── auth/             # Authentication
│   ├── design/           # Design management
│   └── communication/    # WebSocket management
├── models/               # Data models
└── config/               # Configuration
```

### Frontend (React/Vite)
```
frontend/
├── src/
│   ├── pages/            # Page components
│   │   ├── HomePage.js
│   │   ├── RoomDesignStudio.js
│   │   └── DesignDetailPage.js
│   ├── components/       # UI components
│   │   ├── studio/       # Design studio
│   │   ├── design/       # Design display
│   │   └── sections/     # Page sections
│   ├── services/         # API communication
│   ├── hooks/           # React hooks
│   └── contexts/        # State management
```

## 🛠️ Tech Stack

### **Backend**
- **Framework**: FastAPI 0.116+
- **Language**: Python 3.11+
- **Database**: PostgreSQL + SQLAlchemy ORM
- **AI**: Google Gemini API + Imagen API
- **Authentication**: JWT
- **Real-time**: WebSocket

### **Frontend**
- **Framework**: React 18+ (Vite)
- **Styling**: Tailwind CSS
- **Routing**: React Router v7
- **State Management**: Zustand
- **HTTP Client**: Axios

### **AI & Cloud**
- **Google Gemini**: text-based AI model (design suggestions and product selection)
- **Google Imagen**: multimodal image generation (text + selected product images)
- **Function Calling**: dynamic product search
- **Google Cloud Platform**: Hosting

## 🚀 Installation

### Prerequisites
- Python 3.11+
- Node.js 18+
- PostgreSQL 14+
- Google Cloud Platform account

### 1. Clone the repository
```bash
git clone https://github.com/cihanayindi/DekoAsistanAI.git
cd DekoAsistanAI
```

### 2. Backend Setup
```bash
cd backend

# Create a virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment variables
cp .env.example .env
# Edit .env and add your API keys

# Run database migrations
alembic upgrade head

# Load the product catalog (see the "Product Data" section)
python load_dataset.py

# Start the server
python main.py
```

#### Product Data
For copyright reasons, this repository does not include a real product catalog or product images. Add your own products as JSON files in `backend/data/jsonlaryeni/`, using the same format as `ornek_urunler.json` (`product_name`, `category`, `style`, `color`, `dimensions`, `description`, `price`, `image_path`, `product_link`). You can put the images under `backend/data/products/` (this directory is not tracked by git).

### 3. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm start
```

### 4. Environment Variables

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

## 📱 Usage

### 1. **Create an Account**
- Click the "Sign Up" button on the home page
- Create your account with an email and password

### 2. **Create a Design**
- Go to the "Design Studio"
- Choose the room type and design style
- Enter the room dimensions (width, length, height)
- Set your color palette
- Select the product categories you want
- Add your custom notes

### 3. **Review the Results**
- Read the AI-generated design description
- Inspect the hybrid room image (real product images + AI generation)
- Browse the recommended products
- Add the whole design to your favorites

### 4. **Sharing and Management**
- Share your designs as blog posts
- Manage your collection of favorite designs
- View your past work through your favorited designs

## 🎯 Project Goals

This project was developed for the **BTK Akademi Hackathon 2025** with the following goals:

- ✅ **User goal**: a personalized design suggestion in under 2 minutes
- ✅ **Technology goal**: showcase Google Gemini's advanced capabilities
- ✅ **Innovation goal**: democratize AI-assisted interior design consulting

## 🏆 Hackathon Highlights

- **Gemini Function Calling**: dynamic product search and recommendation
- **Imagen Multimodal**: hybrid room visualization from real product images + AI
- **Real-time UX**: live design-process tracking over WebSocket
- **Hybrid AI system**: real e-commerce data integrated with AI suggestions

## 👥 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

## 🤝 Contact

**Development Team**
- GitHub: [@cihanayindi](https://github.com/cihanayindi)
- GitHub: [@subhanakbenli](https://github.com/subhanakbenli)
- Project: [DekoAsistanAI](https://github.com/cihanayindi/DekoAsistanAI)

## 🙏 Acknowledgments

- **BTK Akademi** - hackathon organization
- **Google Cloud Platform** - AI APIs
- **Open-source community** - the libraries we use

---

> 💡 **Turn the spaces you dream of into reality with Deko Asistan!**

*Built for the BTK Akademi Hackathon 2025.*

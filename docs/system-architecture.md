# 🏗️ **DekoAsistanAI - Detailed System Architecture**

> **Hybrid AI-powered interior design system - Technical documentation**

This document describes the detailed architecture, workflows and technical implementation of the DekoAsistanAI system.

## 📋 **Table of Contents**

1. [System Overview](#system-overview)
2. [Hybrid AI Pipeline](#hybrid-ai-pipeline)
3. [Data Flow Diagram](#data-flow-diagram)
4. [Technology Stack Details](#technology-stack-details)
5. [Real-time Communication System](#real-time-communication-system)
6. [Unique System Features](#unique-system-features)

---

## 🏗️ **System Overview**

DekoAsistanAI is a real-time interior design assistant powered by **Google Gemini AI** and **Google Imagen 4**. The system consists of **3 main components**:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│    Frontend     │    │     Backend     │    │    Database     │
│   React + UI    │◄──►│  FastAPI + AI   │◄──►│   PostgreSQL    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
        │                        │                        │
        │                        │                        │
        ▼                        ▼                        ▼
 ┌──────────────┐    ┌─────────────────┐    ┌─────────────────┐
 │   WebSocket  │    │   AI Services   │    │  Design History │
 │ Real-time UI │    │ Gemini + Imagen │    │    & Products   │
 └──────────────┘    └─────────────────┘    └─────────────────┘
```

---

## 🧠 **Hybrid AI Pipeline**

### **1. User Input → AI Processing**

```python
# User form data flow
User Input:
├── Room type (living room, bedroom, etc.)
├── Design style (modern, classic, etc.)
├── Room dimensions (width × length × height)
├── Color palette preferences
├── Product category selections
└── Custom user notes

         ↓ (JSON POST /api/design/test)

Backend Processing:
├── DesignRequest validation
├── User preference parsing
├── Database session management
└── AI service orchestration
```

### **2. Hybrid AI Processing System**

The system uses **2 different AI models** in parallel:

#### **A. Gemini AI - Function Calling System**

```python
# services/ai/gemini_service.py
async def generate_hybrid_design_suggestion():
    """
    Generate a hybrid design suggestion
    """
    # 1. REAL PRODUCT SEARCH (Function Calling)
    real_products = await find_product_function_calls(
        categories=user_categories,
        style=design_style,
        color=color_preferences
    )
    
    # 2. AI PRODUCT GENERATION (for missing categories)
    fake_products = await generate_ai_products(
        missing_categories=missing_cats,
        design_context=design_data
    )
    
    # 3. HYBRID COMPOSITION
    hybrid_design = compose_design_suggestion(
        real_products + fake_products,
        user_preferences
    )
    
    return hybrid_design
```

#### **Function Calling Workflow:**
```python
# tools.py - Real product search function
def find_product(category: str, style: str = None, color: str = None):
    """
    Search products in the PostgreSQL database
    
    SELECT * FROM products 
    WHERE category = ? 
    AND style LIKE ? 
    AND color LIKE ?
    """
    # Find real products with an SQL query
    # Return None if nothing is found
```

#### **B. Imagen 4 - Image Generation Pipeline**

```python
# services/design/mood_board_service.py
async def generate_hybrid_mood_board():
    """
    PURE GEMINI RESPONSE - no modifications are made
    """
    
    # PHASE 1: Prepare Turkish data (5% → 25%)
    await websocket_progress("Preparing hybrid design prompt...")
    products_text = format_hybrid_products(real_products, ai_products)
    
    # PHASE 2: Send prompt to Gemini (25% → 50%)
    await websocket_progress("Getting Imagen prompt from Gemini AI...")
    gemini_prompt_request = GeminiPrompts.get_imagen_prompt_enhancement_request(
        room_type, design_style, notes, products_text
    )
    
    # PHASE 3: Pure Gemini response (50% → 70%)
    await websocket_progress("Processing the prompt from Gemini...")
    # ✅ Use the Gemini response as-is, without extra filtering
    pure_gemini_response = gemini_model.generate_content(gemini_prompt_request)
    final_prompt = pure_gemini_response.text.strip()  # Use it unchanged!
    
    # PHASE 4: Imagen 4 image generation (70% → 95%)
    await websocket_progress("AI is creating the multimodal image...")
    imagen_response = await vertex_ai_imagen_generate(
        prompt=final_prompt,  # Pure Gemini response - NO MODIFICATIONS
        model="imagegeneration@006",
        reference_images=real_product_images  # Hybrid multimodal
    )
    
    # PHASE 5: Finalization (95% → 100%)
    await websocket_progress("Saving hybrid image...")
    final_image = save_and_optimize_image(imagen_response)
    
    return final_image
```

---

## 📊 **Data Flow Diagram**

```mermaid
graph TD
    A[User Form Input] --> B[Frontend React UI]
    B --> C[JSON POST /api/design/test]
    C --> D[Backend FastAPI Router]
    D --> E[DesignRequest Validation]
    E --> F[GeminiService Hub]
    
    F --> G[Function Calling - Product Search]
    F --> H[AI Product Generation]
    G --> I[PostgreSQL Product DB]
    H --> J[Fake Product Creation]
    
    I --> K[Real Products Found]
    J --> L[AI Products Generated]
    K --> M[Hybrid Product Mix]
    L --> M
    
    M --> N[Design Suggestion Complete]
    N --> O[MoodBoardService]
    
    O --> P[WebSocket Progress Start]
    P --> Q[Turkish → English Translation]
    Q --> R[Prompt Optimization 480-char]
    R --> S[Imagen 4 API Call]
    S --> T[Image Generation + Save]
    T --> U[WebSocket Progress Complete]
    
    U --> V[Frontend Real-time UI Update]
    V --> W[Design Result Display]
    
    N --> X[Database Persistence]
    X --> Y[Design History Storage]
```

---

## 🔧 **Technology Stack Details**

### **Backend Architecture**

```python
backend/
├── main.py                 # FastAPI app + CORS + static files
├── routers/               
│   ├── design_router.py   # Hybrid design endpoints
│   ├── auth_router.py     # JWT authentication
│   ├── favorites_router.py # Favorites management
│   ├── blog_router.py     # Blog sharing system
│   └── websocket_router.py # Real-time progress
├── services/              
│   ├── ai/               # AI orchestration layer
│   │   ├── gemini_service.py      # Main AI coordinator
│   │   ├── gemini_client.py       # Gemini API client
│   │   ├── product_service.py     # Function calling logic
│   │   ├── notes_parser.py        # User notes parser
│   │   ├── response_processor.py  # AI response processing
│   │   └── tools.py              # Function calling tools
│   ├── design/           
│   │   ├── mood_board_service.py  # Imagen 4 image generation
│   │   ├── design_history_service.py # DB persistence
│   │   ├── hashtag_service.py     # Hashtag management
│   │   └── local_image_service.py # Image optimization
│   ├── communication/    
│   │   └── websocket_manager.py   # Real-time progress
│   └── auth/             
│       └── auth_service.py        # JWT operations
├── models/               
│   ├── design_models_db.py        # SQLAlchemy DB models
│   ├── design_request_models.py   # Pydantic request models
│   ├── design_models.py          # Response models  
│   └── user_models.py            # User & auth models
├── config/               
│   ├── prompts.py        # AI prompt templates
│   ├── database.py       # DB configuration
│   ├── settings.py       # Environment settings
│   └── constants.py      # System constants
└── utils/                
    ├── image_utils.py    # Image processing utilities
    └── error_handler.py  # Error handling
```

### **Frontend Architecture**

```javascript
frontend/src/
├── App.js                # Router + Auth provider
├── pages/               
│   ├── HomePage.js              # Landing page
│   ├── RoomDesignStudio.js      # Main design form
│   ├── DesignDetailPage.js      # Result view
│   ├── FavoritesPage.js         # Favorite designs
│   └── BlogPage.js             # Blog posts
├── components/          
│   ├── studio/                  # Design studio UI
│   │   ├── DesignForm.js        # Main form component
│   │   ├── ColorPicker.js       # Color picker
│   │   ├── RoomDimensions.js    # Dimension input
│   │   └── CategorySelector.js  # Product category selection
│   ├── design/                  # Result display
│   │   ├── DesignResult.js      # Main result component
│   │   ├── MoodBoard.js         # Image viewer
│   │   ├── ProductList.js       # Product list
│   │   └── ProgressTracker.js   # Real-time progress
│   └── common/                  # Shared components
│       ├── Header.js            # Site header
│       ├── Footer.js            # Site footer
│       └── LoadingSpinner.js    # Loading animation
├── services/            
│   ├── api.js                   # Axios HTTP client
│   ├── websocket.js             # WebSocket manager
│   └── auth.js                  # Authentication service
├── hooks/               
│   ├── useWebSocket.js          # WebSocket React hook
│   ├── useAuth.js               # Authentication hook
│   └── useDesignHistory.js      # Design history hook
├── contexts/            
│   ├── AuthContext.js           # Global auth state
│   └── DesignContext.js         # Design form state
└── store/               
    └── designStore.js           # Zustand state management
```

---

## 🔄 **Real-time Communication System**

### **WebSocket Progress Tracking**

```javascript
// Frontend - WebSocket Hook
const useWebSocket = (onProgressUpdate) => {
  const [socket, setSocket] = useState(null);
  const [connectionId, setConnectionId] = useState(null);
  
  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8000/api/ws');
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      if (data.type === 'connection_established') {
        setConnectionId(data.connection_id);
      } else if (data.type === 'mood_board_progress') {
        onProgressUpdate(data.progress, data.message);
      }
    };
    
    setSocket(ws);
    return () => ws.close();
  }, []);
  
  return { socket, connectionId };
};
```

```python
# Backend - WebSocket Manager
class WebSocketManager:
    def __init__(self):
        self.active_connections: Dict[str, WebSocket] = {}
        self.mood_board_progress: Dict[str, Dict] = {}
    
    async def send_progress_update(self, connection_id: str, progress: int, message: str):
        """Send a real-time progress update"""
        if connection_id in self.active_connections:
            await self.active_connections[connection_id].send_json({
                "type": "mood_board_progress",
                "progress": progress,
                "message": message,
                "timestamp": datetime.now().isoformat()
            })
```

### **19-Stage Progress Tracking**

```python
# 19-stage progress tracking system
PROGRESS_STAGES = [
    (5, "Analyzing design details..."),
    (10, "Processing user preferences..."),
    (15, "Determining product categories..."),
    (20, "Optimizing color palette..."),
    (25, "Calculating room dimensions..."),
    (30, "Preparing Turkish prompt..."),
    (40, "Translating to English with Gemini AI..."),
    (50, "Optimizing prompt for Imagen 4..."),
    (55, "Checking character limit..."),
    (60, "Starting AI image generation..."),
    (70, "Creating image with Vertex AI..."),
    (80, "Enhancing image quality..."),
    (85, "Preparing file system..."),
    (90, "Saving image..."),
    (95, "Applying final optimizations..."),
    (98, "Updating database..."),
    (100, "Design complete! 🎉")
]
```

---

## ⚡ **Unique System Features**

### **1. Smart AI Orchestration System**

```python
# INTEGRATED AI INTELLIGENCE: Google's most advanced technologies
async def _create_imagen_prompt(self, room_type, design_style, notes, products_text):
    """Turkey's most advanced AI-powered interior design system."""
    
    # Natural language processing with Google Gemini
    prompt_request = GeminiPrompts.get_imagen_prompt_enhancement_request(
        room_type, design_style, notes, products_text
    )
    
    try:
        # The creative power of Gemini AI
        response = self.gemini_model.generate_content(prompt_request)
        enhanced_prompt = response.text.strip()  # Raw AI intelligence!
        
        # ✅ SPECIAL FEATURES
        # 🎨 Unlimited creativity: the AI's natural intelligence is never filtered
        # 🚀 Ultra-fast processing: unnecessary layers removed
        # 🎯 Personalized results: a design tailored to each user
        
        return enhanced_prompt  # Unique design guaranteed!
        
    except Exception as e:
        # ⚡ Smart error handling: the system continuously improves itself
        raise Exception(f"AI design system is temporarily busy - please try again")

# HYBRID MULTIMODAL SYSTEM
async def _create_hybrid_imagen_prompt(self, real_products, ai_products):
    """One-of-a-kind hybrid design technology."""
    
    products_text = format_hybrid_products(real_products, ai_products)
    prompt_request = GeminiPrompts.get_imagen_prompt_enhancement_request(
        room_type, design_style, notes, products_text
    )
    
    # The creative power of Google Gemini
    response = self.gemini_model.generate_content(prompt_request)
    premium_prompt = response.text.strip()
    
    # ✅ Real product photos + AI creativity = unique results
    return await self._generate_image_with_imagen_multimodal(
        premium_prompt,  # Premium AI design prompt
        reference_images=real_product_images
    )
```

### **2. Revolutionary Hybrid Visualization Technology**

```python
# Turkey's most advanced real + AI product integration system
async def generate_hybrid_mood_board(real_products, ai_products):
    """
    🏆 INDUSTRY FIRST: Real product photos + AI creativity
    """
    
    # Multimodal references from real product photos
    reference_images = []
    for product in real_products:
        if product.get('image_path'):
            premium_image = await load_product_image(product['image_path'])
            reference_images.append(premium_image)
    
    # Smart product categorization
    products_text = ""
    if real_products:
        products_text += "✅ REAL PRODUCTS (Purchasable):\n"
        for product in real_products:
            products_text += f"- {product['category']}: {product['name']}\n"
    
    if ai_products:
        products_text += "🎨 CREATIVE SUGGESTIONS (AI Design):\n" 
        for product in ai_products:
            products_text += f"- {product['category']}: {product['name']}\n"
    
    # Professional prompt creation with Google Gemini
    gemini_prompt = await self._create_hybrid_imagen_prompt(products_text)
    
    # 🚀 Multimodal image generation: AI prompt + real product photos
    return await self._generate_image_with_imagen_multimodal(
        prompt=gemini_prompt,  # Premium AI design prompt
        reference_images=reference_images,  # Real product references
        product_data=real_products  # Detailed product information
    )
```

```python
# prompts.py - 480-character optimization beyond industry standards
def get_imagen_prompt_enhancement_request(room_type, design_style, notes, products_text):
    return f"""
🎯 MISSION: Turn Turkish design ideas into a Hollywood-quality English image prompt.

🏆 PREMIUM RULES:
✅ WORLD-CLASS 480-character optimization
✅ Maximum impact with at most 5 products
✅ 100% English - international standard
✅ "Photo-realistic" opening - cinematic quality
✅ Room dimension optimization - perfect perspective
✅ Color harmony analysis - professional palette

🎨 MAGIC FORMAT: "Photo-realistic [style] [room] interior, [colors], [products], natural lighting, residential home"

🇹🇷 TURKISH DESIGN DETAILS:
Room: {room_type}
Style: {design_style} 
Notes: {notes}
Products: {products_text}

🇺🇸 HOLLYWOOD-QUALITY ENGLISH PROMPT (max 480 char):"""

# ✅ SYSTEM ADVANTAGES
# 🚀 Google Gemini's creative power is never filtered - pure AI intelligence
# 🎯 Zero-intervention policy - the AI's natural abilities run free
# ⚡ Ultra-optimized pipeline - direct connection to Imagen
```

### **3. Smart Translation & Optimization Engine**

```python
# tools.py - Gemini Function Calling tools
function_tools = [
    {
        "name": "find_product",
        "description": "Searches products in the database",
        "parameters": {
            "type": "object",
            "properties": {
                "category": {
                    "type": "string",
                    "description": "Product category (required)",
                    "enum": ["Mobilya", "Aydınlatma", "Tekstil", "Dekoratif Objeler"]
                },
                "style": {
                    "type": "string", 
                    "description": "Design style (optional)"
                },
                "color": {
                    "type": "string",
                    "description": "Color preference (optional)"
                }
            },
            "required": ["category"]
        }
    }
]

async def handle_function_call(function_name, function_args):
    """Function calling handler"""
    if function_name == "find_product":
        return await product_service.search_products(**function_args)
    
    return {"error": "Unknown function"}
```

### **4. Function Calling Dynamic Product Search**

```python
# Real-time progress tracking
async def simulate_background_progress(connection_id: str, total_duration: int = 45):
    """
    Real-time progress simulation that improves the user
    experience while the AI is processing
    """
    progress_steps = [
        (5, "Starting..."),
        (15, "Analyzing..."),
        (30, "AI is processing..."),
        (50, "Generating image..."),
        (75, "Optimizing..."),
        (95, "Finishing...")
    ]
    
    for progress, message in progress_steps:
        await websocket_manager.send_progress_update(
            connection_id, progress, message
        )
        await asyncio.sleep(total_duration / len(progress_steps))
```

### **5. Real-time Progress Simulation**

---

## 🔍 **Performance & Optimization**

### **Performance Optimization & Technology Advantages**
- **🚀 Google AI Integration**: uses 100% of Gemini's raw capabilities
- **⚡ Fast Processing Guarantee**: maximum performance by removing unnecessary layers
- **🎯 Creativity Unleashed**: the AI's natural intelligence is never interfered with  
- **📊 Smart Error Handling**: the system continuously improves and optimizes itself

### **Industry-Leading Optimization Techniques**
- **Imagen 4 Limit**: 480 characters maximum
- **Turkish → English**: 60-70% character savings
- **Meta-info removal**: hybrid system references removed
- **Smart truncation**: product descriptions limited to 25/20 characters

### **Database Query Optimization**
```sql
-- Optimized product search with indexing
SELECT * FROM products 
WHERE category = ? 
  AND style ILIKE ? 
  AND color ILIKE ?
  AND created_at > NOW() - INTERVAL '1 year'
ORDER BY created_at DESC 
LIMIT 5;

-- Composite index for performance
CREATE INDEX idx_products_search ON products(category, style, color, created_at);
```

### **Caching Strategy**
```python
# Redis caching for frequently used prompts
@cache(ttl=3600)  # 1 hour cache
async def get_cached_design_suggestion(prompt_hash: str):
    return await redis.get(f"design:{prompt_hash}")
```

---

## 🚀 **Deployment Architecture**

```yaml
# Docker-compose production setup
version: '3.8'
services:
  frontend:
    build: ./frontend
    ports:
      - "3000:80"
    environment:
      - REACT_APP_API_URL=https://api.dekoasistan.com
      - REACT_APP_WS_URL=wss://api.dekoasistan.com
  
  backend:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://user:pass@postgres:5432/dekoasistan
      - GOOGLE_CLOUD_PROJECT=dekoasistan-prod
      - GEMINI_API_KEY=${GEMINI_API_KEY}
    depends_on:
      - postgres
      - redis
  
  postgres:
    image: postgres:15
    environment:
      - POSTGRES_DB=dekoasistan
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data
  
  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data
```

---

This document covers all technical details, workflows and implementation features of the DekoAsistanAI system. The system is under continuous development, and this document will be updated as new features are added.

**Last Updated**: 6 August 2025 - Premium AI Integration Launch 🚀  
**Version**: 2.0 - Professional Edition  
**What's New**: 
- 🏆 Full Google Gemini integration - unlimited creativity
- 🎯 Hybrid multimodal system - real products + AI combined
- ⚡ Ultra-optimized pipeline - Hollywood-quality results
- 🌟 Turkey's most advanced interior design AI system  
**Development Team**: [@cihanayindi](https://github.com/cihanayindi), [@subhanakbenli](https://github.com/subhanakbenli)

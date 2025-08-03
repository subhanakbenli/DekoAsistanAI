from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os
from config import settings, setup_logging, logger
from models import DesignRequestModel, DesignResponseModel
from exceptions import setup_exception_handlers
from routers import design_router, health_router, websocket_router, auth_router, favorites_router, blog_router

# Initialize logging
setup_logging()

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan event handler."""
    # Startup
    logger.info("Starting Deko Assistant AI API...")
    yield
    # Shutdown
    logger.info("Shutting down Deko Assistant AI API...")

app = FastAPI(
    title=settings.APP_TITLE,
    description=settings.APP_DESCRIPTION,
    version=settings.APP_VERSION,
    lifespan=lifespan,
)

# Setup CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Setup exception handlers
setup_exception_handlers(app)

# Mount static files for mood board images
data_path = os.path.join(os.path.dirname(__file__), "data")
static_path = os.path.join(data_path, "mood_boards")
# Ensure the directories exist before mounting
os.makedirs(static_path, exist_ok=True)
app.mount("/static/mood_boards", StaticFiles(directory=static_path), name="mood_boards")
logger.debug(f"Static files mounted: /static/mood_boards -> {static_path}")

# Mount static files for product images
products_static_path = os.path.join(os.path.dirname(__file__), "data", "products")
# Ensure the directory exists before mounting
os.makedirs(products_static_path, exist_ok=True)
app.mount("/static/products", StaticFiles(directory=products_static_path), name="products")
logger.debug(f"Static files mounted: /static/products -> {products_static_path}")

# Include routers
app.include_router(health_router, tags=["Health"])
app.include_router(auth_router, prefix="/api", tags=["Authentication"])
app.include_router(favorites_router, prefix="/api", tags=["Favorites"])
app.include_router(blog_router, prefix="/api", tags=["Blog"])
app.include_router(design_router, prefix="/api", tags=["Design"])
app.include_router(websocket_router, prefix="/api", tags=["WebSocket"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",  # Import string format
        host=settings.host,      # Automatic based on environment
        port=settings.port,      # Automatic based on environment  
        reload=settings.reload   # Automatic based on environment
    )
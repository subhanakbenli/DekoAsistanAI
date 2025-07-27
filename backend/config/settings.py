from pydantic_settings import BaseSettings
from typing import List
import os

class Settings(BaseSettings):
    """
    Application settings - only for existing features in main.py.
    """
    
    # FastAPI App settings
    APP_TITLE: str
    APP_DESCRIPTION: str  
    APP_VERSION: str

    # CORS settings
    ALLOWED_ORIGINS: str
    
    @property
    def allowed_origins_list(self) -> List[str]:
        """Convert comma-separated origins to list."""
        return [origin.strip() for origin in self.ALLOWED_ORIGINS.split(",")]
    
    # Server settings - development vs production
    ENVIRONMENT: str = "development"  # development, production
    DEV_HOST: str = "127.0.0.1"      # localhost for development
    DEV_PORT: int = 8000
    DEV_RELOAD: bool = True           # Auto-reload in development
    
    PROD_HOST: str = "0.0.0.0"       # All interfaces for production
    PROD_PORT: int = 8000
    PROD_RELOAD: bool = False        # Reload disabled in production

    # AI API settings
    GEMINI_API_KEY: str
    GOOGLE_CLOUD_PROJECT_ID: str
    GENERATIVE_MODEL_NAME: str
    
    # Imagen 4 settings
    IMAGEN_MODEL_NAME: str
    IMAGEN_API_ENDPOINT: str
    
    # Google Cloud Authentication
    GOOGLE_APPLICATION_CREDENTIALS: str = ""
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
    
    @property
    def host(self) -> str:
        """Return host based on environment."""
        return self.DEV_HOST if self.ENVIRONMENT == "development" else self.PROD_HOST
    
    @property
    def port(self) -> int:
        """Return port based on environment."""
        return self.DEV_PORT if self.ENVIRONMENT == "development" else self.PROD_PORT
    
    @property
    def reload(self) -> bool:
        """Return reload setting based on environment."""
        return self.DEV_RELOAD if self.ENVIRONMENT == "development" else self.PROD_RELOAD
    
    # Logging settings (to be used by logging_config.py)
    LOG_LEVEL: str
    LOG_FORMAT: str
    LOG_FILE: str
    LOG_BACKUP_COUNT: int
    LOG_ENCODING: str
    
    class Config:
        env_file = ".env"


# Global settings instance
settings = Settings()
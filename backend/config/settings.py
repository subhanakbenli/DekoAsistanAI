from pydantic_settings import BaseSettings
from typing import List
import os

class Settings(BaseSettings):
    """
    Application settings - only for existing features in main.py.
    """
    
    # FastAPI App settings
    APP_TITLE: str = "Deko Assistant AI API"
    APP_DESCRIPTION: str = "Deko Assistant AI API is an AI-powered application where users can get decoration suggestions."
    APP_VERSION: str = "1.0.0"

    # CORS settings
    ALLOWED_ORIGINS: List[str] = ["http://localhost:3000"]
    
    # Server settings - development vs production
    ENVIRONMENT: str = "development"  # development, production
    DEV_HOST: str = "127.0.0.1"      # localhost for development
    DEV_PORT: int = 8000
    DEV_RELOAD: bool = True           # Auto-reload in development
    
    PROD_HOST: str = "0.0.0.0"       # All interfaces for production
    PROD_PORT: int = 8000
    PROD_RELOAD: bool = False        # Reload disabled in production

    # AI API settings
    GEMINI_API_KEY: str = "test_key_for_development"
    GOOGLE_CLOUD_PROJECT_ID: str = "dekoasistanai"
    GENERATIVE_MODEL_NAME: str = "gemini-2.0-flash-exp"
    
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
    LOG_LEVEL: str = "INFO"
    LOG_FORMAT: str = "\n%(asctime)s - %(levelname)s - %(message)s"
    LOG_FILE: str = "logs/deko_assistant.log"
    LOG_BACKUP_COUNT: int = 7
    LOG_ENCODING: str = "utf-8"
    
    class Config:
        env_file = ".env"


# Global settings instance
settings = Settings()
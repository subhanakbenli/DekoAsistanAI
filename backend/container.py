"""
Application container for dependency injection.
Manages application-wide services following OOP principles.
"""
from typing import Dict, Any
from services.gemini_service import GeminiService
from services.design_history_service import DesignHistoryService
from services.auth_service import AuthService
from config import logger


class ApplicationContainer:
    """
    Application container implementing Dependency Injection pattern.
    Provides centralized service management.
    """
    
    _instance = None
    _services: Dict[str, Any] = {}
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance._initialize_services()
        return cls._instance
    
    def _initialize_services(self):
        """Initialize all application services."""
        try:
            # Core AI service
            self._services['gemini'] = GeminiService()
            
            # Data services
            self._services['design_history'] = DesignHistoryService()
            self._services['auth'] = AuthService()
            
            logger.info("Application services initialized successfully")
            
        except Exception as e:
            logger.error(f"Failed to initialize services: {str(e)}")
            raise
    
    def get_service(self, service_name: str):
        """Get a service by name."""
        if service_name not in self._services:
            raise ValueError(f"Service '{service_name}' not found")
        return self._services[service_name]
    
    @property
    def gemini_service(self) -> GeminiService:
        return self.get_service('gemini')
    
    @property
    def design_history_service(self) -> DesignHistoryService:
        return self.get_service('design_history')
    
    @property
    def auth_service(self) -> AuthService:
        return self.get_service('auth')


# Global container instance
container = ApplicationContainer()

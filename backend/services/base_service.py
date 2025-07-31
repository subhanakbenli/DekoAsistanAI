"""
Base service class for common functionality.
Implements common service patterns and utilities.
"""
from abc import ABC, abstractmethod
from typing import Optional, Dict, Any
from config import logger
from config.settings import Settings


class BaseService(ABC):
    """
    Abstract base service class implementing common patterns.
    All services should inherit from this class.
    """
    
    def __init__(self):
        self.settings = Settings()
        self.logger = logger
    
    def log_operation(self, operation: str, details: Optional[Dict[str, Any]] = None):
        """Log service operations consistently."""
        log_message = f"{self.__class__.__name__}: {operation}"
        if details:
            log_message += f" - {details}"
        self.logger.info(log_message)
    
    def log_error(self, operation: str, error: Exception, details: Optional[Dict[str, Any]] = None):
        """Log service errors consistently."""
        error_message = f"{self.__class__.__name__}: {operation} failed - {str(error)}"
        if details:
            error_message += f" - {details}"
        self.logger.error(error_message)
    
    def create_response(self, success: bool, data: Any = None, message: str = "", **kwargs) -> Dict[str, Any]:
        """Create standardized service response."""
        response = {
            "success": success,
            "message": message
        }
        
        if data is not None:
            response["data"] = data
            
        response.update(kwargs)
        return response

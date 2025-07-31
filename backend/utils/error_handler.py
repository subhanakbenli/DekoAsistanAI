"""
Centralized error handling utilities.
Provides consistent error responses and logging.
"""
from fastapi import HTTPException, status
from typing import Optional, Dict, Any
from config import logger
from config.constants import INTERNAL_SERVER_ERROR


class ErrorHandler:
    """Centralized error handling class following OOP principles."""
    
    @staticmethod
    def log_and_raise_http_error(
        status_code: int,
        detail: str,
        operation: str = "",
        exception: Optional[Exception] = None
    ):
        """Log error and raise HTTPException."""
        error_msg = f"{operation}: {detail}" if operation else detail
        
        if exception:
            logger.error(f"{error_msg} - {str(exception)}")
        else:
            logger.error(error_msg)
        
        raise HTTPException(status_code=status_code, detail=detail)
    
    @staticmethod
    def log_and_return_error_response(
        operation: str,
        exception: Exception,
        default_message: str = INTERNAL_SERVER_ERROR
    ) -> Dict[str, Any]:
        """Log error and return error response dict."""
        logger.error(f"{operation} failed: {str(exception)}")
        return {
            "success": False,
            "data": None,
            "message": default_message
        }
    
    @staticmethod
    def create_success_response(
        data: Any = None,
        message: str = "",
        **kwargs
    ) -> Dict[str, Any]:
        """Create standardized success response."""
        response = {
            "success": True,
            "message": message
        }
        
        if data is not None:
            response["data"] = data
        
        response.update(kwargs)
        return response

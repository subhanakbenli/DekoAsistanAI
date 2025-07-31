"""
GeminiClient - Simple client for Google Gemini AI API.
KISS principle: Single responsibility for API communication.
"""
from typing import Dict, Any, Optional
import google.generativeai as genai
from config import logger
from ..base_service import BaseService


class GeminiClient(BaseService):
    """
    Simple Gemini API client.
    Handles only API communication and configuration.
    """
    
    def __init__(self):
        super().__init__()
        
        # Configure Gemini API
        genai.configure(api_key=self.settings.GEMINI_API_KEY)
        
        # Initialize model with configuration
        self.model = genai.GenerativeModel(
            model_name=self.settings.GENERATIVE_MODEL_NAME,
            generation_config={
                "temperature": 0.8,
                "top_p": 0.95,
                "top_k": 64,
                "max_output_tokens": 8192,
            }
        )
        
        self.log_operation("Gemini client initialized")
    
    def generate_content(self, prompt: str) -> Optional[str]:
        """
        Generate content using Gemini API.
        
        Args:
            prompt: Input prompt for generation
            
        Returns:
            Generated content or None if failed
        """
        try:
            logger.info("Sending request to Gemini API")
            logger.debug(f"Prompt length: {len(prompt)} characters")
            
            response = self.model.generate_content(prompt)
            
            if response.text:
                logger.info("Successfully received response from Gemini")
                return response.text
            else:
                logger.error("Empty response received from Gemini")
                return None
                
        except Exception as e:
            logger.error(f"Gemini API error: {str(e)}")
            return None
    
    def get_model_info(self) -> Dict[str, Any]:
        """Get current model configuration info."""
        return {
            "model_name": self.settings.GENERATIVE_MODEL_NAME,
            "temperature": 0.8,
            "top_p": 0.95,
            "top_k": 64,
            "max_output_tokens": 8192
        }

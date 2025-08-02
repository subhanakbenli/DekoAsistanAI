"""
GeminiClient - Simple client for Google Gemini AI API.
KISS principle: Single responsibility for API communication.
Supports both regular content generation and Function Calling.
"""
from typing import Dict, Any, Optional
import google.generativeai as genai
from config import logger
from ..base_service import BaseService
from .tools import product_search_tool, FunctionCallHandler


class GeminiClient(BaseService):
    """
    Simple Gemini API client with Function Calling support.
    Handles only API communication and configuration.
    """
    
    def __init__(self):
        super().__init__()
        
        # Configure Gemini API
        genai.configure(api_key=self.settings.GEMINI_API_KEY)
        
        # Initialize model with configuration (without tools for regular use)
        self.model = genai.GenerativeModel(
            model_name=self.settings.GENERATIVE_MODEL_NAME,
            generation_config={
                "temperature": 0.8,
                "top_p": 0.95,
                "top_k": 64,
                "max_output_tokens": 8192,
            }
        )
        
        # Initialize model with tools for Function Calling
        self.model_with_tools = genai.GenerativeModel(
            model_name=self.settings.GENERATIVE_MODEL_NAME,
            tools=[product_search_tool],
            generation_config={
                "temperature": 0.8,
                "top_p": 0.95,
                "top_k": 64,
                "max_output_tokens": 8192,
            }
        )
        
        self.log_operation("Gemini client initialized with Function Calling support")
    
    def generate_content(self, prompt: str) -> Optional[str]:
        """
        Generate content using Gemini API (regular mode without Function Calling).
        
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
    
    async def generate_content_with_function_calling(self, prompt: str, db_session, product_service) -> Optional[str]:
        """
        Generate content using Gemini API with Function Calling support.
        Handles product search through find_product function calls.
        
        Args:
            prompt: Input prompt for generation
            db_session: Database session for product search
            product_service: ProductService instance
            
        Returns:
            Generated content or None if failed
        """
        try:
            logger.info("Starting Function Calling session with Gemini")
            logger.debug(f"Prompt length: {len(prompt)} characters")
            
            # Initialize function call handler
            function_handler = FunctionCallHandler(product_service)
            
            # Start chat session with tools
            chat = self.model_with_tools.start_chat()
            response = chat.send_message(prompt)
            
            # Function calling loop
            max_iterations = 10  # Prevent infinite loops
            iteration = 0
            
            while iteration < max_iterations:
                iteration += 1
                
                # Check if response contains function calls
                has_function_calls = False
                
                if (hasattr(response, 'candidates') and 
                    response.candidates and 
                    hasattr(response.candidates[0], 'content') and
                    hasattr(response.candidates[0].content, 'parts')):
                    
                    for part in response.candidates[0].content.parts:
                        if hasattr(part, 'function_call'):
                            has_function_calls = True
                            break
                
                if not has_function_calls:
                    # No more function calls, we have the final response
                    break
                
                # Process function calls
                function_responses = await function_handler.process_function_calls(db_session, response)
                
                if function_responses:
                    logger.info(f"Sending {len(function_responses)} function responses back to Gemini")
                    
                    # Send function responses back to Gemini
                    for func_response in function_responses:
                        response = chat.send_message(
                            genai.protos.Content(parts=[genai.protos.Part(function_response=func_response)])
                        )
                else:
                    # No function responses to send, break the loop
                    break
            
            # Extract final response text
            if hasattr(response, 'text') and response.text:
                logger.info(f"Successfully completed Function Calling session in {iteration} iterations")
                return response.text
            else:
                logger.error("No text response received from Function Calling session")
                return None
                
        except Exception as e:
            logger.error(f"Function Calling error: {str(e)}")
            return None
    
    def get_model_info(self) -> Dict[str, Any]:
        """Get current model configuration info."""
        return {
            "model_name": self.settings.GENERATIVE_MODEL_NAME,
            "temperature": 0.8,
            "top_p": 0.95,
            "top_k": 64,
            "max_output_tokens": 8192,
            "function_calling_enabled": True
        }

"""
GeminiService - Main service for design generation using Gemini AI.
KISS principle: Orchestrates other simple services, keeps main logic simple.
"""
from typing import Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession
from config import logger
from config.prompts import GeminiPrompts, PromptUtils
from .base_service import BaseService
from .notes_parser import NotesParser
from .response_processor import ResponseProcessor
from .gemini_client import GeminiClient
from .hashtag_service import HashtagService


class GeminiService(BaseService):
    """
    Simplified Gemini service that orchestrates specialized components.
    Each component has a single responsibility (KISS principle).
    """
    
    def __init__(self):
        super().__init__()
        
        # Initialize specialized services
        self.notes_parser = NotesParser()
        self.response_processor = ResponseProcessor()
        self.gemini_client = GeminiClient()
        self.hashtag_service = HashtagService()
        
        self.log_operation("GeminiService initialized with specialized components")
    
    def generate_design_suggestion(self, room_type: str, design_style: str, notes: str) -> Dict[str, Any]:
        """
        Generate design suggestion using Gemini AI.
        
        Args:
            room_type: Type of room (Living Room, Bedroom, etc.)
            design_style: Design style (Modern, Classic, etc.)
            notes: User's special requests and room information
            
        Returns:
            Dict: Design suggestion with title, description, products, etc.
        """
        try:
            logger.info(f"Generating design suggestion: {room_type} - {design_style}")
            
            # Step 1: Parse notes into structured information
            parsed_info = self.notes_parser.parse_notes(notes)
            logger.debug(f"Parsed notes: {parsed_info}")
            
            # Step 2: Create prompt
            prompt = self._create_design_prompt(room_type, design_style, notes, parsed_info)
            
            # Step 3: Get response from Gemini
            response_text = self.gemini_client.generate_content(prompt)
            
            if not response_text:
                logger.error("No response from Gemini API")
                return self._create_fallback_response(room_type, design_style)
            
            # Step 4: Process response
            design_result = self.response_processor.process_design_response(
                response_text, room_type, design_style
            )
            
            logger.info("Design suggestion generated successfully")
            return design_result
            
        except Exception as e:
            logger.error(f"Error generating design suggestion: {str(e)}")
            return self._create_fallback_response(room_type, design_style)
    
    def _create_design_prompt(self, room_type: str, design_style: str, notes: str, parsed_info: Dict[str, Any]) -> str:
        """Create design prompt using centralized prompt management."""
        # Build additional context from parsed info
        additional_context = PromptUtils.build_additional_context(parsed_info)
        
        # Use centralized prompt template
        return GeminiPrompts.get_design_suggestion_prompt(
            room_type=room_type,
            design_style=design_style,
            notes=notes,
            additional_context=additional_context
        )
    
    def _create_fallback_response(self, room_type: str, design_style: str) -> Dict[str, Any]:
        """Create fallback response when API fails."""
        fallback_products = self._get_fallback_products(room_type, design_style)
        
        return {
            "title": f"{design_style} Tarzı {room_type} Tasarımı",
            "description": f"Bu {room_type.lower()} için {design_style.lower()} tarzında özel bir tasarım hazırladık. Modern ve şık unsurları birleştirerek, yaşam alanınızı daha konforlu hale getiren bir atmosfer oluşturduk.",
            "hashtags": {"en": [], "tr": [], "display": []},
            "product_suggestion": "Temel mobilya ve dekorasyon önerileri",
            "products": fallback_products,
            "raw_response": "Fallback response generated",
            "fallback": True
        }
    
    def _get_fallback_products(self, room_type: str, design_style: str) -> list:
        """Get basic fallback products for room type."""
        base_products = {
            "Living Room": [
                {"category": "Mobilyalar", "name": "Koltuk Takımı", "description": "Konforlu oturma grubu", "type": "product"},
                {"category": "Mobilyalar", "name": "Sehpa", "description": "Modern cam sehpa", "type": "product"},
                {"category": "Aydınlatma", "name": "Avize", "description": "Şık salon aydınlatması", "type": "product"}
            ],
            "Bedroom": [
                {"category": "Mobilyalar", "name": "Yatak", "description": "Konforlu çift kişilik yatak", "type": "product"},
                {"category": "Mobilyalar", "name": "Gardırop", "description": "Geniş dolap sistemi", "type": "product"},
                {"category": "Aydınlatma", "name": "Abajur", "description": "Yatak başı aydınlatması", "type": "product"}
            ],
            "Kitchen": [
                {"category": "Mobilyalar", "name": "Mutfak Dolabı", "description": "Modern mutfak dolap sistemi", "type": "product"},
                {"category": "Aydınlatma", "name": "Spot Aydınlatma", "description": "LED spot ışıklar", "type": "product"}
            ]
        }
        
        return base_products.get(room_type, base_products["Living Room"])
    
    async def save_design_hashtags(self, db: AsyncSession, design_id: str, hashtags: Dict[str, Any]) -> None:
        """
        Save design hashtags to database.
        Delegates to hashtag service for database operations.
        """
        try:
            english_hashtags = hashtags.get("en", [])
            turkish_hashtags = hashtags.get("tr", [])
            
            if english_hashtags:
                await self.hashtag_service.save_hashtags_to_db(
                    db, design_id, english_hashtags, turkish_hashtags
                )
                logger.info(f"Hashtags saved for design {design_id}")
            else:
                logger.warning(f"No hashtags to save for design {design_id}")
                
        except Exception as e:
            logger.error(f"Error saving hashtags for design {design_id}: {str(e)}")
            # Don't raise exception, hashtag saving is not critical

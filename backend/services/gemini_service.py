import google.generativeai as genai
from config.settings import Settings
from config import logger
from typing import Dict, Any, Optional
import json
import os

class GeminiService:
    """
    Service class for interaction with Google Gemini AI.
    Provides design suggestions and Function Calling-supported product suggestions according to PRD.
    """
    
    def __init__(self):
        self.settings = Settings()
        
        # Configure Gemini API
        genai.configure(api_key=self.settings.GEMINI_API_KEY)
        
        # Initialize model
        self.model = genai.GenerativeModel(
            model_name=self.settings.GENERATIVE_MODEL_NAME,
            generation_config={
                "temperature": 0.8,
                "top_p": 0.95,
                "top_k": 64,
                "max_output_tokens": 8192,
            }
        )
        
        logger.info("Gemini Service initialized")
    
    def generate_design_suggestion(self, room_type: str, design_style: str, notes: str) -> Dict[str, Any]:
        """
        Creates detailed design suggestion based on user's information.
        
        Args:
            room_type: Type of room (Living Room, Bedroom, etc.)
            design_style: Design style (Modern, Classic, etc.)
            notes: User's special requests
            
        Returns:
            Dict: Dictionary containing design title, description and product suggestion
        """
        
        # Prepare detailed and personalized prompt according to PRD
        prompt = self._create_design_prompt(room_type, design_style, notes)
        
        try:
            logger.info(f"Requesting design suggestion from Gemini: {room_type} - {design_style}")
            
            response = self.model.generate_content(prompt)
            
            if response.text:
                # Parse and structure the response
                design_result = self._parse_design_response(response.text, room_type, design_style)
                
                logger.info("Design suggestion successfully received from Gemini")
                return design_result
            else:
                logger.error("Empty response received from Gemini")
                return self._create_fallback_response(room_type, design_style, notes)
                
        except Exception as e:
            logger.error(f"Gemini service error: {str(e)}")
            return self._create_fallback_response(room_type, design_style, notes)
    
    def _create_design_prompt(self, room_type: str, design_style: str, notes: str) -> str:
        """
        Creates detailed design prompt according to PRD.
        """
        prompt = f"""
Sen bir uzman iç mimar ve dekorasyon danışmanısın. Türkiye'de yaşayan bir kullanıcı için kısa ve net tasarım önerisi hazırlayacaksın.

**Kullanıcı Bilgileri:**
- Oda Tipi: {room_type}
- Tasarım Stili: {design_style}
- Özel İstekler: {notes}

**Görevin:**
Aşağıdaki formatta tasarım önerisi hazırla:

**TASARIM BAŞLIĞI:** [Kısa ve çekici başlık]

**DETAYLI AÇIKLAMA:**
Bu {room_type.lower()} için {design_style.lower()} konsepti hakkında 2-3 cümle ile özet ver. Renk paleti ve genel atmosfer hakkında kısa bilgi ver.

**SATIN ALINMASI GEREKEN ÜRÜNLER:**
Bu odayı tamamlamak için satın alınması gereken TÜM ürünleri listele:

- Mobilyalar (koltuk, masa, dolap, yatak vb.)
- Aydınlatma ürünleri (avize, lamba, spot vb.)
- Dekoratif ürünler (halı, perde, yastık, tablo vb.)
- Aksesuar ve tamamlayıcı ürünler
- Diğer gerekli ürünler

Her ürün için kısa açıklama yap ve neden gerekli olduğunu belirt.

Yanıtını Türkçe, kısa ve net bir dille yaz. Gereksiz detaylara girme, doğrudan satın alınabilir ürünlere odaklan.
"""
        return prompt
    
    def _parse_design_response(self, response_text: str, room_type: str = "", design_style: str = "") -> Dict[str, Any]:
        """
        Parses and structures the response from Gemini.
        """
        try:
            parsed_content = self._extract_sections_from_response(response_text)
            
            # Fallback: If parsing fails, use entire text as description
            if not parsed_content["title"] and not parsed_content["description"]:
                parsed_content["title"] = f"{design_style} {room_type} Design"
                parsed_content["description"] = response_text
            
            return {
                "title": parsed_content["title"] or f"Custom {design_style} {room_type} Design",
                "description": parsed_content["description"] or response_text,
                "product_suggestion": parsed_content["product_suggestion"] or "Furniture suggestions suitable for the design",
                "raw_response": response_text
            }
            
        except Exception as e:
            logger.error(f"Response parsing error: {str(e)}")
            return self._create_error_response(response_text, room_type, design_style)
    
    def _extract_sections_from_response(self, response_text: str) -> Dict[str, str]:
        """Extracts sections from response."""
        lines = response_text.split('\n')
        sections = {"title": "", "description": "", "product_suggestion": ""}
        current_section = ""
        
        for line in lines:
            line = line.strip()
            if not line:
                continue
                
            if "TASARIM BAŞLIĞI" in line.upper() or "BAŞLIK" in line.upper():
                current_section = "title"
                sections["title"] = line.split(':')[-1].strip() if ':' in line else line
            elif "DETAYLI AÇIKLAMA" in line.upper() or "AÇIKLAMA" in line.upper():
                current_section = "description"
            elif "SATINALINMASI GEREKEN" in line.upper() or "ÜRÜN" in line.upper() or "ÜRÜNLER" in line.upper():
                current_section = "product_suggestion"
            elif current_section == "title" and not sections["title"]:
                sections["title"] = line
            elif current_section == "description":
                sections["description"] += line + "\n"
            elif current_section == "product_suggestion":
                sections["product_suggestion"] += line + "\n"
        
        return sections
    
    def _create_error_response(self, response_text: str, room_type: str, design_style: str) -> Dict[str, Any]:
        """Creates response for error situations."""
        return {
            "title": f"Özel {design_style} {room_type} Tasarımı",
            "description": "Tasarım konsepti hazırlanırken teknik bir sorun oluştu.",
            "product_suggestion": "Temel mobilya ve dekor önerileri",
            "raw_response": response_text
        }
    
    def _create_fallback_response(self, room_type: str, design_style: str, notes: str = "") -> Dict[str, Any]:
        """
        Creates fallback response when there's an error in Gemini service.
        """
        return {
            "title": f"Özel {design_style} {room_type} Tasarımı",
            "description": f"Bu {room_type.lower()} için {design_style.lower()} tarzında özel tasarım konsepti hazırlanıyor. Renk uyumu ve fonksiyonel çözümler öncelikli olacak.",
            "product_suggestion": f"""
• Ana mobilyalar: {design_style} tarzına uygun temel mobilyalar
• Aydınlatma: Uygun avize ve lambalar  
• Dekoratif ürünler: Halı, perde, yastık seti
• Aksesuar: Tamamlayıcı dekor ürünleri
            """.strip(),
            "raw_response": "Fallback response - Gemini servisi geçici olarak kullanılamıyor"
        }

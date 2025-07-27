import google.generativeai as genai
from config.settings import Settings
from config import logger
from typing import Dict, Any, Optional, List
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
                return self._create_fallback_response(room_type, design_style)
                
        except Exception as e:
            logger.error(f"Gemini service error: {str(e)}")
            return self._create_fallback_response(room_type, design_style)
    
    def _create_design_prompt(self, room_type: str, design_style: str, notes: str) -> str:
        """
        Creates detailed design prompt according to PRD.
        """
        prompt = f"""
Sen bir uzman iç mimar ve dekorasyon danışmanısın. Türkiye'de yaşayan bir kullanıcı için tasarım önerisi hazırlayacaksın.

**Kullanıcı Bilgileri:**
- Oda Tipi: {room_type}
- Tasarım Stili: {design_style}
- Özel İstekler: {notes}

**ÖNEMLİ:** Cevabını mutlaka aşağıdaki JSON formatında ver. Başka hiçbir metin ekleme, sadece JSON:

{{
  "title": "Tasarım başlığı (maksimum 60 karakter)",
  "description": "Bu tasarım hakkında detaylı açıklama. Renk paleti, atmosfer, stil özellikleri hakkında bilgi ver.",
  "products": [
    {{
      "category": "Kategori adı",
      "name": "Ürün adı",
      "description": "Ürün detayları ve neden önerildiği"
    }},
    {{
      "category": "Kategori adı",
      "name": "Ürün adı",
      "description": "Ürün detayları ve neden önerildiği"
    }}
  ]
}}

**Format Kuralları:**
- "title": Kısa ve çekici başlık (maksimum 60 karakter)
- "description": Tasarım konsepti hakkında kapsamlı açıklama (2-4 cümle)
- "products": Ürün listesi array'i
  - "category": Ürün kategorisi (örn: "Mobilyalar", "Aydınlatma", "Tekstil", "Dekoratif Objeler" vs.)
  - "name": Ürün adı (maksimum 40 karakter)
  - "description": Ürün açıklaması (maksimum 120 karakter)

**Önemli:**
- İstediğin kategorileri kullanabilirsin, sınırlama yok
- Kaç ürün önereceğin sana kalmış (önerilen: 6-12 ürün)
- Sadece JSON formatında cevap ver, başka hiçbir metin ekleme
- Kullanıcının özel isteklerini dikkate al
"""
        return prompt
    
    def _parse_design_response(self, response_text: str, room_type: str = "", design_style: str = "") -> Dict[str, Any]:
        """
        Parses and structures the response from Gemini.
        Now expects JSON format from updated prompt.
        """
        try:
            # First try to parse as JSON (new format)
            response_text = response_text.strip()
            
            # Remove any markdown code blocks if present
            if response_text.startswith('```json'):
                response_text = response_text[7:]
            if response_text.startswith('```'):
                response_text = response_text[3:]
            if response_text.endswith('```'):
                response_text = response_text[:-3]
            
            response_text = response_text.strip()
            
            try:
                json_response = json.loads(response_text)
                
                # Validate required fields
                if 'title' in json_response and 'description' in json_response and 'products' in json_response:
                    # Add type field to products if missing
                    products = json_response['products']
                    for product in products:
                        if 'type' not in product:
                            product['type'] = 'product'
                    
                    # Create product_suggestion text for backward compatibility
                    product_suggestion = self._create_product_suggestion_text(products)
                    
                    return {
                        "title": json_response['title'],
                        "description": json_response['description'],
                        "product_suggestion": product_suggestion,
                        "products": products,
                        "raw_response": response_text
                    }
                    
            except json.JSONDecodeError:
                logger.warning("JSON parsing failed, falling back to text parsing")
            
            # Fallback to old text parsing method
            parsed_content = self._extract_sections_from_response(response_text)
            
            # Parse product suggestions into structured format (old method)
            products = self._parse_product_suggestions(parsed_content["product_suggestion"])
            
            return {
                "title": parsed_content["title"] or f"Custom {design_style} {room_type} Design",
                "description": parsed_content["description"] or response_text,
                "product_suggestion": parsed_content["product_suggestion"] or "Furniture suggestions suitable for the design",
                "products": products,
                "raw_response": response_text
            }
            
        except Exception as e:
            logger.error(f"Response parsing error: {str(e)}")
            return self._create_error_response(response_text, room_type, design_style)
    
    def _create_product_suggestion_text(self, products: List[Dict[str, str]]) -> str:
        """
        Creates product suggestion text from products array for backward compatibility.
        """
        if not products:
            return "Ürün önerileri mevcut değil."
        
        # Group products by category
        categories = {}
        for product in products:
            category = product.get('category', 'Genel')
            if category not in categories:
                categories[category] = []
            categories[category].append(product)
        
        # Build text format
        suggestion_text = ""
        for category, category_products in categories.items():
            suggestion_text += f"- {category}\n"
            for product in category_products:
                suggestion_text += f"  • {product.get('name', 'Ürün')} - {product.get('description', 'Açıklama yok')}\n"
            suggestion_text += "\n"
        
        return suggestion_text.strip()
    
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
    
    def _parse_product_suggestions(self, product_text: str) -> List[Dict[str, str]]:
        """
        Parses product suggestions from text to structured JSON format.
        
        Args:
            product_text: Raw product suggestions text from Gemini
            
        Returns:
            List of structured product information
        """
        if not product_text or not product_text.strip():
            return []
            
        products = []
        lines = product_text.split('\n')
        current_category = "Genel"
        
        # Category keywords for better detection
        category_keywords = {
            'mobilya': 'Mobilyalar',
            'aydınlatma': 'Aydınlatma', 
            'dekoratif': 'Dekoratif Ürünler',
            'aksesuar': 'Aksesuarlar',
            'halı': 'Dekoratif Ürünler',
            'perde': 'Dekoratif Ürünler'
        }
        
        for line in lines:
            line = line.strip()
            if not line or len(line) < 3:
                continue
                
            # Skip section headers like "SATIN ALINMASI GEREKEN ÜRÜNLER:"
            if line.upper().startswith('SATIN') or line.upper().startswith('**'):
                continue
                
            # Check if this is a main category line
            line_lower = line.lower().strip(' -•*:')
            is_category = False
            
            # Check for category keywords
            for keyword, category_name in category_keywords.items():
                if keyword in line_lower and len(line) < 30:
                    current_category = category_name
                    is_category = True
                    break
            
            # Skip if it's just a category header
            if is_category:
                continue
                
            # Extract product if line contains bullet points or dashes
            if line.startswith(('•', '-', '*')) or '(' in line:
                product = self._extract_product_from_line(line, current_category)
                if product and len(product['name']) > 2:
                    products.append(product)
        
        return products
    
    def _extract_product_from_line(self, line: str, category: str) -> Optional[Dict[str, str]]:
        """Extract product information from a single line."""
        if not line.startswith(('-', '•', '*')) and not any(char in line for char in ['-', '(', ':']):
            return None
        
        # Clean the line
        product_info = line.strip(' -•*').strip()
        if not product_info or len(product_info) < 3:
            return None
        
        # Extract name and description
        name = product_info
        description = product_info
        
        # Handle different formats
        if '(' in product_info and ')' in product_info:
            # Format: "Product (description)"
            name = product_info.split('(')[0].strip()
            description = product_info
        elif ':' in product_info:
            # Format: "Product: description"
            parts = product_info.split(':', 1)
            name = parts[0].strip()
            description = product_info
        elif '-' in product_info:
            # Format: "Product - description"
            parts = product_info.split('-', 1)
            name = parts[0].strip()
            description = product_info
        
        return {
            "category": category,
            "name": name,
            "description": description,
            "type": "product"
        }
    
    def _create_error_response(self, response_text: str, room_type: str, design_style: str) -> Dict[str, Any]:
        """Creates response for error situations."""
        fallback_products = self._get_fallback_products(room_type, design_style)
        
        return {
            "title": f"Özel {design_style} {room_type} Tasarımı",
            "description": "Tasarım konsepti hazırlanırken teknik bir sorun oluştu.",
            "product_suggestion": "Temel mobilya ve dekor önerileri",
            "products": fallback_products,
            "raw_response": response_text
        }
    
    def _create_fallback_response(self, room_type: str, design_style: str) -> Dict[str, Any]:
        """
        Creates fallback response when there's an error in Gemini service.
        """
        fallback_products = self._get_fallback_products(room_type, design_style)
        
        product_suggestion = f"""
• Ana mobilyalar: {design_style} tarzına uygun temel mobilyalar
• Aydınlatma: Uygun avize ve lambalar  
• Dekoratif ürünler: Halı, perde, yastık seti
• Aksesuar: Tamamlayıcı dekor ürünleri
        """.strip()
        
        return {
            "title": f"Özel {design_style} {room_type} Tasarımı",
            "description": f"Bu {room_type.lower()} için {design_style.lower()} tarzında özel tasarım konsepti hazırlanıyor. Renk uyumu ve fonksiyonel çözümler öncelikli olacak.",
            "product_suggestion": product_suggestion,
            "products": fallback_products,
            "raw_response": "Fallback response - Gemini servisi geçici olarak kullanılamıyor"
        }
    
    def _get_fallback_products(self, room_type: str, design_style: str) -> List[Dict[str, str]]:
        """
        Creates fallback product list when Gemini service fails.
        """
        return [
            {
                "category": "Mobilyalar",
                "name": f"{design_style} tarzı temel mobilyalar",
                "description": f"{room_type} için uygun temel mobilya parçaları",
                "type": "product"
            },
            {
                "category": "Aydınlatma", 
                "name": "Uygun avize ve lambalar",
                "description": "Ortam aydınlatması için gerekli ürünler",
                "type": "product"
            },
            {
                "category": "Dekoratif Ürünler",
                "name": "Halı, perde, yastık seti",
                "description": "Odayı tamamlayan dekoratif ürünler",
                "type": "product"
            },
            {
                "category": "Aksesuarlar",
                "name": "Tamamlayıcı dekor ürünleri",
                "description": "Tasarımı destekleyici aksesuar parçaları",
                "type": "product"
            }
        ]

"""
ResponseProcessor - Processes and parses Gemini AI responses.
KISS principle: Single responsibility for response processing.
"""
from typing import Dict, Any, List, Optional
import json
import re
from config import logger
from .hashtag_service import HashtagService


class ResponseProcessor:
    """
    Simple processor for Gemini AI responses.
    Handles JSON parsing and fallback text parsing.
    """
    
    # Constants to avoid duplication
    CATEGORY_LIGHTING = "Aydınlatma"
    CATEGORY_DECORATIVE = "Dekoratif Ürünler"
    CATEGORY_FURNITURE = "Mobilyalar"
    CATEGORY_ACCESSORIES = "Aksesuarlar"
    
    def __init__(self):
        self.hashtag_service = HashtagService()
    
    def process_design_response(self, response_text: str, room_type: str = "", design_style: str = "") -> Dict[str, Any]:
        """
        Process Gemini response into structured format.
        
        Args:
            response_text: Raw response from Gemini
            room_type: Room type for fallback
            design_style: Design style for fallback
            
        Returns:
            Dict: Structured design response
        """
        try:
            # Try JSON parsing first (preferred format)
            json_result = self._try_json_parsing(response_text)
            if json_result:
                return json_result
            
            # Fallback to text parsing
            logger.warning("JSON parsing failed, using text parsing")
            return self._parse_text_response(response_text, room_type, design_style)
            
        except Exception as e:
            logger.error(f"Response processing error: {str(e)}")
            return self._create_error_response(response_text, room_type, design_style)
    
    def _try_json_parsing(self, response_text: str) -> Optional[Dict[str, Any]]:
        """Try to parse response as JSON."""
        try:
            # Clean markdown formatting
            cleaned_text = self._clean_json_response(response_text)
            
            json_response = json.loads(cleaned_text)
            
            # Validate required fields
            if not all(key in json_response for key in ['title', 'description', 'products']):
                return None
            
            # Process products
            products = self._process_products(json_response['products'])
            
            # Process hashtags
            hashtags = self._process_hashtags(json_response.get('hashtags', []))
            
            # Create product suggestion text for compatibility
            product_suggestion = self._create_product_suggestion_text(products)
            
            return {
                "title": json_response['title'],
                "description": json_response['description'],
                "hashtags": hashtags,
                "product_suggestion": product_suggestion,
                "products": products,
                "raw_response": response_text
            }
            
        except json.JSONDecodeError:
            return None
    
    def _clean_json_response(self, response_text: str) -> str:
        """Clean JSON response from markdown formatting."""
        cleaned = response_text.strip()
        
        # Remove markdown code blocks
        if cleaned.startswith('```json'):
            cleaned = cleaned[7:]
        elif cleaned.startswith('```'):
            cleaned = cleaned[3:]
        
        if cleaned.endswith('```'):
            cleaned = cleaned[:-3]
        
        return cleaned.strip()
    
    def _process_products(self, products: List[Dict]) -> List[Dict[str, str]]:
        """Process and validate products."""
        processed_products = []
        
        for product in products:
            if isinstance(product, dict):
                # Add type field if missing
                if 'type' not in product:
                    product['type'] = 'product'
                processed_products.append(product)
        
        return processed_products
    
    def _process_hashtags(self, hashtags: List[str]) -> Dict[str, Any]:
        """Process and validate hashtags."""
        if not hashtags or len(hashtags) != 10:
            logger.warning(f"Invalid hashtags received: {hashtags}. Expected 10 hashtags.")
            return {"en": [], "tr": [], "display": []}
        
        # Validate and clean hashtags
        validated_hashtags = []
        for tag in hashtags:
            if not tag.startswith('#'):
                tag = '#' + tag
            # Clean up formatting
            tag = tag.lower().replace(' ', '_').replace('-', '_')
            validated_hashtags.append(tag)
        
        # Translate hashtags
        return self.hashtag_service.translate_hashtags(validated_hashtags)
    
    def _parse_text_response(self, response_text: str, room_type: str, design_style: str) -> Dict[str, Any]:
        """Fallback text parsing for non-JSON responses."""
        parsed_content = self._extract_sections_from_text(response_text)
        products = self._parse_product_suggestions(parsed_content.get("product_suggestion", ""))
        
        return {
            "title": parsed_content.get("title") or f"Custom {design_style} {room_type} Design",
            "description": parsed_content.get("description") or response_text,
            "hashtags": {"en": [], "tr": [], "display": []},
            "product_suggestion": parsed_content.get("product_suggestion") or "Furniture suggestions suitable for the design",
            "products": products,
            "raw_response": response_text
        }
    
    def _extract_sections_from_text(self, response_text: str) -> Dict[str, str]:
        """Extract sections from unstructured text."""
        lines = response_text.split('\n')
        sections = {"title": "", "description": "", "product_suggestion": ""}
        current_section = ""
        
        for line in lines:
            line = line.strip()
            if not line:
                continue
            
            # Detect section headers
            if any(keyword in line.upper() for keyword in ["TASARIM BAŞLIĞI", "BAŞLIK"]):
                current_section = "title"
                sections["title"] = line.split(':')[-1].strip() if ':' in line else line
            elif any(keyword in line.upper() for keyword in ["DETAYLI AÇIKLAMA", "AÇIKLAMA"]):
                current_section = "description"
            elif any(keyword in line.upper() for keyword in ["SATINALINMASI GEREKEN", "ÜRÜN"]):
                current_section = "product_suggestion"
            elif current_section == "title" and not sections["title"]:
                sections["title"] = line
            elif current_section == "description":
                sections["description"] += line + "\n"
            elif current_section == "product_suggestion":
                sections["product_suggestion"] += line + "\n"
        
        return sections
    
    def _parse_product_suggestions(self, product_text: str) -> List[Dict[str, str]]:
        """Parse product suggestions from text."""
        if not product_text or not product_text.strip():
            return []
        
        products = []
        lines = product_text.split('\n')
        current_category = "Genel"
        
        category_keywords = {
            'mobilya': self.CATEGORY_FURNITURE,
            'aydınlatma': self.CATEGORY_LIGHTING,
            'dekoratif': self.CATEGORY_DECORATIVE,
            'aksesuar': self.CATEGORY_ACCESSORIES,
            'halı': self.CATEGORY_DECORATIVE,
            'perde': self.CATEGORY_DECORATIVE
        }
        
        for line in lines:
            line = line.strip()
            if not line or len(line) < 3:
                continue
            
            # Skip headers
            if line.upper().startswith('SATIN') or line.upper().startswith('**'):
                continue
            
            # Check for category
            line_lower = line.lower().strip(' -•*:')
            is_category = False
            
            for keyword, category_name in category_keywords.items():
                if keyword in line_lower and len(line) < 30:
                    current_category = category_name
                    is_category = True
                    break
            
            if is_category:
                continue
            
            # Extract product
            if line.startswith(('•', '-', '*')) or '(' in line:
                product = self._extract_product_from_line(line, current_category)
                if product and len(product['name']) > 2:
                    products.append(product)
        
        return products
    
    def _extract_product_from_line(self, line: str, category: str) -> Optional[Dict[str, str]]:
        """Extract product information from a single line."""
        # Clean the line
        line = line.strip(' -•*')
        
        # Simple extraction logic
        if '(' in line and ')' in line:
            # Format: "Product Name (description)"
            parts = line.split('(', 1)
            name = parts[0].strip()
            description = parts[1].rstrip(')').strip()
        elif ':' in line:
            # Format: "Product Name: description"
            parts = line.split(':', 1)
            name = parts[0].strip()
            description = parts[1].strip()
        else:
            # Just product name
            name = line.strip()
            description = f"{category} ürünü"
        
        if len(name) > 2:
            return {
                'category': category,
                'name': name,
                'description': description,
                'type': 'product'
            }
        
        return None
    
    def _create_product_suggestion_text(self, products: List[Dict[str, str]]) -> str:
        """Create product suggestion text from products list."""
        if not products:
            return "Ürün önerileri mevcut değil."
        
        # Group by category
        categories = {}
        for product in products:
            category = product.get('category', 'Genel')
            if category not in categories:
                categories[category] = []
            categories[category].append(product)
        
        # Build text
        text_parts = []
        for category, category_products in categories.items():
            text_parts.append(f"- {category}")
            for product in category_products:
                name = product.get('name', 'Ürün')
                desc = product.get('description', 'Açıklama yok')
                text_parts.append(f"  • {name} - {desc}")
            text_parts.append("")
        
        return "\n".join(text_parts).strip()
    
    def _create_error_response(self, response_text: str, room_type: str, design_style: str) -> Dict[str, Any]:
        """Create error response."""
        return {
            "title": f"Tasarım Önerileri - {design_style} {room_type}",
            "description": "Geçici bir hata nedeniyle özel tasarım önerileri oluşturulamadı. Lütfen tekrar deneyin.",
            "hashtags": {"en": [], "tr": [], "display": []},
            "product_suggestion": "Ürün önerileri şu anda mevcut değil.",
            "products": [],
            "raw_response": response_text,
            "error": True
        }

"""
NotesParser - FINAL OPTIMIZED VERSION for minimal note parsing.

DRASTICALLY SIMPLIFIED: Frontend now handles ALL structured data input.

COMPLETELY REMOVED:
- Room dimensions parsing (frontend: width/length/height inputs)
- Color palette parsing (frontend: ColorPalette component)  
- Product category parsing (frontend: ProductCategorySelector)
- Extra areas/blocks parsing (not available in frontend)
- Door/window position parsing (not available in frontend)

ONLY REMAINING FUNCTIONALITY:
- Special keyword detection from free-form text (pet-friendly, minimal, luxury, etc.)
- Raw notes preservation for AI context
- Simple preference analysis

This represents a 90% reduction in parsing complexity, perfectly aligned 
with the current frontend architecture that provides structured inputs.

KISS principle: Minimal responsibility for maximum efficiency.
"""
from typing import Dict, Any
import json
import re
from config import logger


class NotesParser:
    """
    Minimal parser for user notes - FINAL OPTIMIZED VERSION.
    
    CURRENT SCOPE: Only parses special keywords from simple free-form text.
    
    Frontend now provides ALL structured data:
    ✅ Room dimensions (width/length/height) 
    ✅ Color information (colorPalette component)
    ✅ Product categories (ProductCategorySelector)
    ✅ Room type & design style (dropdowns)
    
    This parser only handles:
    🔍 Special keyword detection (pet-friendly, minimal, luxury, etc.)
    🔍 User preference analysis from textarea notes
    🔍 Raw notes preservation for context
    
    REMOVED (no longer needed):
    ❌ Extra areas/blocks parsing (not in frontend)
    ❌ Door/window position parsing (not in frontend)  
    ❌ Color/dimension parsing (handled by frontend)
    ❌ Product category parsing (handled by frontend)
    
    Ultra-focused, efficient, and aligned with frontend architecture.
    """
    
    @staticmethod
    def parse_notes(notes: str) -> Dict[str, Any]:
        """
        Parse notes to extract structured information.
        
        FINAL OPTIMIZED VERSION: Frontend now provides ALL structured data.
        This parser only handles simple free-form text analysis for special keywords.
        
        Frontend provides: colors, dimensions, product categories, room/style types
        This parser focuses on: special keywords and user preferences from free text
        
        Args:
            notes: Raw notes string (simple textarea input)
            
        Returns:
            Dict: Minimal parsed information focusing on special requests only
        """
        parsed_info = {
            'special_requests': [],
            'keywords': [],
            'raw_notes': notes.strip() if notes else None
        }
        
        if not notes or not isinstance(notes, str) or not notes.strip():
            return parsed_info
        
        try:
            # Store raw notes for context
            parsed_info['raw_notes'] = notes.strip()
            
            # Parse special keywords and preferences from free text
            NotesParser._parse_special_keywords(notes, parsed_info)
            
            return parsed_info
            
        except Exception as e:
            logger.error(f"Error parsing notes: {str(e)}")
            return parsed_info
    
    @staticmethod
    def _parse_special_keywords(notes: str, parsed_info: Dict[str, Any]) -> None:
        """
        Parse special keywords and preferences from free-form text.
        Focuses on style preferences, accessibility needs, and special requirements.
        """
        notes_lower = notes.lower()
        
        # Comprehensive keyword mapping for better recognition
        keyword_mapping = {
            # Accessibility & Special Needs
            'pet': ['pet-friendly', 'evcil hayvan', 'kedi', 'köpek', 'pet friendly'],
            'child': ['çocuk dostu', 'child friendly', 'kid friendly', 'bebek', 'çocuk güvenliği'],
            'elderly': ['yaşlı dostu', 'elderly friendly', 'yaşlı', 'engel'],
            'accessibility': ['engelli erişimi', 'wheelchair', 'tekerlekli sandalye', 'accessibility'],
            
            # Style Preferences  
            'minimalist': ['minimal', 'minimalist', 'sade', 'basit'],
            'luxury': ['lüks', 'luxury', 'premium', 'pahalı'],
            'budget': ['budget', 'bütçe', 'ekonomik', 'ucuz'],
            'vintage': ['vintage', 'retro', 'antika', 'eski'],
            'natural': ['doğal', 'natural', 'organic', 'ahşap'],
            'smart': ['smart home', 'akıllı ev', 'teknolojik', 'otomatik'],
            
            # Lighting & Atmosphere
            'bright': ['aydınlık', 'parlak', 'bright', 'ışıklı'],
            'cozy': ['sıcak', 'cozy', 'samimi', 'rahatlık'],
            'spacious': ['ferah', 'geniş', 'spacious', 'açık'],
            
            # Environmental
            'quiet': ['sessiz', 'quiet', 'sakin', 'huzurlu'],
            'functional': ['fonksiyonel', 'practical', 'kullanışlı']
        }
        
        found_keywords = []
        found_requests = []
        
        # Search for keywords in the text
        for category, keywords in keyword_mapping.items():
            for keyword in keywords:
                if keyword in notes_lower:
                    found_keywords.append(category)
                    found_requests.append({
                        'category': category,
                        'keyword': keyword,
                        'context': notes[:200]  # First 200 chars for context
                    })
                    break  # Only count each category once
        
        # Remove duplicates while preserving order
        parsed_info['keywords'] = list(dict.fromkeys(found_keywords))
        parsed_info['special_requests'] = found_requests
        
        # Log findings for debugging
        if found_keywords:
            logger.info(f"🏷️ Special keywords found: {', '.join(found_keywords)}")
        else:
            logger.info("📝 No special keywords found in notes")

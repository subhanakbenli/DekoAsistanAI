"""
Hashtag translation and management service.
"""
from typing import List, Dict, Any
from config import logger

class HashtagService:
    """
    Service for hashtag translation and management.
    Handles English-to-Turkish hashtag mapping for better user experience.
    """
    
    # English to Turkish hashtag mapping
    HASHTAG_TRANSLATIONS = {
        # General Categories
        "#interior_design": "#ic_tasarim",
        "#home_decor": "#ev_dekorasyonu", 
        "#room_design": "#oda_tasarimi",
        
        # Styles
        "#modern": "#modern",
        "#contemporary": "#cagdas",
        "#classic": "#klasik",
        "#traditional": "#geleneksel",
        "#minimalist": "#minimalist",
        "#industrial": "#endustriyel",
        "#scandinavian": "#iskandinavya",
        "#rustic": "#rustik",
        "#vintage": "#vintage",
        "#bohemian": "#bohem",
        "#art_deco": "#art_deco",
        "#mediterranean": "#akdeniz",
        "#nordic": "#kuzey",
        
        # Room Types
        "#living_room": "#oturma_odasi",
        "#bedroom": "#yatak_odasi",
        "#kitchen": "#mutfak",
        "#bathroom": "#banyo",
        "#dining_room": "#yemek_odasi",
        "#office": "#ofis",
        "#study_room": "#calisma_odasi",
        "#guest_room": "#misafir_odasi",
        "#kids_room": "#cocuk_odasi",
        "#master_bedroom": "#ana_yatak_odasi",
        
        # Colors
        "#neutral_tones": "#notr_tonlar",
        "#warm_colors": "#sicak_renkler",
        "#cool_colors": "#soguk_renkler",
        "#monochrome": "#tek_renk",
        "#colorful": "#renkli",
        "#pastel": "#pastel",
        "#earth_tones": "#toprak_tonlari",
        "#bold_colors": "#cesur_renkler",
        
        # Atmosphere
        "#cozy": "#rahat",
        "#elegant": "#sik",
        "#luxurious": "#luks",
        "#comfortable": "#konforlu",
        "#relaxing": "#rahatlatici",
        "#energetic": "#enerjik",
        "#peaceful": "#huzurlu",
        "#dramatic": "#dramatik",
        "#romantic": "#romantik",
        "#sophisticated": "#sofistike",
        
        # Space Characteristics
        "#spacious": "#ferah",
        "#compact": "#kompakt",
        "#open_plan": "#acik_plan",
        "#bright": "#aydinlik",
        "#dark": "#karanlik",
        "#airy": "#havadar",
        "#intimate": "#samimi",
        
        # Lighting
        "#natural_light": "#dogal_isik",
        "#ambient_lighting": "#ortam_aydinlatmasi",
        "#task_lighting": "#gorev_aydinlatmasi",
        "#accent_lighting": "#vurgu_aydinlatmasi",
        "#soft_lighting": "#yumusak_isik",
        
        # Materials
        "#wood": "#ahsap",
        "#metal": "#metal",
        "#glass": "#cam",
        "#stone": "#tas",
        "#fabric": "#kumas",
        "#leather": "#deri",
        "#marble": "#mermer",
        "#concrete": "#beton",
        "#ceramic": "#seramik",
        "#velvet": "#kadife",
        
        # Furniture Types
        "#furniture": "#mobilya",
        "#seating": "#oturma",
        "#storage": "#depolama",
        "#tables": "#masalar",
        "#lighting": "#aydinlatma",
        "#textiles": "#tekstil",
        "#accessories": "#aksesuarlar",
        
        # Features
        "#functional": "#fonksiyonel",
        "#decorative": "#dekoratif",
        "#artistic": "#sanatsal",
        "#ergonomic": "#ergonomik",
        "#sustainable": "#surdurulebilir",
        "#smart_home": "#akilli_ev",
        "#eco_friendly": "#cevre_dostu",
        
        # Specific Design Elements
        "#geometric": "#geometrik",
        "#floral": "#cicekli",
        "#striped": "#cizgili",
        "#textured": "#dokulu",
        "#glossy": "#parlak",
        "#matte": "#mat",
        "#patterned": "#desenli",
        "#solid": "#duz"
    }
    
    def __init__(self):
        """Initialize hashtag service."""
        pass
    
    def translate_hashtags(self, english_hashtags: List[str]) -> Dict[str, Any]:
        """
        Translate English hashtags to Turkish.
        
        Args:
            english_hashtags: List of English hashtags
            
        Returns:
            Dict containing both English and Turkish hashtags
        """
        turkish_hashtags = []
        unknown_hashtags = []
        
        for hashtag in english_hashtags:
            # Ensure hashtag starts with #
            if not hashtag.startswith('#'):
                hashtag = '#' + hashtag
            
            # Get Turkish translation, fallback to original if not found
            if hashtag in self.HASHTAG_TRANSLATIONS:
                turkish_version = self.HASHTAG_TRANSLATIONS[hashtag]
            else:
                turkish_version = hashtag  # Keep English as fallback
                unknown_hashtags.append(hashtag)
            
            turkish_hashtags.append(turkish_version)
        
        # Log unknown hashtags for future mapping (only in debug mode)
        if unknown_hashtags:
            logger.debug(f"Unknown hashtags found (kept as English): {unknown_hashtags}")
            logger.debug(f"Consider adding these to HASHTAG_TRANSLATIONS mapping")
        
        return {
            "en": english_hashtags,
            "tr": turkish_hashtags,
            "display": turkish_hashtags,  # Default display language is Turkish (with English fallbacks)
            "unknown": unknown_hashtags  # For analytics/tracking
        }
    
    def get_all_hashtag_mappings(self) -> Dict[str, str]:
        """
        Get all hashtag mappings for frontend use.
        
        Returns:
            Dictionary of English to Turkish hashtag mappings
        """
        return self.HASHTAG_TRANSLATIONS.copy()
    
    def add_hashtag_mapping(self, english: str, turkish: str) -> None:
        """
        Add new hashtag mapping (for future dynamic additions).
        
        Args:
            english: English hashtag
            turkish: Turkish hashtag
        """
        if not english.startswith('#'):
            english = '#' + english
        if not turkish.startswith('#'):
            turkish = '#' + turkish
        
        self.HASHTAG_TRANSLATIONS[english] = turkish
    
    def search_hashtags(self, query: str, language: str = "both") -> List[str]:
        """
        Search hashtags by partial match.
        
        Args:
            query: Search query
            language: "en", "tr", or "both"
            
        Returns:
            List of matching hashtags
        """
        query = query.lower()
        matches = []
        
        for en_tag, tr_tag in self.HASHTAG_TRANSLATIONS.items():
            if language == "en" or language == "both":
                if query in en_tag.lower():
                    matches.append(en_tag)
            
            if language == "tr" or language == "both":
                if query in tr_tag.lower():
                    matches.append(tr_tag)
        
        return list(set(matches))  # Remove duplicates

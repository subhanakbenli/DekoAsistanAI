"""
Gemini AI prompt templates and utilities.
Centralized prompt management for design generation.
"""

import json
from config import logger

class GeminiPrompts:
    """
    Gemini AI prompt templates for design generation
    """
    
    @staticmethod
    def get_design_suggestion_prompt(room_type: str, design_style: str, notes: str, additional_context: str = "") -> str:
        """
        Generate design suggestion prompt for legacy system.
        
        Returns: Formatted prompt string for Gemini AI
        """
        return f"""
You are a residential interior architect and home decoration expert. You will prepare a design suggestion for a **RESIDENTIAL HOME ROOM** for a family/person living in Turkey.

**HOME INFORMATION:**
- Home Room Type: {room_type} (this is a residential/home room - not a hotel, office or restaurant)
- Design Style: {design_style}
{additional_context}- Special Requests: {notes}

**IMPORTANT RESIDENTIAL RULES:**
- This is an interior design for a HOME/RESIDENCE - not a commercial space
- It must suit family life and focus on home comfort
- You will design a livable, functional home room
- Salon = Sitting room/living room (not a wedding hall!)

**IMPORTANT:** You must give your answer in the JSON format below. Do not add any other text, only JSON. Write all text values in English:

{{
  "title": "Home room design title (maximum 60 characters)",
  "description": "A detailed description of this residential room design. Give information about the color palette suited to home life, the family atmosphere and the residential style features. Also take into account the user's color preferences and home product categories.",
  "hashtags": ["#interior_design", "#home_design", "#living_room", "#neutral_colors", "#family_friendly", "#cozy", "#functional", "#natural_light", "#comfortable", "#warm_atmosphere"],
  "products": [
    {{
      "category": "Home Furniture",
      "name": "Home product name",
      "description": "Product details suited to home life and why it is recommended for the home"
    }},
    {{
      "category": "Home Textiles",
      "name": "Home product name", 
      "description": "Product details suited to family life"
    }}
  ]
}}

**Format Rules:**
- "title": A short and catchy **HOME ROOM** title (maximum 60 characters)
- "description": A comprehensive description of the **RESIDENTIAL ROOM** design concept (2-4 sentences). Emphasize home life and family comfort. Include the user's chosen color palette and home product preferences in the description.
- "hashtags": A list of EXACTLY 10 ENGLISH-ONLY hashtags - ORDERED FROM GENERAL TO SPECIFIC
  - Must start with # (e.g. "#interior_design", "#living_room", "#family_home")
  - Use snake_case (e.g. "#living_room", "#neutral_colors", "#family_friendly")
  - Use ONLY English words
  - The first hashtag must be #interior_design or #home_design
  - Order: from the most general category to the most specific detail
  - Reflect the color preferences in the hashtags too (e.g. "#warm_colors", "#neutral_tones")
  - Example order: #interior_design, #modern, #living_room, #neutral_tones, #family_friendly, #cozy, #functional, #natural_light, #comfortable, #home_design
- "products": Array of **HOME PRODUCTS** - Focus on the home product categories selected by the user
  - "category": Home product category (e.g. "Home Furniture", "Home Lighting", "Home Textiles", "Home Decorative Objects" etc.)
  - "name": Home product name (maximum 40 characters)
  - "description": Home product description (maximum 120 characters) - State its suitability for home life and its harmony with the color palette

**Hashtag Examples:**
- General: #interior_design, #home_design, #family_home, #residential_design
- Style: #modern_home, #classic_home, #contemporary_home, #minimalist_home, #scandinavian_home
- Room: #living_room, #home_bedroom, #family_kitchen, #home_bathroom, #study_room
- Color: #neutral_home, #warm_home_colors, #cool_home_tones, #relaxing_colors, #family_friendly_colors
- Atmosphere: #cozy_home, #stylish_home, #comfortable_living, #family_comfort, #home_warmth
- Material: #home_wood, #home_materials, #family_safe_materials
- Features: #airy_home, #compact_living, #bright_home, #functional_family, #comfortable_home

**Important:**
- Create EXACTLY 10 ENGLISH-ONLY hashtags, no fewer and no more
- The first hashtag must be #interior_design or #home_design
- Hashtag order: start from the most general home category and end with the most specific home details
- Prioritize the user's chosen color palette and home product categories
- Reflect the color preferences in both the description and the hashtags in the context of home life
- Only suggest products from the home product categories the user selected (if they made a selection)
- Hashtags must be in English only
- How many products to suggest is up to you (recommended: 6-12 home products)
- Answer only in JSON format, do not add any other text
- Consider the user's special requests in the context of home life
- SALON = SITTING ROOM/LIVING ROOM (not a wedding hall!)
- Write the title, description and all product texts in English
"""

    @staticmethod
    def get_hybrid_design_suggestion_prompt(room_type: str, design_style: str, notes: str, additional_context: str = "") -> str:
        """
        Generate hybrid design prompt with function calling support.
        
        Returns: Formatted prompt for real product search + AI generation
        """
        return f"""
You are a residential interior architect and home decoration expert. You will prepare a hybrid design suggestion for a **RESIDENTIAL HOME ROOM** for a family/person living in Turkey.

**HOME INFORMATION:**
- Home Room Type: {room_type} (this is a residential/home room - not a hotel, office or restaurant)
- Design Style: {design_style}
{additional_context}- Special Requests: {notes}

**IMPORTANT RESIDENTIAL RULES:**
- This is an interior design for a HOME/RESIDENCE - not a commercial space
- It must suit family life and focus on home comfort
- You will design a livable, functional home room
- Salon = Sitting room/living room (not a wedding hall!)

**IMPORTANT HYBRID HOME PRODUCT STRATEGY:**
1. **SEARCH FOR REAL HOME PRODUCTS FIRST**: For each home product category, search the database using the find_product function
2. **IF YOU CANNOT FIND ONE, CREATE AN IMAGINARY HOME PRODUCT**: If the find_product function finds no product, create an imaginary product that fits the home design
3. **SUGGEST 6-10 HOME PRODUCTS**: Make 6-10 home product suggestions in total (can be a mix of real + imaginary)
4. **CONSISTENT HOME DESIGN**: All products (real and imaginary) must be consistent with each other and with the overall home design concept

**REAL HOME PRODUCT SEARCH RULES:**
- For each home product category call find_product(category="category_name", style="{design_style}", color="color_preference")
- Category is required, style and color are optional
- Use the home products found in the residential design

**IMAGINARY HOME PRODUCT CREATION RULES:**
- It must match the database schema (product_name, category, style, color, description, price)
- Set a realistic home product price suited to the Turkish market (in TL)
- It must match the other home products in style and color
- Give dimensions suited to the home room size and the family's intended use
- Choose safe materials suited to family life (child safety etc.)

**RESPONSE FORMAT:**
You must answer in the JSON format below. Write all text values in English:

{{
  "title": "Home room design title (maximum 60 characters)",
  "description": "Detailed residential room design description (2-4 sentences). Explain home life, family comfort, color palette, atmosphere and style features.",
  "hashtags": ["#interior_design", "#home_design", "#living_room", "#neutral_colors", "#family_friendly", "#cozy", "#functional", "#natural_light", "#comfortable", "#warm_atmosphere"],
  "products": [
    {{
      "category": "Home Furniture",
      "name": "Home product name", 
      "description": "Home product details and why it is recommended for the home",
      "price": 2500,
      "style": "modern",
      "color": "white"
    }}
  ]
}}

**Hashtag Rules:**
- EXACTLY 10 ENGLISH-ONLY hashtags (ordered from general to specific)
- English words only, starting with #
- Use snake_case (e.g. #living_room, #neutral_colors, #family_friendly)
- The first hashtag must be #interior_design or #home_design
- Order: from the most general home category to the most specific home detail
- CREATE FULLY ENGLISH HASHTAGS LIKE IN THE EXAMPLES

**Final HOME DESIGN Reminder:**
- FIRST search for home products using the find_product function
- If you cannot find any, create an imaginary home product suited to family life
- Answer only in JSON format
- Ensure consistency between real and imaginary home products
- HASHTAGS MUST BE ENGLISH ONLY
- SALON = SITTING ROOM/LIVING ROOM (not a wedding hall!)
- Design with a focus on home life and family comfort
- Write the title, description and all product texts in English
"""

    @staticmethod
    def get_imagen_prompt_enhancement_request(
        room_type: str, 
        design_style: str, 
        notes: str,
        design_title: str,
        design_description: str,
        products_text: str = "",
        dimensions_info: str = "",
        color_info: str = ""
    ) -> str:
        """
        Generate English Imagen 4 prompt from design data (may contain Turkish) - Ultra strict and concise.
        
        Returns: Gemini prompt for creating optimized English Imagen prompt
        """
        return f"""TASK: Create English Imagen prompt from the design data (input may contain Turkish)

INPUT:
Room: {room_type}
Style: {design_style}
Notes: {notes}
{color_info}
{products_text}

RULES:
- Start with "Photo-realistic"
- MAXIMUM 480 characters total
- MAXIMUM 5 products mentioned
- 100% English only - zero Turkish characters
- salon→living room, yatak→bedroom, mutfak→kitchen, banyo→bathroom, çocuk→kids room
- Focus only on visual elements for image generation

Your response must be exactly 480 characters or less, pure English:"""

class PromptUtils:
    """
    Utility functions for prompt generation
    """
    
    @staticmethod
    def build_additional_context(parsed_info: dict) -> str:
        """
        Build additional context from parsed user information.
        
        Returns: Formatted context string
        """
        additional_context = ""
        
        if not parsed_info:
            return additional_context
        
        # Room dimensions context
        if parsed_info.get('room_dimensions'):
            dims = parsed_info['room_dimensions']
            additional_context += f"- Room Dimensions: {dims['width']}cm x {dims['length']}cm x {dims['height']}cm\n"
        
        # Color palette context
        if parsed_info.get('color_info'):
            color_info_str = parsed_info['color_info']
            # Parse the color info JSON string
            try:
                import json
                color_info = json.loads(color_info_str) if isinstance(color_info_str, str) else color_info_str
                
                if isinstance(color_info, dict):
                    # New format coming from the frontend
                    if color_info.get('colorName'):
                        additional_context += f"- Selected Main Color: {color_info['colorName']}\n"
                    if color_info.get('dominantColor'):
                        additional_context += f"- Dominant Color Code: {color_info['dominantColor']}\n"
                    if color_info.get('colorPalette') and isinstance(color_info['colorPalette'], list):
                        additional_context += f"- Color Palette: {', '.join(color_info['colorPalette'])}\n"
            except (json.JSONDecodeError, TypeError):
                # Fallback: if it cannot be parsed, use it as a string
                additional_context += f"- Color Info: {color_info_str}\n"
        
        # Backward compatibility for the old color palette format
        elif parsed_info.get('color_palette'):
            color_info = parsed_info['color_palette']
            if color_info['type'] == 'palette':
                additional_context += f"- Selected Color Palette: {color_info.get('description', 'Custom palette')}\n"
                if color_info.get('colors'):
                    additional_context += f"- Color Codes: {', '.join(color_info['colors'])}\n"
            elif color_info['type'] == 'custom':
                additional_context += f"- Custom Color Preference: {color_info['description']}\n"
        
        # Product category preferences - EMPHASIZED FORMATTING
        if parsed_info.get('product_categories'):
            product_categories = parsed_info['product_categories']
            
            # Check the format coming from the frontend
            if isinstance(product_categories, dict):
                if product_categories.get('type') == 'categories' and product_categories.get('products'):
                    # Selected categories - emphasized format
                    categories = [cat.get('name') for cat in product_categories['products'] if cat.get('name')]
                    if categories:
                        additional_context += f"- **SPECIAL FOCUS CATEGORIES** (must be PROMINENTLY emphasized in the visualized room): {', '.join(categories)}\n"
                        additional_context += "- Products from these categories should be placed at the main focal points of the room and visually highlighted\n"
                elif product_categories.get('type') == 'custom' and product_categories.get('description'):
                    # Custom product description
                    additional_context += f"- Custom Product Preferences: {product_categories['description']}\n"
            # Old format support (list format)
            elif isinstance(product_categories, list) and len(product_categories) > 0:
                if isinstance(product_categories[0], dict) and 'type' in product_categories[0]:
                    # Custom product description
                    additional_context += f"- Custom Product Preferences: {product_categories[0]['description']}\n"
                else:
                    # Selected categories - emphasized format
                    categories = [cat['name'] for cat in product_categories if 'name' in cat]
                    if categories:
                        additional_context += f"- **SPECIAL FOCUS CATEGORIES** (must be PROMINENTLY emphasized in the visualized room): {', '.join(categories)}\n"
                        additional_context += "- Products from these categories should be placed at the main focal points of the room and visually highlighted\n"
        
        # Extra areas info
        if parsed_info.get('extra_areas'):
            additional_context += f"- Extra Areas: {len(parsed_info['extra_areas'])} protrusions/recesses\n"
        
        return additional_context
    
    @staticmethod
    def format_products_for_imagen(products: list) -> str:
        """
        Format hybrid product list for Imagen prompt generation.
        
        Returns: Formatted product text with real/AI product descriptions
        """
        if not products or len(products) == 0:
            return ""
        
        real_products = []
        fake_products = []
        products_by_category = {}
        
        for product in products:
            category = product.get('category', 'Genel')
            product_name = product.get('name', '')
            product_description = product.get('description', '')
            image_path = product.get('image_path', '')
            is_real = product.get('is_real', False)
            
            # Group by category
            if category not in products_by_category:
                products_by_category[category] = []
            
            product_info = {
                'name': product_name,
                'description': product_description,
                'image_path': image_path,
                'is_real': is_real
            }
            products_by_category[category].append(product_info)
            
            # Real/fake split
            if is_real:
                real_products.append(product_info)
            else:
                fake_products.append(product_info)
        
        # Format the product list - COMPACT
        products_text = f"**PRODUCT LIST** ({len(real_products)} real + {len(fake_products)} AI products):\n\n"
        
        # Briefly list the selected categories
        category_names = list(products_by_category.keys())
        products_text += f"**CATEGORIES**: {', '.join(category_names)}\n\n"
        
        # List real products in SHORT format
        if real_products:
            products_text += "**REAL PRODUCTS**:\n"
            for product in real_products:
                # SHORT FORMAT: Name + key feature only
                short_desc = product['name']
                if product['description']:
                    # Shorten the description: first 25 characters + key words
                    desc = product['description'][:25].split(',')[0].split('.')[0]
                    short_desc += f" ({desc})"
                products_text += f"- {short_desc}\n"
            products_text += "\n"
        
        # Also list AI products in SHORT format
        if fake_products:
            products_text += "**AI PRODUCTS**:\n"
            for product in fake_products:
                short_desc = product['name']
                if product['description']:
                    # Short description: style/color/key feature only
                    desc = product['description'][:20].split(',')[0].split('.')[0]
                    short_desc += f" ({desc})"
                products_text += f"- {short_desc}\n"
            products_text += "\n"
        
        return products_text
    
    @staticmethod
    def extract_dimensions_info_for_imagen(parsed_info: dict) -> str:
        """
        Extract room dimensions for Imagen prompt formatting.
        
        Returns: Formatted dimension information string
        """
        dimensions_info = ""
        
        # Check the direct width/length parameters
        width = parsed_info.get('width') if parsed_info else None
        length = parsed_info.get('length') if parsed_info else None
        height = parsed_info.get('height') if parsed_info else None
        
        # Also check the old room_dimensions format
        if not width and parsed_info and parsed_info.get('room_dimensions'):
            dims = parsed_info['room_dimensions']
            width = dims.get('width')
            length = dims.get('length') 
            height = dims.get('height')
        
        if width and length:
            # Calculate area in m2
            area_m2 = (width * length) / 10000  # cm2 to m2
            
            dimensions_info += "**ROOM DIMENSIONS INFO** (the image must match these dimensions):\n"
            dimensions_info += f"- Room Width: {width}cm\n"
            dimensions_info += f"- Room Length: {length}cm\n"
            if height:
                dimensions_info += f"- Room Height: {height}cm\n"
            dimensions_info += f"- Total Area: {area_m2:.1f}m²\n"
            
            # Room size characterization
            if area_m2 < 8:
                size_desc = "very small and compact"
                english_size = "very compact and small"
            elif area_m2 < 12:
                size_desc = "small"
                english_size = "small and cozy"
            elif area_m2 < 20:
                size_desc = "medium-sized"
                english_size = "medium-sized"
            elif area_m2 < 30:
                size_desc = "large"
                english_size = "large and spacious"
            else:
                size_desc = "very large and spacious"
                english_size = "very large and spacious"
            
            dimensions_info += f"- Room Character: {size_desc} room ({area_m2:.1f}m²)\n"
            dimensions_info += f"\n**SIZE EMPHASIS FOR IMAGEN PROMPT**: {english_size} room interior, showing proper spatial proportions\n"
            
            # Aspect ratio analysis
            aspect_ratio = max(width, length) / min(width, length)
            if aspect_ratio > 2:
                dimensions_info += f"**SHAPE EMPHASIS**: Long and narrow room ({aspect_ratio:.1f}:1 ratio) - elongated room layout\n"
            elif aspect_ratio < 1.3:
                dimensions_info += f"**SHAPE EMPHASIS**: Square-shaped room ({aspect_ratio:.1f}:1 ratio) - square room layout\n"
            else:
                dimensions_info += f"**SHAPE EMPHASIS**: Rectangular room ({aspect_ratio:.1f}:1 ratio) - rectangular room layout\n"
        
        return dimensions_info

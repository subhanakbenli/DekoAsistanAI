"""
Gemini Function Calling tools for product search.
Defines tools that Gemini can use to search the product database.
"""
import google.generativeai as genai
from config import logger


# Function declaration for product search
find_product_declaration = genai.protos.FunctionDeclaration(
    name="find_product",
    description="""
    Search the database for products that fit the design. Use ONLY one of the listed categories.
    If the product you want is not in the available categories, choose the closest category.
    Category values are Turkish database keys - always pass them exactly as written.
    
    IMPORTANT RULES:
    - For kitchen products: "Tezgah" (countertop), "Lavabo" (sink) or "Yemek Masası" (dining table)
    - For seating: "Koltuk" (sofa/armchair), "Sandalye" (chair), "Berjer" (wing chair), "Bar Sandalyesi" (bar stool)
    - For storage: "Dolap" (cabinet/wardrobe), "Kitaplık" (bookcase), "Komodin" (nightstand), "Oyuncak Dolabı" (toy cabinet)
    - For decoration: "Aksesuar" (accessory), "Duvar Dekorasyonu" (wall decoration), "Halı" (rug), "Ayna" (mirror)
    
    Do NOT make up your own category names!
    """,
    parameters=genai.protos.Schema(
        type=genai.protos.Type.OBJECT,
        properties={
            "category": genai.protos.Schema(
                type=genai.protos.Type.STRING,
                description="""Product category (required). Choose ONLY one of the categories below and pass the exact Turkish value (the English meaning in parentheses is for reference only - do not include it):

AVAILABLE CATEGORIES:
• Sandalye (chair)
• Büfe (sideboard)
• Lavabo (sink)
• Koltuk (sofa/armchair)
• Komodin (nightstand)
• Aksesuar (accessory)
• Dolap (cabinet/wardrobe)
• TV Ünitesi (TV unit)
• Ranza (bunk bed)
• Bar Sandalyesi (bar stool)
• Halı (rug)
• Yatak (bed)
• Berjer (wing chair)
• Yemek Masası (dining table)
• Aydınlatma (lighting)
• Oyuncak Dolabı (toy cabinet)
• Tezgah (countertop)
• Kitaplık (bookcase)
• Duvar Dekorasyonu (wall decoration)
• Çalışma Masası (desk)
• Ayna (mirror)
• Tek Kişilik Baza (single bed base)

IMPORTANT: Do not use any category outside these. If the product you are looking for is not in these categories, choose the closest category.
Examples:
- For a kitchen table → "Yemek Masası"
- For a seating group → "Koltuk"
- For storage → "Dolap" or "Kitaplık"
- For decorative objects → "Aksesuar" or "Duvar Dekorasyonu"
""",
            ),
            "style": genai.protos.Schema(
                type=genai.protos.Type.STRING,
                description="Design style (optional). Example: modern, classic, minimalist, rustic",
            ),
            "color": genai.protos.Schema(
                type=genai.protos.Type.STRING,
                description="Color preference (optional). Example: white, black, wenge, natural",
            ),
            "limit": genai.protos.Schema(
                type=genai.protos.Type.INTEGER,
                description="Maximum number of products (optional, default: 2)",
            )
        },
        required=["category"]
    )
)

# Create the tool
product_search_tool = genai.protos.Tool(
    function_declarations=[find_product_declaration]
)


class FunctionCallHandler:
    """
    Handles Function Calls from Gemini for product search.
    """
    
    def __init__(self, product_service, price_limit: float = None):
        self.product_service = product_service
        self.price_limit = price_limit
        logger.info(f"FunctionCallHandler initialized with price limit: {price_limit}")
    
    async def handle_find_product(self, db_session, function_call) -> genai.protos.FunctionResponse:
        """
        Handle find_product function call from Gemini.
        
        Args:
            db_session: Database session
            function_call: Function call from Gemini
            
        Returns:
            FunctionResponse to send back to Gemini
        """
        try:
            # Extract arguments
            args = function_call.args
            category = args.get("category", "")
            style = args.get("style")
            color = args.get("color")
            limit = args.get("limit", 2)
            
            logger.info(f"Function call: find_product(category={category}, style={style}, color={color}, limit={limit})")
            
            # Search products in database with price constraint
            products = await self.product_service.find_products_by_criteria(
                db=db_session,
                category=category,
                style=style,
                color=color,
                limit=limit,
                max_price=self.price_limit
            )
            
            # Format response
            response_data = self.product_service.format_for_function_response(products)
            
            # Create Function Response
            function_response = genai.protos.FunctionResponse(
                name="find_product",
                response=response_data
            )
            
            logger.info(f"Function response: {response_data['status']} - {len(products)} products")
            return function_response
            
        except Exception as e:
            logger.error(f"Error handling find_product function call: {str(e)}")
            
            # Return error response
            error_response = genai.protos.FunctionResponse(
                name="find_product",
                response={
                    "status": "error",
                    "message": "An error occurred while searching for products",
                    "products": []
                }
            )
            return error_response
    
    async def process_function_calls(self, db_session, response):
        """
        Process all function calls in a Gemini response.
        
        Args:
            db_session: Database session
            response: Gemini response with potential function calls
            
        Returns:
            List of function responses to send back to Gemini
        """
        function_responses = []
        
        try:
            # Check if response has function calls
            if (hasattr(response, 'candidates') and 
                response.candidates and 
                hasattr(response.candidates[0], 'content') and
                hasattr(response.candidates[0].content, 'parts')):
                
                for part in response.candidates[0].content.parts:
                    if hasattr(part, 'function_call'):
                        function_call = part.function_call
                        
                        if function_call.name == "find_product":
                            function_response = await self.handle_find_product(db_session, function_call)
                            function_responses.append(function_response)
                        else:
                            logger.warning(f"Unknown function call: {function_call.name}")
            
        except Exception as e:
            logger.error(f"Error processing function calls: {str(e)}")
        
        return function_responses


# Export the tool for use in GeminiClient
__all__ = ["product_search_tool", "FunctionCallHandler"]

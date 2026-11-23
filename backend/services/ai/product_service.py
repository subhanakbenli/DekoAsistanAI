"""
ProductService - Database-based product search for Gemini Function Calling.
KISS principle: Simple product search with PostgreSQL integration.
"""
from typing import List, Dict, Any, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_, or_
from config import logger
from ..base_service import BaseService
from models.design_models_db import Product


class ProductService(BaseService):
    """
    Simple product search service for Function Calling.
    Searches PostgreSQL products table with flexible criteria.
    """
    
    # Category mapping - converts the category names Gemini uses into PostgreSQL category names
    # Actual categories in PostgreSQL: Sandalye, Büfe, Lavabo, Koltuk, Komodin, Aksesuar, 
    # Dolap, TV Ünitesi, Ranza, Bar Sandalyesi, Halı, Yatak, Berjer, Yemek Masası, 
    # Aydınlatma, Oyuncak Dolabı, Tezgah, Kitaplık, Duvar Dekorasyonu, Çalışma Masası, Ayna, Tek Kişilik Baza
    CATEGORY_MAPPING = {
        # Sofas and seating groups
        "Koltuk Takımı": ["Koltuk"],
        "Koltuk": ["Koltuk"],
        "Kanepe": ["Koltuk"],
        "Berjer": ["Berjer"],
        
        # Chair categories
        "Sandalye": ["Sandalye"],
        "Bar Taburesi": ["Bar Sandalyesi"],
        "Bar Sandalyesi": ["Bar Sandalyesi"],
        "Ofis Koltuğu": ["Sandalye"],
        
        # Bed categories
        "Yatak": ["Yatak"],
        "Çocuk Yatağı": ["Yatak"],  # Children's beds are also in the Yatak (bed) category
        "Ranza": ["Ranza"],
        "Tek Kişilik Baza": ["Tek Kişilik Baza"],
        
        # Storage categories
        "Gardırop": ["Dolap"],
        "Gardirop": ["Dolap"],
        "Dolap": ["Dolap"],
        "Kitaplık": ["Kitaplık"],
        "Kitaplıklar": ["Kitaplık"],
        "Komodin": ["Komodin"],
        "Oyuncak Dolabı": ["Oyuncak Dolabı"],
        
        # Table and coffee table categories
        "Sehpa": ["Yemek Masası"],  # No coffee table category; closest is Yemek Masası (dining table)
        "Orta Sehpa": ["Yemek Masası"],
        "Yan Sehpa": ["Yemek Masası"],
        "Konsol": ["Yemek Masası"],
        "TV Ünitesi": ["TV Ünitesi"],
        "Yemek Masası": ["Yemek Masası"],
        "Çalışma Masası": ["Çalışma Masası"],
        "Büfe": ["Büfe"],
        "Bufe": ["Büfe"],
        
        # Kitchen & bathroom categories
        "Mutfak Dolabı": ["Dolap"],  # No kitchen cabinet category; use Dolap (cabinet)
        "Tezgah": ["Tezgah"],
        "Lavabo": ["Lavabo"],
        "Duş": ["Lavabo"],  # No shower category; use Lavabo (sink)
        "Duş Kabini": ["Lavabo"],
        "Banyo Depolama": ["Dolap"],
        
        # Lighting categories
        "Aydınlatma": ["Aydınlatma"],
        "Sarkıt Lamba": ["Aydınlatma"],
        "Lambader": ["Aydınlatma"],
        "Aplik": ["Aydınlatma"],
        "Avize": ["Aydınlatma"],
        
        # Decoration categories
        "Halı": ["Halı"],
        "Perde": ["Aksesuar"],  # No curtain category; use Aksesuar (accessory)
        "Ayna": ["Ayna"],
        "Tablo": ["Duvar Dekorasyonu"],
        "Duvar Dekorasyonu": ["Duvar Dekorasyonu"],
        "Aksesuar": ["Aksesuar"],
        "Tekstil": ["Aksesuar"],
        
        # Decorative objects - search across multiple categories (IMPORTANT!)
        "Dekoratif Objeler": ["Duvar Dekorasyonu", "Aksesuar"],
        
        # Furniture (general category)
        "Mobilyalar": ["Koltuk"],

        # English aliases, in case the model sends English category names
        "Sofa": ["Koltuk"],
        "Armchair": ["Berjer"],
        "Chair": ["Sandalye"],
        "Bar Stool": ["Bar Sandalyesi"],
        "Bed": ["Yatak"],
        "Bunk Bed": ["Ranza"],
        "Wardrobe": ["Dolap"],
        "Cabinet": ["Dolap"],
        "Bookcase": ["Kitaplık"],
        "Nightstand": ["Komodin"],
        "Coffee Table": ["Yemek Masası"],
        "Dining Table": ["Yemek Masası"],
        "Desk": ["Çalışma Masası"],
        "TV Unit": ["TV Ünitesi"],
        "Sideboard": ["Büfe"],
        "Sink": ["Lavabo"],
        "Countertop": ["Tezgah"],
        "Lighting": ["Aydınlatma"],
        "Lamp": ["Aydınlatma"],
        "Rug": ["Halı"],
        "Mirror": ["Ayna"],
        "Wall Decor": ["Duvar Dekorasyonu"],
        "Accessory": ["Aksesuar"],
        "Accessories": ["Aksesuar"],
        "Decorative Objects": ["Duvar Dekorasyonu", "Aksesuar"],
        "Furniture": ["Koltuk"]
    }
    
    def __init__(self):
        super().__init__()
        self.log_operation("ProductService initialized for Function Calling")
    
    def _map_category_to_db_categories(self, category: str) -> List[str]:
        """
        Convert the category name coming from Gemini into PostgreSQL category names.
        
        Args:
            category: Category name coming from Gemini
            
        Returns:
            List of category names to search in PostgreSQL
        """
        # Try an exact match first
        if category in self.CATEGORY_MAPPING:
            return self.CATEGORY_MAPPING[category]
        
        # Case-insensitive search
        for key, value in self.CATEGORY_MAPPING.items():
            if key.lower() == category.lower():
                return value
        
        # If no match is found, return the original category
        logger.warning(f"Category mapping not found for: {category}, using original")
        return [category.lower()]
    
    async def find_products_by_criteria(
        self, 
        db: AsyncSession,
        category: str, 
        style: Optional[str] = None, 
        color: Optional[str] = None, 
        limit: int = 3,
        max_price: Optional[float] = None
    ) -> List[Dict[str, Any]]:
        """
        Find products in database matching given criteria.
        
        Args:
            db: Database session
            category: Product category (required)
            style: Design style (optional)
            color: Color preference (optional)
            limit: Maximum number of products to return
            max_price: Maximum price limit in TL (optional)
            
        Returns:
            List of product dictionaries matching criteria
        """
        try:
            logger.info(f"Searching products: category={category}, style={style}, color={color}")
            
            # Apply category mapping
            db_categories = self._map_category_to_db_categories(category)
            logger.info(f"Mapped category '{category}' to DB categories: {db_categories}")
            
            # Build query with category mapping
            if len(db_categories) == 1:
                # Single-category search
                query = select(Product).where(Product.category == db_categories[0])
            else:
                # Multi-category search (OR logic)
                category_filters = [Product.category == cat for cat in db_categories]
                query = select(Product).where(or_(*category_filters))
            
            # Add optional filters if provided
            additional_filters = []
            if style:
                additional_filters.append(Product.style.ilike(f"%{style}%"))
            if color:
                additional_filters.append(Product.color.ilike(f"%{color}%"))
            if max_price:
                # Convert TL to kuruş for database comparison
                max_price_kurus = max_price * 100
                additional_filters.append(Product.price <= max_price_kurus)
            
            # Apply additional filters with OR logic (more flexible)
            # BUT price filter should be AND logic
            if max_price and additional_filters:
                # Separate price filter from other filters
                other_filters = [f for f in additional_filters if f.compare != Product.price.compare]
                if other_filters:
                    query = query.where(and_(
                        Product.price <= max_price_kurus,
                        or_(*other_filters)
                    ))
                else:
                    query = query.where(Product.price <= max_price_kurus)
            elif additional_filters:
                query = query.where(or_(*additional_filters))
            
            # Apply limit and execute
            query = query.limit(limit)
            result = await db.execute(query)
            products = result.scalars().all()
            
            # Convert to dictionary format for Function Calling
            product_list = []
            for product in products:
                # Convert relative image path to full URL if exists
                image_url = None
                if product.image_path:
                    # The database stores the full path (/data/products/koltuk/...); convert it to relative
                    relative_path = product.image_path
                    if relative_path.startswith('/data/products/'):
                        relative_path = relative_path[len('/data/products/'):]
                    elif relative_path.startswith('data/products/'):
                        relative_path = relative_path[len('data/products/'):]
                    
                    image_url = f"http://localhost:8000/static/products/{relative_path}"
                    logger.info(f"Product {product.product_name}: original_path={product.image_path} -> relative_path={relative_path} -> image_url={image_url}")
                
                product_dict = {
                    "id": product.id,
                    "product_name": product.product_name,
                    "category": product.category,
                    "style": product.style,
                    "color": product.color,
                    "description": product.description,
                    "price": product.price,
                    "image_path": image_url,  # Full URL instead of relative path
                    "product_link": product.product_link,
                    "width_cm": product.width_cm,
                    "depth_cm": product.depth_cm,
                    "height_cm": product.height_cm
                }
                product_list.append(product_dict)
            
            logger.info(f"Found {len(product_list)} products for category={category} (DB categories: {db_categories})")
            return product_list
            
        except Exception as e:
            logger.error(f"Error searching products: {str(e)}")
            return []
    
    async def find_products_batch(
        self, 
        db: AsyncSession,
        search_requests: List[Dict[str, Any]]
    ) -> Dict[str, List[Dict[str, Any]]]:
        """
        Batch search for multiple product categories.
        Optimized for Function Calling with multiple requests.
        
        Args:
            db: Database session
            search_requests: List of search criteria dicts
            
        Returns:
            Dictionary with category as key and products list as value
        """
        try:
            results = {}
            
            for request in search_requests:
                category = request.get("category")
                style = request.get("style")
                color = request.get("color")
                limit = request.get("limit", 3)
                
                if category:
                    products = await self.find_products_by_criteria(
                        db, category, style, color, limit
                    )
                    results[category] = products
            
            return results
            
        except Exception as e:
            logger.error(f"Error in batch product search: {str(e)}")
            return {}
    
    def format_for_function_response(self, products: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Format products for Gemini Function Response.
        
        Args:
            products: List of product dictionaries
            
        Returns:
            Formatted response for Function Calling
        """
        if not products:
            return {
                "status": "not_found",
                "message": "No products found matching the given criteria",
                "products": []
            }
        
        return {
            "status": "found",
            "message": f"{len(products)} products found",
            "products": products
        }
    
    def get_available_categories(self) -> List[str]:
        """Get list of available product categories from roomCategories.js mapping."""
        return [
            "koltuk", "berjer", "yatak", "cocuk_yatagi", "ranza",
            "gardrop", "dolap", "komodin", "kitaplik", "oyuncak_dolabi",
            "dosya_dolabi", "sehpa", "tv_unitesi", "yemek_masasi",
            "calisma_masasi", "bufe", "sandalye", "bar_taburesi",
            "mutfak_dolabi", "tezgah", "lavabo", "dus", "banyo_depolama",
            "aydinlatma", "hali", "perde", "ayna", "dekoratif_objeler",
            "duvar_dekorasyonu", "aksesuar", "oyun_alani"
        ]

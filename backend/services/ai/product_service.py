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
    
    def __init__(self):
        super().__init__()
        self.log_operation("ProductService initialized for Function Calling")
    
    async def find_products_by_criteria(
        self, 
        db: AsyncSession,
        category: str, 
        style: Optional[str] = None, 
        color: Optional[str] = None, 
        limit: int = 3
    ) -> List[Dict[str, Any]]:
        """
        Find products in database matching given criteria.
        
        Args:
            db: Database session
            category: Product category (required)
            style: Design style (optional)
            color: Color preference (optional)
            limit: Maximum number of products to return
            
        Returns:
            List of product dictionaries matching criteria
        """
        try:
            logger.info(f"Searching products: category={category}, style={style}, color={color}")
            
            # Build query with flexible matching
            query = select(Product).where(Product.category == category)
            
            # Add optional filters if provided
            additional_filters = []
            if style:
                additional_filters.append(Product.style.ilike(f"%{style}%"))
            if color:
                additional_filters.append(Product.color.ilike(f"%{color}%"))
            
            # Apply additional filters with OR logic (more flexible)
            if additional_filters:
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
                    # Database'de tam path var (/data/products/koltuk/...), relative'e çevirelim
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
            
            logger.info(f"Found {len(product_list)} products for category={category}")
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
                "message": "Belirtilen kriterlere uygun ürün bulunamadı",
                "products": []
            }
        
        return {
            "status": "found",
            "message": f"{len(products)} ürün bulundu",
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

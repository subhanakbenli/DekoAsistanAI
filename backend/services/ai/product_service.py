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
    
    # Kategori eşleme - Gemini'nin kullandığı kategori adlarını PostgreSQL kategori adlarına çevirir
    # PostgreSQL'deki gerçek kategoriler: Sandalye, Büfe, Lavabo, Koltuk, Komodin, Aksesuar, 
    # Dolap, TV Ünitesi, Ranza, Bar Sandalyesi, Halı, Yatak, Berjer, Yemek Masası, 
    # Aydınlatma, Oyuncak Dolabı, Tezgah, Kitaplık, Duvar Dekorasyonu, Çalışma Masası, Ayna, Tek Kişilik Baza
    CATEGORY_MAPPING = {
        # Koltuk ve Oturma Grubu
        "Koltuk Takımı": ["Koltuk"],
        "Koltuk": ["Koltuk"],
        "Kanepe": ["Koltuk"],
        "Berjer": ["Berjer"],
        
        # Sandalye kategorileri
        "Sandalye": ["Sandalye"],
        "Bar Taburesi": ["Bar Sandalyesi"],
        "Bar Sandalyesi": ["Bar Sandalyesi"],
        "Ofis Koltuğu": ["Sandalye"],
        
        # Yatak kategorileri
        "Yatak": ["Yatak"],
        "Çocuk Yatağı": ["Yatak"],  # Çocuk yatağı da Yatak kategorisinde
        "Ranza": ["Ranza"],
        "Tek Kişilik Baza": ["Tek Kişilik Baza"],
        
        # Depolama kategorileri
        "Gardırop": ["Dolap"],
        "Gardirop": ["Dolap"],
        "Dolap": ["Dolap"],
        "Kitaplık": ["Kitaplık"],
        "Kitaplıklar": ["Kitaplık"],
        "Komodin": ["Komodin"],
        "Oyuncak Dolabı": ["Oyuncak Dolabı"],
        
        # Masa ve Sehpa kategorileri
        "Sehpa": ["Yemek Masası"],  # Sehpa kategorisi yok, en yakını Yemek Masası
        "Orta Sehpa": ["Yemek Masası"],
        "Yan Sehpa": ["Yemek Masası"],
        "Konsol": ["Yemek Masası"],
        "TV Ünitesi": ["TV Ünitesi"],
        "Yemek Masası": ["Yemek Masası"],
        "Çalışma Masası": ["Çalışma Masası"],
        "Büfe": ["Büfe"],
        "Bufe": ["Büfe"],
        
        # Mutfak & Banyo kategorileri
        "Mutfak Dolabı": ["Dolap"],  # Mutfak dolabı kategorisi yok, Dolap kullan
        "Tezgah": ["Tezgah"],
        "Lavabo": ["Lavabo"],
        "Duş": ["Lavabo"],  # Duş kategorisi yok, Lavabo kullan
        "Duş Kabini": ["Lavabo"],
        "Banyo Depolama": ["Dolap"],
        
        # Aydınlatma kategorileri
        "Aydınlatma": ["Aydınlatma"],
        "Sarkıt Lamba": ["Aydınlatma"],
        "Lambader": ["Aydınlatma"],
        "Aplik": ["Aydınlatma"],
        "Avize": ["Aydınlatma"],
        
        # Dekorasyon kategorileri
        "Halı": ["Halı"],
        "Perde": ["Aksesuar"],  # Perde kategorisi yok, Aksesuar kullan
        "Ayna": ["Ayna"],
        "Tablo": ["Duvar Dekorasyonu"],
        "Duvar Dekorasyonu": ["Duvar Dekorasyonu"],
        "Aksesuar": ["Aksesuar"],
        "Tekstil": ["Aksesuar"],
        
        # Dekoratif objeler - birden fazla kategoride arama (ÖNEMLİ!)
        "Dekoratif Objeler": ["Duvar Dekorasyonu", "Aksesuar"],
        
        # Mobilyalar (genel kategori)
        "Mobilyalar": ["Koltuk"]
    }
    
    def __init__(self):
        super().__init__()
        self.log_operation("ProductService initialized for Function Calling")
    
    def _map_category_to_db_categories(self, category: str) -> List[str]:
        """
        Gemini'den gelen kategori adını PostgreSQL'deki kategori adlarına çevirir.
        
        Args:
            category: Gemini'den gelen kategori adı
            
        Returns:
            PostgreSQL'de aranacak kategori adları listesi
        """
        # Önce tam eşleşme ara
        if category in self.CATEGORY_MAPPING:
            return self.CATEGORY_MAPPING[category]
        
        # Case-insensitive arama
        for key, value in self.CATEGORY_MAPPING.items():
            if key.lower() == category.lower():
                return value
        
        # Eğer eşleşme bulunamazsa, orijinal kategoriyi döndür
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
            
            # Kategori eşlemesi yap
            db_categories = self._map_category_to_db_categories(category)
            logger.info(f"Mapped category '{category}' to DB categories: {db_categories}")
            
            # Build query with category mapping
            if len(db_categories) == 1:
                # Tek kategori araması
                query = select(Product).where(Product.category == db_categories[0])
            else:
                # Birden fazla kategori araması (OR logic)
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

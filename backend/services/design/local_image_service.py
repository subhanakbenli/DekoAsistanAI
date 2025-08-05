"""
Local Image Service for Multimodal Imagen Integration

Reads product images from local filesystem instead of downloading them.
Optimizes and converts them for AI model consumption.
"""

import os
import base64
from typing import List, Dict, Optional, Any
from config import logger
from utils.image_utils import ImageUtils


class LocalImageService:
    """
    Service for loading and processing local product images for multimodal AI generation.
    
    Features:
    - Load images from local product image directories
    - Base64 conversion for AI APIs
    - Image optimization for AI model requirements
    - Error handling and fallbacks
    - Support for IKEA product naming conventions
    """
    
    def __init__(self):
        # Base path for product images
        self.products_base_path = os.path.join("data", "products", "size2000")
        self.image_utils = ImageUtils()
        
        # Supported image formats
        self.supported_formats = ['.jpg', '.jpeg', '.png', '.webp']
        
        logger.info(f"Local Image Service initialized with base path: {self.products_base_path}")
    
    def _get_product_image_path(self, product: Dict[str, Any]) -> Optional[str]:
        """
        Generate local file path for a product image based on product data.
        
        Args:
            product: Product dict with category and name/title info
            
        Returns:
            Absolute path to image file or None if not found
        """
        try:
            # Get category from product
            category = product.get('category', '').lower().strip()
            if not category:
                logger.warning(f"No category found for product: {product}")
                return None
            
            # Map some category names to directory names
            category_mapping = {
                'koltuk-takimi': 'koltuk',
                'koltuk takımı': 'koltuk',
                'kanepe': 'koltuk',
                'armchair': 'koltuk',
                'sofa': 'koltuk',
                'masa': 'yemek-masasi',
                'mutfak masası': 'yemek-masasi',  # Add kitchen table mapping
                'yemek masası': 'yemek-masasi',
                'table': 'yemek-masasi',
                'sehpa': 'tv-unitesi',  # Sehpa usually stored in tv-unitesi
                'chair': 'sandalye',
                'bed': 'yatak',
                'wardrobe': 'dolap',
                'bookshelf': 'kitaplik',
                'lighting': 'aydinlatma',
                'mirror': 'ayna',
                'rug': 'hali',
                'carpet': 'hali',
                # Turkish character mappings
                'aydınlatma': 'aydinlatma',
                'kitaplık': 'kitaplik',
                'halı': 'hali',
                'tv ünitesi': 'tv-unitesi',
                'tv-ünitesi': 'tv-unitesi',
                'aksesuar': 'aksesuar',
                'duvar-dekorasyonu': 'duvar-dekorasyonu',
                'çalışma-masası': 'calisma-masasi',
                'calisma-masasi': 'calisma-masasi',
                'dekoratif objeler': 'aksesuar',  # Map to aksesuar
                'dekoratif obje': 'aksesuar',
                'berjer': 'berjer',
                'bar sandalyesi': 'bar-sandalyesi',
                'bar-sandalyesi': 'bar-sandalyesi',
                'büfe': 'bufe',
                'komodin': 'komodin',
                'lavabo': 'lavabo',
                'oyuncak dolabı': 'oyuncak-dolabi',
                'ranza': 'ranza',  
                'tek kişilik baza': 'tek-kisilik-baza',
                'tezgah': 'tezgah'
            }
            
            # Use mapped category or original
            directory_name = category_mapping.get(category, category)
            category_path = os.path.join(self.products_base_path, directory_name)
            
            if not os.path.exists(category_path):
                logger.warning(f"Category directory not found: {category_path}")
                return None
            
            # Get product name/title for filename matching
            product_name = (
                product.get('name') or 
                product.get('title') or 
                product.get('product_name') or 
                ''
            ).lower().strip()
            
            if not product_name:
                logger.warning(f"No product name found for: {product}")
                return None
            
            # Clean product name for filename matching
            # Remove common suffixes and normalize
            clean_name = product_name.replace(' ', '-').replace('_', '-')
            clean_name = clean_name.replace('ğ', 'g').replace('ş', 's').replace('ı', 'i')
            clean_name = clean_name.replace('ö', 'o').replace('ü', 'u').replace('ç', 'c')
            
            # List all files in category directory
            for filename in os.listdir(category_path):
                file_lower = filename.lower()
                
                # Check if filename contains product name parts
                name_parts = clean_name.split('-')
                matches = sum(1 for part in name_parts if part and part in file_lower)
                
                # If most parts match, consider it a match
                if len(name_parts) > 0 and matches >= len(name_parts) * 0.6:
                    full_path = os.path.join(category_path, filename)
                    logger.debug(f"Found image for {product_name}: {filename}")
                    return full_path
            
            # If no specific match, log available files for debugging
            available_files = os.listdir(category_path)[:5]  # Show first 5 files
            logger.warning(f"No image file found for product '{product_name}' in {directory_name}. Available: {available_files}")
            return None
            
        except Exception as e:
            logger.error(f"Error finding image path for product {product}: {str(e)}")
            return None
    
    async def load_product_image(self, product: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """
        Load and process a single product image from local filesystem.
        
        Args:
            product: Product dict with category and name info
            
        Returns:
            Dict with image data or None if failed:
            {
                "product_id": str,
                "product_name": str,
                "base64_image": str,
                "image_format": str,
                "file_size_bytes": int,
                "file_path": str,
                "optimized": bool
            }
        """
        try:
            # Find image file path
            image_path = self._get_product_image_path(product)
            if not image_path:
                return None
            
            # Check if file exists and is readable
            if not os.path.exists(image_path):
                logger.warning(f"Image file not found: {image_path}")
                return None
            
            # Read image file
            with open(image_path, 'rb') as f:
                image_bytes = f.read()
            
            if not image_bytes:
                logger.warning(f"Empty image file: {image_path}")
                return None
            
            # Optimize image for AI model
            try:
                optimized_base64 = self.image_utils.prepare_for_ai_model(
                    base64.b64encode(image_bytes).decode('utf-8')
                )
                optimized = True
            except Exception as e:
                logger.warning(f"Image optimization failed for {image_path}: {str(e)}, using original")
                optimized_base64 = base64.b64encode(image_bytes).decode('utf-8')
                optimized = False
            
            product_name = (
                product.get('name') or 
                product.get('title') or 
                product.get('product_name') or 
                'Unknown Product'
            )
            
            result = {
                "product_id": product.get('id') or product.get('product_id'),
                "product_name": product_name,
                "base64_image": optimized_base64,
                "image_format": self._detect_format_from_path(image_path),
                "file_size_bytes": len(image_bytes),
                "file_path": image_path,
                "optimized": optimized
            }
            
            logger.info(f"Loaded local image for {product_name}: {os.path.basename(image_path)} ({len(image_bytes)} bytes)")
            return result
            
        except Exception as e:
            logger.error(f"Error loading image for product {product}: {str(e)}")
            return None
    
    def _detect_format_from_path(self, file_path: str) -> str:
        """Detect image format from file extension."""
        ext = os.path.splitext(file_path)[1].lower()
        format_map = {
            '.jpg': 'JPEG',
            '.jpeg': 'JPEG', 
            '.png': 'PNG',
            '.webp': 'WEBP'
        }
        return format_map.get(ext, 'UNKNOWN')
    
    async def load_product_images_batch(self, products: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Load images for a list of products.
        
        Args:
            products: List of product dicts
            
        Returns:
            List of image data dicts (successful loads only)
        """
        if not products:
            return []
        
        logger.info(f"Loading local images for {len(products)} products")
        
        loaded_images = []
        for product in products:
            image_data = await self.load_product_image(product)
            if image_data:
                loaded_images.append(image_data)
        
        success_rate = len(loaded_images) / len(products) * 100
        logger.info(f"Local image loading completed: {len(loaded_images)}/{len(products)} successful ({success_rate:.1f}%)")
        
        return loaded_images
    
    def get_available_categories(self) -> List[str]:
        """Get list of available product categories."""
        try:
            if not os.path.exists(self.products_base_path):
                return []
            
            categories = []
            for item in os.listdir(self.products_base_path):
                item_path = os.path.join(self.products_base_path, item)
                if os.path.isdir(item_path):
                    categories.append(item)
            
            return sorted(categories)
            
        except Exception as e:
            logger.error(f"Error getting available categories: {str(e)}")
            return []
    
    def get_category_stats(self, category: str) -> Dict[str, Any]:
        """Get statistics for a specific category."""
        try:
            category_path = os.path.join(self.products_base_path, category)
            if not os.path.exists(category_path):
                return {"exists": False}
            
            files = [f for f in os.listdir(category_path) 
                    if any(f.lower().endswith(ext) for ext in self.supported_formats)]
            
            total_size = 0
            for filename in files:
                try:
                    file_path = os.path.join(category_path, filename)
                    total_size += os.path.getsize(file_path)
                except:
                    pass
            
            return {
                "exists": True,
                "file_count": len(files),
                "total_size_mb": round(total_size / (1024 * 1024), 2),
                "sample_files": files[:5]  # First 5 files as samples
            }
            
        except Exception as e:
            logger.error(f"Error getting stats for category {category}: {str(e)}")
            return {"exists": False, "error": str(e)}


# Global instance
local_image_service = LocalImageService()

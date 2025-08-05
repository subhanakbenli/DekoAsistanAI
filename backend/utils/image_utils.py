"""
Image utilities for multimodal AI integration
"""

import base64
import io
from PIL import Image
from typing import Optional, Tuple, Dict, Any
from config import logger


class ImageUtils:
    """Utility functions for image processing and validation."""
    
    @staticmethod
    def validate_base64_image(base64_string: str) -> bool:
        """
        Validate if base64 string represents a valid image.
        
        Args:
            base64_string: Base64 encoded image string
            
        Returns:
            bool: True if valid image, False otherwise
        """
        try:
            # Decode base64
            image_bytes = base64.b64decode(base64_string)
            
            # Try to open with PIL
            with Image.open(io.BytesIO(image_bytes)) as img:
                img.verify()  # Verify it's a valid image
                return True
                
        except Exception as e:
            logger.debug(f"Invalid base64 image: {str(e)}")
            return False
    
    @staticmethod
    def get_image_dimensions(base64_string: str) -> Optional[Tuple[int, int]]:
        """
        Get image dimensions from base64 string.
        
        Args:
            base64_string: Base64 encoded image string
            
        Returns:
            Tuple of (width, height) or None if invalid
        """
        try:
            image_bytes = base64.b64decode(base64_string)
            
            with Image.open(io.BytesIO(image_bytes)) as img:
                return img.size  # (width, height)
                
        except Exception as e:
            logger.error(f"Error getting image dimensions: {str(e)}")
            return None
    
    @staticmethod
    def resize_image_if_needed(base64_string: str, max_width: int = 1024, max_height: int = 1024) -> str:
        """
        Resize image if it's too large, maintaining aspect ratio.
        
        Args:
            base64_string: Base64 encoded image string
            max_width: Maximum width in pixels
            max_height: Maximum height in pixels
            
        Returns:
            Base64 string of resized image (or original if no resize needed)
        """
        try:
            image_bytes = base64.b64decode(base64_string)
            
            with Image.open(io.BytesIO(image_bytes)) as img:
                # Check if resize is needed
                if img.width <= max_width and img.height <= max_height:
                    return base64_string  # No resize needed
                
                # Calculate new size maintaining aspect ratio
                aspect_ratio = img.width / img.height
                
                if aspect_ratio > 1:  # Landscape
                    new_width = min(max_width, img.width)
                    new_height = int(new_width / aspect_ratio)
                else:  # Portrait or square
                    new_height = min(max_height, img.height)
                    new_width = int(new_height * aspect_ratio)
                
                # Resize image
                resized_img = img.resize((new_width, new_height), Image.Resampling.LANCZOS)
                
                # Convert back to base64
                output_buffer = io.BytesIO()
                resized_img.save(output_buffer, format=img.format)
                resized_bytes = output_buffer.getvalue()
                
                logger.info(f"Resized image: {img.width}x{img.height} -> {new_width}x{new_height}")
                
                return base64.b64encode(resized_bytes).decode('utf-8')
                
        except Exception as e:
            logger.error(f"Error resizing image: {str(e)}")
            return base64_string  # Return original on error
    
    @staticmethod
    def convert_to_format(base64_string: str, target_format: str = 'JPEG') -> str:
        """
        Convert image to specific format.
        
        Args:
            base64_string: Base64 encoded image string
            target_format: Target format ('JPEG', 'PNG', 'WEBP')
            
        Returns:
            Base64 string of converted image
        """
        try:
            image_bytes = base64.b64decode(base64_string)
            
            with Image.open(io.BytesIO(image_bytes)) as img:
                # Convert RGBA to RGB if saving as JPEG
                if target_format.upper() == 'JPEG' and img.mode in ('RGBA', 'LA'):
                    # Create white background
                    rgb_img = Image.new('RGB', img.size, (255, 255, 255))
                    if img.mode == 'RGBA':
                        rgb_img.paste(img, mask=img.split()[-1])  # Use alpha channel as mask
                    else:
                        rgb_img.paste(img)
                    img = rgb_img
                
                # Convert to target format
                output_buffer = io.BytesIO()
                img.save(output_buffer, format=target_format.upper())
                converted_bytes = output_buffer.getvalue()
                
                logger.debug(f"Converted image to {target_format}")
                
                return base64.b64encode(converted_bytes).decode('utf-8')
                
        except Exception as e:
            logger.error(f"Error converting image to {target_format}: {str(e)}")
            return base64_string  # Return original on error
    
    @staticmethod
    def prepare_for_ai_model(base64_string: str, model_requirements: Dict[str, Any] = None) -> str:
        """
        Prepare image for AI model with specific requirements.
        
        Args:
            base64_string: Base64 encoded image string
            model_requirements: Dict with model-specific requirements:
                - max_width: int
                - max_height: int
                - format: str ('JPEG', 'PNG')
                - max_size_mb: float
                
        Returns:
            Optimized base64 image string
        """
        if not model_requirements:
            model_requirements = {
                'max_width': 1024,
                'max_height': 1024,
                'format': 'JPEG',
                'max_size_mb': 5.0
            }
        
        try:
            # Resize if needed
            optimized_image = ImageUtils.resize_image_if_needed(
                base64_string,
                model_requirements.get('max_width', 1024),
                model_requirements.get('max_height', 1024)
            )
            
            # Convert format if needed
            if model_requirements.get('format'):
                optimized_image = ImageUtils.convert_to_format(
                    optimized_image,
                    model_requirements['format']
                )
            
            # Check final size
            final_size_mb = len(base64.b64decode(optimized_image)) / (1024 * 1024)
            max_size_mb = model_requirements.get('max_size_mb', 5.0)
            
            if final_size_mb > max_size_mb:
                logger.warning(f"Image still too large after optimization: {final_size_mb:.2f}MB > {max_size_mb}MB")
                # Could implement further compression here if needed
            
            logger.info(f"Image prepared for AI model: {final_size_mb:.2f}MB")
            return optimized_image
            
        except Exception as e:
            logger.error(f"Error preparing image for AI model: {str(e)}")
            return base64_string
    
    @staticmethod
    def get_image_info(base64_string: str) -> Dict[str, Any]:
        """
        Get comprehensive information about an image.
        
        Args:
            base64_string: Base64 encoded image string
            
        Returns:
            Dict with image information
        """
        try:
            image_bytes = base64.b64decode(base64_string)
            
            with Image.open(io.BytesIO(image_bytes)) as img:
                return {
                    "format": img.format,
                    "mode": img.mode,
                    "width": img.width,
                    "height": img.height,
                    "size_bytes": len(image_bytes),
                    "size_mb": round(len(image_bytes) / (1024 * 1024), 2),
                    "aspect_ratio": round(img.width / img.height, 2),
                    "has_transparency": img.mode in ('RGBA', 'LA', 'P')
                }
                
        except Exception as e:
            logger.error(f"Error getting image info: {str(e)}")
            return {
                "error": str(e),
                "size_bytes": len(base64.b64decode(base64_string)) if base64_string else 0
            }

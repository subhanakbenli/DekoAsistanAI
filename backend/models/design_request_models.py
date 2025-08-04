from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List
import json

class ColorInfo(BaseModel):
    """Color information model"""
    dominantColor: Optional[str] = Field(None, description="Dominant color hex code")
    colorName: Optional[str] = Field(None, description="Color name in Turkish")
    colorPalette: Optional[List[str]] = Field(None, description="List of color hex codes")

class ProductInfo(BaseModel):
    """Individual product information"""
    name: str = Field(..., description="Product name")
    icon: str = Field(..., description="Product icon emoji")

class ProductCategories(BaseModel):
    """Product categories model"""
    type: str = Field(..., description="Type: 'categories' or 'custom'")
    products: Optional[List[ProductInfo]] = Field(None, description="List of selected products")
    description: Optional[str] = Field(None, description="Custom description if type is 'custom'")

class DesignRequest(BaseModel):
    """Main design request model"""
    room_type: str = Field(..., description="Room type")
    design_style: str = Field(..., description="Design style")
    notes: str = Field(..., description="User notes")
    connection_id: Optional[str] = Field(None, description="WebSocket connection ID")
    color_info: Optional[ColorInfo] = Field(None, description="Color information")
    width: Optional[int] = Field(None, description="Room width in cm")
    length: Optional[int] = Field(None, description="Room length in cm")
    height: Optional[int] = Field(None, description="Room height in cm")
    product_categories: Optional[ProductCategories] = Field(None, description="Product categories")
    price: Optional[float] = Field(None, description="Price limit in TL")
    
    def get_color_info_as_string(self) -> str:
        """Convert color_info to JSON string for legacy compatibility"""
        if self.color_info:
            return self.color_info.model_dump_json()
        return ""
    
    def get_product_categories_as_dict(self) -> Optional[Dict[str, Any]]:
        """Get product_categories as dictionary"""
        if self.product_categories:
            return self.product_categories.model_dump()
        return None

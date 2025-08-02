from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional, Union


class ProductModel(BaseModel):
    """
    Model for individual product information.
    Enhanced to support hybrid real/fake product system.
    """
    category: str = Field(..., description="Product category")
    name: str = Field(..., description="Product name")
    description: str = Field(..., description="Product description")
    type: str = Field(default="product", description="Product type")
    
    # Enhanced fields for hybrid system
    is_real: Optional[bool] = Field(None, description="Whether this is a real product from database")
    image_path: Optional[str] = Field(None, description="Product image URL (for real products)")
    product_link: Optional[str] = Field(None, description="Product purchase link (for real products)")
    image_available: Optional[bool] = Field(None, description="Whether product image is available")
    real_product_id: Optional[str] = Field(None, description="Database ID of real product (UUID)")
    
    # Additional product information
    dimensions: Optional[Dict[str, Any]] = Field(None, description="Product dimensions (width, depth, height)")
    price: Optional[float] = Field(None, description="Product price")


class DesignRequestModel(BaseModel):
    """
    Model for design request - moved from main.py.
    """
    room_type: str = Field(..., example="Living Room")
    design_style: str = Field(..., example="Modern")
    notes: str = Field(..., example="I want a large bookshelf and a comfortable reading chair...")


class DesignResponseModel(BaseModel):
    """
    Extended model for design response from Gemini.
    According to PRD, includes design title, description and product suggestion.
    """
    design_id: Optional[str] = Field(None, description="Unique design identifier for favorites")
    room_type: str = Field(..., description="User's selected room type")
    design_style: str = Field(..., description="User's selected design style")
    notes: str = Field(..., description="User's special requests")
    
    # AI response from Gemini
    design_title: str = Field(..., description="AI-generated design title")
    design_description: str = Field(..., description="Detailed design description")
    hashtags: Union[List[str], Dict[str, List[str]]] = Field(default=[], description="AI-generated hashtags (can be list or dict with 'en'/'tr' keys)")
    product_suggestion: str = Field(..., description="Featured product suggestion (text format)")
    products: List[ProductModel] = Field(default=[], description="Structured product list")
    
    # Success status
    success: bool = Field(default=True, description="Whether the request was processed successfully")
    message: str = Field(default="Design suggestion created successfully", description="Operation status message")

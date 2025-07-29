from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional


class ProductModel(BaseModel):
    """
    Model for individual product information.
    """
    category: str = Field(..., description="Product category")
    name: str = Field(..., description="Product name")
    description: str = Field(..., description="Product description")
    type: str = Field(default="product", description="Product type")


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
    product_suggestion: str = Field(..., description="Featured product suggestion (text format)")
    products: List[ProductModel] = Field(default=[], description="Structured product list")
    
    # Success status
    success: bool = Field(default=True, description="Whether the request was processed successfully")
    message: str = Field(default="Design suggestion created successfully", description="Operation status message")

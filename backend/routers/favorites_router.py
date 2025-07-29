"""
Favorites management router for authenticated users.
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete
from typing import List

from config.database import get_async_session
from models.user_models import User
from models.design_models_db import Design, UserFavoriteDesign, UserFavoriteProduct
from models.auth_schemas import UserResponse
from routers.auth_router import get_current_user
from pydantic import BaseModel

router = APIRouter(prefix="/favorites", tags=["Favorites"])

# Pydantic models for request/response
class FavoriteDesignResponse(BaseModel):
    """Response for favorite design."""
    id: int
    design_id: str
    design_title: str
    room_type: str
    design_style: str
    created_at: str
    
    class Config:
        from_attributes = True

class FavoriteProductRequest(BaseModel):
    """Request to add product to favorites."""
    product_name: str
    product_description: str = None
    product_link: str = None
    product_category: str = None
    design_id: str = None

class FavoriteProductResponse(BaseModel):
    """Response for favorite product."""
    id: int
    product_name: str
    product_description: str = None
    product_link: str = None
    product_category: str = None
    design_id: str = None
    created_at: str
    
    class Config:
        from_attributes = True

@router.post("/design/{design_id}")
async def add_design_to_favorites(
    design_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_async_session)
):
    """Add a design to user's favorites."""
    
    # Check if design exists
    design_result = await db.execute(select(Design).where(Design.id == design_id))
    design = design_result.scalar_one_or_none()
    
    if not design:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Design not found"
        )
    
    # Check if already favorited
    existing_result = await db.execute(
        select(UserFavoriteDesign).where(
            UserFavoriteDesign.user_id == current_user.id,
            UserFavoriteDesign.design_id == design_id
        )
    )
    existing = existing_result.scalar_one_or_none()
    
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Design already in favorites"
        )
    
    # Add to favorites
    favorite = UserFavoriteDesign(
        user_id=current_user.id,
        design_id=design_id
    )
    
    db.add(favorite)
    await db.commit()
    
    return {"message": "Design added to favorites", "design_id": design_id}

@router.delete("/design/{design_id}")
async def remove_design_from_favorites(
    design_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_async_session)
):
    """Remove a design from user's favorites."""
    
    result = await db.execute(
        delete(UserFavoriteDesign).where(
            UserFavoriteDesign.user_id == current_user.id,
            UserFavoriteDesign.design_id == design_id
        )
    )
    
    if result.rowcount == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Design not found in favorites"
        )
    
    await db.commit()
    return {"message": "Design removed from favorites", "design_id": design_id}

@router.get("/my-favorites")
async def get_my_favorites(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_async_session)
):
    """
    Get current user's favorites (designs and products) in a single optimized query.
    This endpoint is safe - only returns the authenticated user's own favorites.
    """
    
    # Single query for favorite designs with JOIN
    designs_result = await db.execute(
        select(UserFavoriteDesign, Design)
        .join(Design, UserFavoriteDesign.design_id == Design.id)
        .where(UserFavoriteDesign.user_id == current_user.id)
        .order_by(UserFavoriteDesign.created_at.desc())
    )
    
    # Single query for favorite products
    products_result = await db.execute(
        select(UserFavoriteProduct)
        .where(UserFavoriteProduct.user_id == current_user.id)
        .order_by(UserFavoriteProduct.created_at.desc())
    )
    
    favorite_designs = designs_result.all()
    favorite_products = products_result.scalars().all()
    
    # Security: Double-check that all returned favorites belong to current user
    for fav in favorite_designs:
        if fav.UserFavoriteDesign.user_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Security violation: Access denied"
            )
    
    for product in favorite_products:
        if product.user_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN, 
                detail="Security violation: Access denied"
            )
    
    return {
        "success": True,
        "user_id": current_user.id,
        "message": f"Retrieved favorites for user {current_user.email}",
        "favorite_designs": [
            {
                "id": fav.UserFavoriteDesign.id,
                "design_id": fav.Design.id,
                "title": fav.Design.title,
                "description": fav.Design.description,
                "room_type": fav.Design.room_type,
                "design_style": fav.Design.design_style,
                "product_suggestion": fav.Design.product_suggestion,
                "products": fav.Design.products,
                "created_at": fav.UserFavoriteDesign.created_at.isoformat()
            }
            for fav in favorite_designs
        ],
        "favorite_products": [
            {
                "id": product.id,
                "product_name": product.product_name,
                "product_description": product.product_description,
                "product_link": product.product_link,
                "product_category": product.product_category,
                "design_id": product.design_id,
                "created_at": product.created_at.isoformat()
            }
            for product in favorite_products
        ],
        "counts": {
            "designs": len(favorite_designs),
            "products": len(favorite_products)
        }
    }

@router.get("/designs", response_model=List[FavoriteDesignResponse])
async def get_favorite_designs(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_async_session)
):
    """Get user's favorite designs."""
    
    result = await db.execute(
        select(UserFavoriteDesign, Design).join(
            Design, UserFavoriteDesign.design_id == Design.id
        ).where(UserFavoriteDesign.user_id == current_user.id)
    )
    
    favorites = result.all()
    
    return [
        FavoriteDesignResponse(
            id=fav.UserFavoriteDesign.id,
            design_id=fav.Design.id,
            design_title=fav.Design.title,
            room_type=fav.Design.room_type,
            design_style=fav.Design.design_style,
            created_at=fav.UserFavoriteDesign.created_at.isoformat()
        )
        for fav in favorites
    ]

@router.post("/product", response_model=dict)
async def add_product_to_favorites(
    product: FavoriteProductRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_async_session)
):
    """Add a product to user's favorites."""
    
    favorite_product = UserFavoriteProduct(
        user_id=current_user.id,
        product_name=product.product_name,
        product_description=product.product_description,
        product_link=product.product_link,
        product_category=product.product_category,
        design_id=product.design_id
    )
    
    db.add(favorite_product)
    await db.commit()
    await db.refresh(favorite_product)
    
    return {
        "message": "Product added to favorites",
        "product_id": favorite_product.id,
        "product_name": product.product_name
    }

@router.get("/products", response_model=List[FavoriteProductResponse])
async def get_favorite_products(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_async_session)
):
    """Get user's favorite products."""
    
    result = await db.execute(
        select(UserFavoriteProduct).where(
            UserFavoriteProduct.user_id == current_user.id
        ).order_by(UserFavoriteProduct.created_at.desc())
    )
    
    products = result.scalars().all()
    
    return [
        FavoriteProductResponse(
            id=product.id,
            product_name=product.product_name,
            product_description=product.product_description,
            product_link=product.product_link,
            product_category=product.product_category,
            design_id=product.design_id,
            created_at=product.created_at.isoformat()
        )
        for product in products
    ]

@router.delete("/product/{product_id}")
async def remove_product_from_favorites(
    product_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_async_session)
):
    """Remove a product from user's favorites."""
    
    result = await db.execute(
        delete(UserFavoriteProduct).where(
            UserFavoriteProduct.id == product_id,
            UserFavoriteProduct.user_id == current_user.id
        )
    )
    
    if result.rowcount == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found in favorites"
        )
    
    await db.commit()
    return {"message": "Product removed from favorites", "product_id": product_id}

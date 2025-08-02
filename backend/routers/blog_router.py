"""
Blog router for public design sharing and discovery.
Handles public blog posts, likes, views, and filtering.
"""
from fastapi import APIRouter, Depends, HTTPException, status, Query, Request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_, or_, func, desc, asc, update
from sqlalchemy.orm import selectinload
from typing import List, Optional
from datetime import datetime, timedelta
import os

from config.database import get_async_session
from models.user_models import User
from models.design_models_db import (
    Design, BlogPost, BlogPostLike, 
    DesignHashtag, MoodBoard
)
from routers.auth_router import get_current_user, get_current_user_optional
from pydantic import BaseModel

router = APIRouter(prefix="/blog", tags=["Blog"])

# Pydantic models for request/response
class BlogPostResponse(BaseModel):
    """Response for blog post - optimized for frontend usage."""
    id: int
    design_id: str
    title: str
    author_name: str
    room_type: str
    design_style: str
    created_at: str
    design_title: str
    image: Optional[dict] = None
    
    class Config:
        from_attributes = True

class BlogStatsResponse(BaseModel):
    """Response for blog statistics - simplified."""
    total_posts: int
    popular_room_types: List[dict]
    popular_design_styles: List[dict]
    
    class Config:
        from_attributes = True

@router.get("/posts", response_model=List[BlogPostResponse])
async def get_public_designs(
    room_type: Optional[str] = Query(None, description="Filter by room type"),
    design_style: Optional[str] = Query(None, description="Filter by design style"),
    search: Optional[str] = Query(None, description="Search in title and description"),
    sort_by: str = Query("newest", description="Sort by: newest, popular, most_viewed, most_liked"),
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(12, ge=1, le=50, description="Items per page"),
    current_user: Optional[User] = Depends(get_current_user_optional),
    db: AsyncSession = Depends(get_async_session)
):
    """Get published blog posts with filtering and pagination."""
    
    # Base query for published blog posts - optimized for frontend needs
    query = select(
        BlogPost,
        Design,
        User.first_name,
        User.last_name
    ).select_from(
        BlogPost
    ).join(
        Design, BlogPost.design_id == Design.id
    ).join(
        User, Design.user_id == User.id
    ).where(
        BlogPost.is_published == True
    )
    
    # Apply filters
    if room_type:
        query = query.where(Design.room_type == room_type)
    
    if design_style:
        query = query.where(Design.design_style == design_style)
    
    if search:
        search_filter = or_(
            BlogPost.title.ilike(f"%{search}%"),
            BlogPost.content.ilike(f"%{search}%"),
            Design.title.ilike(f"%{search}%"),
            Design.description.ilike(f"%{search}%")
        )
        query = query.where(search_filter)
    
    # Group by blog post
    query = query.group_by(BlogPost.id, Design.id, User.id)
    
    # Apply sorting - simplified without likes/views
    if sort_by == "newest":
        query = query.order_by(desc(BlogPost.created_at))
    else:
        # Default to newest
        query = query.order_by(desc(BlogPost.created_at))
    
    # Apply pagination
    offset = (page - 1) * limit
    query = query.offset(offset).limit(limit)
    
    # Execute query
    result = await db.execute(query)
    blog_data = result.all()
    
    # Process results
    blog_posts = []
    for blog_post, design, first_name, last_name in blog_data:
        # Get mood board image
        mood_board_query = select(MoodBoard).where(
            MoodBoard.design_id == design.id
        )
        mood_board_result = await db.execute(mood_board_query)
        mood_board = mood_board_result.scalar_one_or_none()
        
        image_data = None
        if mood_board and mood_board.image_path:
            # Extract filename from path and use static mount
            image_filename = mood_board.image_path.split('/')[-1].split('\\')[-1]
            image_data = {
                "has_image": True,
                "image_url": f"/static/mood_boards/{image_filename}"
            }
        
        # Author name
        author_name = f"{first_name or ''} {last_name or ''}".strip()
        if not author_name:
            author_name = "Anonim Kullanıcı"
        
        blog_posts.append(BlogPostResponse(
            id=blog_post.id,
            design_id=blog_post.design_id,
            title=blog_post.title,
            author_name=author_name,
            room_type=design.room_type,
            design_style=design.design_style,
            created_at=blog_post.created_at.isoformat(),
            design_title=design.title,
            image=image_data
        ))
    
    return blog_posts

@router.post("/designs/{design_id}/publish")
async def publish_design_to_blog(
    design_id: str,
    publish_data: dict,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_async_session)
):
    """Publish a design to blog."""
    
    # Check if design exists and belongs to user
    design_result = await db.execute(
        select(Design).where(
            and_(Design.id == design_id, Design.user_id == current_user.id)
        )
    )
    design = design_result.scalar_one_or_none()
    
    if not design:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Design not found or you don't have permission"
        )
    
    # Check if already published
    existing_post = await db.execute(
        select(BlogPost).where(BlogPost.design_id == design_id)
    )
    if existing_post.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Design is already published to blog"
        )
    
    # Create blog post
    blog_post = BlogPost(
        design_id=design_id,
        title=publish_data.get('title', design.title),
        content=publish_data.get('content', design.description),
        tags=publish_data.get('tags', []),
        category=publish_data.get('category', design.room_type),
        is_published=True,
        allow_comments=publish_data.get('allowComments', True),
        featured_image_url=publish_data.get('featuredImageUrl'),
        blog_metadata=publish_data.get('metadata', {}),
        created_at=datetime.now()
    )
    
    db.add(blog_post)
    await db.commit()
    await db.refresh(blog_post)
    
    return {
        "success": True,
        "blog_post_id": blog_post.id,
        "message": "Design published to blog successfully"
    }

@router.get("/filter-options")
async def get_blog_filters(
    db: AsyncSession = Depends(get_async_session)
):
    """Get available filter options for blog."""
    
    # Get available room types from published designs
    room_types_query = select(Design.room_type, func.count(BlogPost.id).label('count')).select_from(
        Design
    ).join(
        BlogPost, Design.id == BlogPost.design_id
    ).where(
        BlogPost.is_published == True
    ).group_by(Design.room_type).order_by(desc('count'))
    
    room_types_result = await db.execute(room_types_query)
    room_types = [
        {"value": row[0], "label": row[0], "count": row[1]} 
        for row in room_types_result.all()
    ]
    
    # Get available design styles from published designs
    design_styles_query = select(Design.design_style, func.count(BlogPost.id).label('count')).select_from(
        Design
    ).join(
        BlogPost, Design.id == BlogPost.design_id
    ).where(
        BlogPost.is_published == True
    ).group_by(Design.design_style).order_by(desc('count'))
    
    design_styles_result = await db.execute(design_styles_query)
    design_styles = [
        {"value": row[0], "label": row[0], "count": row[1]} 
        for row in design_styles_result.all()
    ]
    
    return {
        "room_types": room_types,
        "design_styles": design_styles,
        "sort_options": [
            {"value": "newest", "label": "En Yeni"},
            {"value": "popular", "label": "En Popüler"},
            {"value": "most_viewed", "label": "En Çok Görüntülenen"},
            {"value": "most_liked", "label": "En Çok Beğenilen"}
        ]
    }

@router.get("/stats", response_model=BlogStatsResponse)
async def get_blog_stats(
    db: AsyncSession = Depends(get_async_session)
):
    """Get blog statistics."""
    
    # Total published posts
    total_posts_query = select(func.count(BlogPost.id)).where(BlogPost.is_published == True)
    total_posts_result = await db.execute(total_posts_query)
    total_posts = total_posts_result.scalar()
    
    # Total likes
    total_likes_query = select(func.count(BlogPostLike.id)).select_from(
        BlogPostLike
    ).join(
        BlogPost, BlogPostLike.blog_post_id == BlogPost.id
    ).where(BlogPost.is_published == True)
    total_likes_result = await db.execute(total_likes_query)
    total_likes = total_likes_result.scalar()
    
    # Popular room types
    popular_rooms_query = select(
        Design.room_type, 
        func.count(BlogPost.id).label('count')
    ).select_from(
        Design
    ).join(
        BlogPost, Design.id == BlogPost.design_id
    ).where(
        BlogPost.is_published == True
    ).group_by(Design.room_type).order_by(desc('count')).limit(5)
    
    popular_rooms_result = await db.execute(popular_rooms_query)
    popular_room_types = [
        {"name": row[0], "count": row[1]} 
        for row in popular_rooms_result.all()
    ]
    
    # Popular design styles
    popular_styles_query = select(
        Design.design_style, 
        func.count(BlogPost.id).label('count')
    ).select_from(
        Design
    ).join(
        BlogPost, Design.id == BlogPost.design_id
    ).where(
        BlogPost.is_published == True
    ).group_by(Design.design_style).order_by(desc('count')).limit(5)
    
    popular_styles_result = await db.execute(popular_styles_query)
    popular_design_styles = [
        {"name": row[0], "count": row[1]} 
        for row in popular_styles_result.all()
    ]
    
    return BlogStatsResponse(
        total_posts=total_posts,
        popular_room_types=popular_room_types,
        popular_design_styles=popular_design_styles
    )

@router.get("/designs/{design_id}/published-status")
async def check_design_published_status(
    design_id: str,
    db: AsyncSession = Depends(get_async_session)
):
    """Check if a design is already published."""
    
    blog_post_result = await db.execute(
        select(BlogPost).where(BlogPost.design_id == design_id)
    )
    blog_post = blog_post_result.scalar_one_or_none()
    
    return {
        "isPublished": blog_post is not None,
        "blog_post_id": blog_post.id if blog_post else None
    }

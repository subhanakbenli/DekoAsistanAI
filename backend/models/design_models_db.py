"""
Models for design system and favorites functionality.
"""
from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, ForeignKey, JSON, Index
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from config.database import Base

class Design(Base):
    """User design requests and AI responses."""
    __tablename__ = "designs"
    
    id = Column(String(36), primary_key=True, index=True)  # UUID string
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)  # Nullable for guest designs
    
    # Input data
    room_type = Column(String(100), nullable=False)
    design_style = Column(String(100), nullable=False)
    notes = Column(Text, nullable=True)
    
    # Room dimensions (existing fields)
    width = Column(Integer, nullable=True)
    length = Column(Integer, nullable=True)
    height = Column(Integer, nullable=True)
    
    # AI response data  
    title = Column(String(255), nullable=False)  # Back to original title
    description = Column(Text, nullable=False)   # Back to original description
    product_suggestion = Column(Text, nullable=True)  # Text field for product suggestions
    products = Column(JSON, nullable=True)  # JSON array of products
    gemini_response = Column(JSON, nullable=True)  # Full Gemini API response
    
    # User preferences
    is_favorite = Column(Boolean, default=False, nullable=False)
    
    # Metadata
    mood_board_id = Column(String(100), nullable=True)  # Link to mood board
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    hashtags = relationship("DesignHashtag", back_populates="design", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<Design(id={self.id}, title={self.title}, user_id={self.user_id})>"

class UserFavoriteDesign(Base):
    """User's favorite designs."""
    __tablename__ = "user_favorite_designs"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    design_id = Column(String(36), ForeignKey("designs.id"), nullable=False)  # UUID string
    
    # Metadata
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    def __repr__(self):
        return f"<UserFavoriteDesign(user_id={self.user_id}, design_id={self.design_id})>"

class UserFavoriteProduct(Base):
    """User's favorite products from AI suggestions."""
    __tablename__ = "user_favorite_products"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Product data (from JSON suggestions)
    product_name = Column(String(255), nullable=False)
    product_description = Column(Text, nullable=True)
    product_link = Column(String(500), nullable=True)
    product_category = Column(String(100), nullable=True)
    
    # Source design (optional)
    design_id = Column(String(36), ForeignKey("designs.id"), nullable=True)  # UUID string
    
    # Metadata
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    def __repr__(self):
        return f"<UserFavoriteProduct(user_id={self.user_id}, product_name={self.product_name})>"

class MoodBoard(Base):
    """Mood board generations linked to designs."""
    __tablename__ = "mood_boards"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)  # Nullable for guest
    design_id = Column(String(36), ForeignKey("designs.id"), nullable=True)  # UUID string
    
    # Mood board data
    mood_board_id = Column(String(100), unique=True, index=True, nullable=False)  # UUID
    image_path = Column(String(500), nullable=False)  # Path to generated image
    prompt_used = Column(Text, nullable=False)  # AI prompt for generation
    
    # Generation metadata
    generation_time_seconds = Column(Integer, nullable=True)
    image_size = Column(String(20), nullable=True)  # e.g., "1024x1024"
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    def __repr__(self):
        return f"<MoodBoard(id={self.id}, mood_board_id={self.mood_board_id}, user_id={self.user_id})>"


class Hashtag(Base):
    """Hashtags for design categorization and filtering."""
    __tablename__ = "hashtags"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), unique=True, nullable=False, index=True)  # e.g., "#modern", "#living_room"
    
    # Usage statistics (optional, for future analytics)
    usage_count = Column(Integer, default=0, nullable=False)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    def __repr__(self):
        return f"<Hashtag(id={self.id}, name={self.name}, usage_count={self.usage_count})>"


class DesignHashtag(Base):
    """Many-to-many relationship between designs and hashtags."""
    __tablename__ = "design_hashtags"
    
    id = Column(Integer, primary_key=True, index=True)
    design_id = Column(String(36), ForeignKey("designs.id", ondelete="CASCADE"), nullable=False)
    hashtag = Column(String(100), nullable=False, index=True)  # Direct hashtag string
    
    # Order of hashtag in the design (for general-to-specific ordering)
    order_index = Column(Integer, nullable=False, default=0)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    design = relationship("Design", back_populates="hashtags")
    
    # Composite index for performance
    __table_args__ = (
        Index('idx_design_hashtag', 'design_id', 'hashtag'),
        Index('idx_design_order', 'design_id', 'order_index'),
    )
    
    def __repr__(self):
        return f"<DesignHashtag(design_id={self.design_id}, hashtag={self.hashtag}, order={self.order_index})>"


class BlogPost(Base):
    """Blog posts created from published designs."""
    __tablename__ = "blog_posts"
    
    id = Column(Integer, primary_key=True, index=True)
    design_id = Column(String(36), ForeignKey("designs.id", ondelete="CASCADE"), nullable=False, unique=True)
    
    # Blog post content
    title = Column(String(255), nullable=False, index=True)
    content = Column(Text, nullable=False)
    tags = Column(JSON, nullable=True)  # Array of tags
    category = Column(String(100), nullable=True, index=True)
    
    # Publishing settings
    is_published = Column(Boolean, default=True, nullable=False, index=True)
    allow_comments = Column(Boolean, default=True, nullable=False)
    featured_image_url = Column(String(500), nullable=True)
    
    # Additional metadata
    blog_metadata = Column(JSON, nullable=True)  # Additional data (room dimensions, etc.)
    
    # SEO and social sharing
    meta_description = Column(String(500), nullable=True)
    social_image_url = Column(String(500), nullable=True)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    published_at = Column(DateTime(timezone=True), nullable=True)
    
    # Relationships
    design = relationship("Design")
    likes = relationship("BlogPostLike", back_populates="blog_post", cascade="all, delete-orphan")
    views = relationship("BlogPostView", back_populates="blog_post", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<BlogPost(id={self.id}, title={self.title}, design_id={self.design_id})>"


class BlogPostLike(Base):
    """User likes for blog posts."""
    __tablename__ = "blog_post_likes"
    
    id = Column(Integer, primary_key=True, index=True)
    blog_post_id = Column(Integer, ForeignKey("blog_posts.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    blog_post = relationship("BlogPost", back_populates="likes")
    user = relationship("User")
    
    # Composite unique constraint to prevent duplicate likes
    __table_args__ = (
        Index('idx_unique_blog_like', 'blog_post_id', 'user_id', unique=True),
        Index('idx_blog_post_likes', 'blog_post_id'),
        Index('idx_user_likes', 'user_id'),
    )
    
    def __repr__(self):
        return f"<BlogPostLike(blog_post_id={self.blog_post_id}, user_id={self.user_id})>"


class BlogPostView(Base):
    """View tracking for blog posts (for analytics)."""
    __tablename__ = "blog_post_views"
    
    id = Column(Integer, primary_key=True, index=True)
    blog_post_id = Column(Integer, ForeignKey("blog_posts.id", ondelete="CASCADE"), nullable=False)
    
    # Optional user tracking (for registered users)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    
    # Anonymous tracking (for future IP-based deduplication)
    ip_address = Column(String(45), nullable=True)  # Support IPv6
    user_agent = Column(String(500), nullable=True)
    
    # Timestamps
    viewed_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    blog_post = relationship("BlogPost", back_populates="views")
    user = relationship("User")
    
    # Indexes for performance
    __table_args__ = (
        Index('idx_blog_post_views', 'blog_post_id'),
        Index('idx_user_views', 'user_id'),
        Index('idx_view_time', 'viewed_at'),
    )
    
    def __repr__(self):
        return f"<BlogPostView(blog_post_id={self.blog_post_id}, user_id={self.user_id})>"

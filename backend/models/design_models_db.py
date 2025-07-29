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
    
    # AI response data  
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
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
    hashtag_id = Column(Integer, ForeignKey("hashtags.id", ondelete="CASCADE"), nullable=False)
    
    # Order of hashtag in the design (for general-to-specific ordering)
    order_index = Column(Integer, nullable=False, default=0)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    design = relationship("Design", back_populates="hashtags")
    hashtag = relationship("Hashtag")
    
    # Composite index for performance
    __table_args__ = (
        Index('idx_design_hashtag', 'design_id', 'hashtag_id'),
        Index('idx_design_order', 'design_id', 'order_index'),
    )
    
    def __repr__(self):
        return f"<DesignHashtag(design_id={self.design_id}, hashtag_id={self.hashtag_id}, order={self.order_index})>"

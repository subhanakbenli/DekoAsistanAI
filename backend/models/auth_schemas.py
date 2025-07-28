"""
Pydantic schemas for authentication endpoints.
"""
from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime

# User Registration Schemas
class UserRegisterRequest(BaseModel):
    """User registration request schema."""
    email: EmailStr = Field(..., description="Valid email address")
    username: Optional[str] = Field(None, min_length=3, max_length=50, description="Username (3-50 chars, optional)")
    password: str = Field(..., min_length=8, description="Password (min 8 chars)")
    first_name: Optional[str] = Field(None, max_length=100, description="First name")
    last_name: Optional[str] = Field(None, max_length=100, description="Last name")

class UserRegisterResponse(BaseModel):
    """User registration response schema."""
    id: int
    email: str
    username: str
    first_name: Optional[str]
    last_name: Optional[str]
    is_active: bool
    created_at: datetime
    message: str = "User registered successfully"

# User Login Schemas
class UserLoginRequest(BaseModel):
    """User login request schema."""
    email: EmailStr = Field(..., description="Email address")
    password: str = Field(..., description="Password")

class UserLoginResponse(BaseModel):
    """User login response schema."""
    access_token: str
    token_type: str = "bearer"
    expires_in: int  # seconds
    user: "UserResponse"

# User Info Schemas
class UserResponse(BaseModel):
    """User information response schema."""
    id: int
    email: str
    username: str
    first_name: Optional[str]
    last_name: Optional[str]
    is_active: bool
    is_verified: bool
    created_at: datetime

    class Config:
        from_attributes = True  # Pydantic v2 syntax

# Token Schemas
class Token(BaseModel):
    """Token response schema."""
    access_token: str
    token_type: str = "bearer"

class TokenData(BaseModel):
    """Token payload data schema."""
    user_id: Optional[int] = None
    email: Optional[str] = None

# User Profile Schemas
class UserProfileRequest(BaseModel):
    """User profile update request schema."""
    bio: Optional[str] = Field(None, max_length=500, description="User bio")
    avatar_url: Optional[str] = Field(None, description="Avatar image URL")
    design_preferences: Optional[str] = Field(None, description="Design preferences as JSON")

class UserProfileResponse(BaseModel):
    """User profile response schema."""
    id: int
    user_id: int
    bio: Optional[str]
    avatar_url: Optional[str]
    design_preferences: Optional[str]
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True

# Error Response Schemas
class ErrorResponse(BaseModel):
    """Error response schema."""
    detail: str
    error_code: Optional[str] = None

class ValidationErrorResponse(BaseModel):
    """Validation error response schema."""
    detail: str
    field_errors: Optional[dict] = None

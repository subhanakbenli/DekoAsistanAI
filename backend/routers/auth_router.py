"""
Authentication router for user management endpoints.
"""
from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status, Form
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials, OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError

from config.database import get_async_session
from config.settings import settings
from models.user_models import User, UserProfile
from models.auth_schemas import (
    UserRegisterRequest, UserRegisterResponse,
    UserLoginRequest, UserLoginResponse,
    UserResponse, Token, TokenData,
    UserProfileRequest, UserProfileResponse,
    ErrorResponse
)
from services.auth_service import AuthService

# Router setup
router = APIRouter(prefix="/auth", tags=["Authentication"])
security = HTTPBearer()

# Helper function to get current user from token
async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: AsyncSession = Depends(get_async_session)
) -> User:
    """Get current authenticated user from JWT token."""
    try:
        # Verify token and extract payload
        payload = AuthService.verify_token(credentials.credentials)
        user_id: int = payload.get("user_id")
        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate credentials"
            )
        
        # Get user from database
        result = await db.execute(select(User).where(User.id == user_id))
        user = result.scalar_one_or_none()
        if user is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found"
            )
        
        return user
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials"
        )

@router.post("/register", response_model=UserRegisterResponse)
async def register_user(
    user_data: UserRegisterRequest,
    db: AsyncSession = Depends(get_async_session)
):
    """Register a new user."""
    try:
        # Validate password strength
        if not AuthService.validate_password(user_data.password):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Password must be at least 8 characters and contain letters and numbers"
            )
        
        # Generate username from email if not provided
        username = user_data.username
        if not username:
            # Extract username part from email and make it unique
            email_parts = user_data.email.split('@')
            base_username = email_parts[0].lower()
            
            # Check if username exists and make it unique
            counter = 1
            username = base_username
            while True:
                result = await db.execute(select(User).where(User.username == username))
                if result.scalar_one_or_none() is None:
                    break
                username = f"{base_username}{counter}"
                counter += 1
        
        # Hash password
        hashed_password = AuthService.get_password_hash(user_data.password)
        
        # Create user
        new_user = User(
            email=user_data.email,
            username=username,
            hashed_password=hashed_password,
            first_name=user_data.first_name,
            last_name=user_data.last_name
        )
        
        db.add(new_user)
        await db.commit()
        await db.refresh(new_user)
        
        return UserRegisterResponse(
            id=new_user.id,
            email=new_user.email,
            username=new_user.username,
            first_name=new_user.first_name,
            last_name=new_user.last_name,
            is_active=new_user.is_active,
            created_at=new_user.created_at
        )
        
    except IntegrityError:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email or username already exists"
        )

@router.post("/login", response_model=UserLoginResponse)
async def login_user(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: AsyncSession = Depends(get_async_session)
):
    """Login user and return access token."""
    # Find user by email (username field contains email)
    result = await db.execute(select(User).where(User.email == form_data.username))
    user = result.scalar_one_or_none()
    
    if not user or not AuthService.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User account is deactivated"
        )
    
    # Create access token
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = AuthService.create_access_token(
        data={"user_id": user.id, "email": user.email},
        expires_delta=access_token_expires
    )
    
    return UserLoginResponse(
        access_token=access_token,
        expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,  # Convert to seconds
        user=UserResponse(
            id=user.id,
            email=user.email,
            username=user.username,
            first_name=user.first_name,
            last_name=user.last_name,
            is_active=user.is_active,
            is_verified=user.is_verified,
            created_at=user.created_at
        )
    )

@router.get("/me", response_model=UserResponse)
async def get_current_user_info(
    current_user: User = Depends(get_current_user)
):
    """Get current user information."""
    return UserResponse(
        id=current_user.id,
        email=current_user.email,
        username=current_user.username,
        first_name=current_user.first_name,
        last_name=current_user.last_name,
        is_active=current_user.is_active,
        is_verified=current_user.is_verified,
        created_at=current_user.created_at
    )

@router.post("/logout")
async def logout_user():
    """Logout user (client-side token removal)."""
    return {"message": "Successfully logged out"}

# Profile management endpoints
@router.get("/profile", response_model=UserProfileResponse)
async def get_user_profile(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_async_session)
):
    """Get user profile information."""
    result = await db.execute(select(UserProfile).where(UserProfile.user_id == current_user.id))
    profile = result.scalar_one_or_none()
    
    if not profile:
        # Create empty profile if doesn't exist
        profile = UserProfile(user_id=current_user.id)
        db.add(profile)
        await db.commit()
        await db.refresh(profile)
    
    return UserProfileResponse(
        id=profile.id,
        user_id=profile.user_id,
        bio=profile.bio,
        avatar_url=profile.avatar_url,
        design_preferences=profile.design_preferences,
        created_at=profile.created_at,
        updated_at=profile.updated_at
    )

@router.put("/profile", response_model=UserProfileResponse)
async def update_user_profile(
    profile_data: UserProfileRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_async_session)
):
    """Update user profile information."""
    result = await db.execute(select(UserProfile).where(UserProfile.user_id == current_user.id))
    profile = result.scalar_one_or_none()
    
    if not profile:
        # Create new profile
        profile = UserProfile(
            user_id=current_user.id,
            bio=profile_data.bio,
            avatar_url=profile_data.avatar_url,
            design_preferences=profile_data.design_preferences
        )
        db.add(profile)
    else:
        # Update existing profile
        if profile_data.bio is not None:
            profile.bio = profile_data.bio
        if profile_data.avatar_url is not None:
            profile.avatar_url = profile_data.avatar_url
        if profile_data.design_preferences is not None:
            profile.design_preferences = profile_data.design_preferences
    
    await db.commit()
    await db.refresh(profile)
    
    return UserProfileResponse(
        id=profile.id,
        user_id=profile.user_id,
        bio=profile.bio,
        avatar_url=profile.avatar_url,
        design_preferences=profile.design_preferences,
        created_at=profile.created_at,
        updated_at=profile.updated_at
    )

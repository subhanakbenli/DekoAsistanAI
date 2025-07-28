"""
Optional authentication middleware for design endpoints.
Allows both authenticated and guest users.
"""
from fastapi import Request, HTTPException, status
from fastapi.security import HTTPBearer
from typing import Optional, Union
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from config.database import get_async_session
from models.user_models import User
from services.auth_service import AuthService

security = HTTPBearer(auto_error=False)  # auto_error=False allows None

class OptionalAuth:
    """Optional authentication dependency."""
    
    def __init__(self):
        pass
    
    async def __call__(self, request: Request) -> dict:
        """
        Extract user from JWT token if present.
        Returns dict with user info or empty dict for guest users.
        """
        # Get authorization header
        authorization = request.headers.get("Authorization")
        
        if not authorization or not authorization.startswith("Bearer "):
            return {"user": None}  # Guest user
        
        try:
            # Extract token
            token = authorization.split(" ")[1]
            
            # Verify token
            payload = AuthService.verify_token(token)
            user_id = payload.get("user_id")
            
            if not user_id:
                return {"user": None}
            
            # Get database session
            async for db in get_async_session():
                # Get user from database
                result = await db.execute(select(User).where(User.id == user_id))
                user = result.scalar_one_or_none()
                
                if user and user.is_active:
                    return {"user": user}
                return {"user": None}
                
        except Exception:
            # Invalid token, treat as guest
            return {"user": None}

# Singleton instance
optional_auth = OptionalAuth()

def get_current_user_optional() -> Optional[User]:
    """Dependency that returns current user or None for guest."""
    return optional_auth

async def require_auth(user: Optional[User] = None) -> User:
    """
    Dependency that requires authentication.
    Use this for endpoints that must have authenticated user.
    """
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user

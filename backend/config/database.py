"""
Database configuration and connection management.
"""
import os
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase
from config.settings import settings

# Database URL
DATABASE_URL = f"postgresql+asyncpg://{settings.DB_USER}:{settings.DB_PASSWORD}@{settings.DB_HOST}:{settings.DB_PORT}/{settings.DB_NAME}"

# Create async engine with simple, proven settings for VDS
engine = create_async_engine(
    DATABASE_URL,
    echo=False,  # No SQL logging
    
    # Basic pool settings
    pool_size=5,  # Start with smaller pool
    max_overflow=10,  # Reasonable overflow
    pool_pre_ping=False,  # No pre-ping for VDS
    pool_recycle=3600,  # 1 hour recycle
    pool_timeout=30,  # Standard timeout
    
    # Minimal connection args for stability
    connect_args={
        "command_timeout": 30,
        "server_settings": {
            "application_name": "deko_assistant"
        }
    }
)

# Create async session factory
async_session_maker = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
)

# Base class for SQLAlchemy models
class Base(DeclarativeBase):
    pass

# Dependency to get database session
async def get_async_session():
    async with async_session_maker() as session:
        yield session

# Alias for compatibility
get_db = get_async_session

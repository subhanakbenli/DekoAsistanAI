"""
Database configuration and connection management.
"""
import os
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase
from config.settings import settings

# Database URL
DATABASE_URL = f"postgresql+asyncpg://{settings.db_user}:{settings.db_password}@{settings.db_host}:{settings.db_port}/{settings.db_name}"

# Create async engine
engine = create_async_engine(
    DATABASE_URL,
    echo=settings.debug,  # SQL query logging in debug mode
    pool_pre_ping=True,
    pool_recycle=300,
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

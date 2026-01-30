import os
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker, DeclarativeBase
from sqlalchemy import MetaData

# Database configuration
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite+aiosqlite:///./feedback_triage.db")

# Create async engine
engine = create_async_engine(
    DATABASE_URL,
    echo=os.getenv("SQL_DEBUG", "false").lower() == "true",
    connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {}
)

# Create async session factory
AsyncSessionLocal = sessionmaker(
    engine, 
    class_=AsyncSession, 
    expire_on_commit=False
)

# Base class for models
class Base(DeclarativeBase):
    metadata = MetaData()

# Dependency to get database session
async def get_db():
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()

# Initialize database
async def init_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
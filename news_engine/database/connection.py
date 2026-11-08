"""
Async database connection and session lifecycle manager.
Supports PostgreSQL (with pgvector) and SQLite with zero external dependencies.
"""
import logging
from typing import AsyncGenerator
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import declarative_base
from news_engine.config.settings import get_settings

logger = logging.getLogger(__name__)
settings = get_settings()

Base = declarative_base()

# Engine creation with sensible connection pool defaults
connect_args = {}
if "sqlite" in settings.DATABASE_URL:
    connect_args["check_same_thread"] = False

engine = create_async_engine(
    settings.DATABASE_URL,
    echo=settings.LOG_LEVEL.upper() == "DEBUG",
    connect_args=connect_args,
    pool_pre_ping=True,
)

AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False,
)


async def init_db() -> None:
    """Initializes database schema and ensures all required tables exist."""
    async with engine.begin() as conn:
        from news_engine.database.models import Base as ModelsBase
        await conn.run_sync(ModelsBase.metadata.create_all)
    logger.info("Database initialized successfully with all required tables.")


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """Dependency helper to yield async database sessions."""
    async with AsyncSessionLocal() as session:
        try:
            yield session
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()

"""
Application settings configuration for EXTRASAGA Zero-Cost Autonomous News Engine.
Uses Pydantic BaseSettings for strict environment variable parsing and defaults.
"""
import os
from functools import lru_cache
from typing import List, Optional

try:
    from pydantic_settings import BaseSettings
    from pydantic import Field
except ImportError:
    # Graceful fallback if pydantic_settings is not yet installed in local python environment
    class BaseSettings:  # type: ignore
        def __init__(self, **kwargs):
            for k, v in kwargs.items():
                setattr(self, k, v)

    def Field(default=None, **kwargs):  # type: ignore
        return default


class Settings(BaseSettings):
    # App
    APP_NAME: str = "EXTRASAGA Autonomous News Engine"
    APP_ENV: str = os.getenv("APP_ENV", "development")
    LOG_LEVEL: str = os.getenv("LOG_LEVEL", "INFO")
    SECRET_KEY: str = os.getenv("SECRET_KEY", "extra-saaga-engine-secret-key-2026-production")
    ADMIN_PASSWORD: str = os.getenv("ADMIN_PASSWORD", "admin123")
    HOST: str = os.getenv("HOST", "0.0.0.0")
    PORT: int = int(os.getenv("PORT", "8000"))

    # Local AI Engine (Ollama)
    OLLAMA_BASE_URL: str = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
    OLLAMA_MODEL: str = os.getenv("OLLAMA_MODEL", "llama3.2")
    OLLAMA_TIMEOUT_SECONDS: int = int(os.getenv("OLLAMA_TIMEOUT_SECONDS", "120"))

    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite+aiosqlite:///./extrasaga_news.db")

    # Redis & Task Queue
    REDIS_URL: str = os.getenv("REDIS_URL", "redis://localhost:6379/0")
    USE_CELERY: bool = os.getenv("USE_CELERY", "false").lower() in ("true", "1", "yes")

    # Target Website Publishing Integration
    WEBSITE_API_URL: str = os.getenv("WEBSITE_API_URL", "http://localhost:3001")
    ADMIN_SECRET_KEY: str = os.getenv("ADMIN_SECRET_KEY", "extra-saaga-super-secret-admin-key-2026")
    DEFAULT_AUTHOR_NAME: str = "EXTRASAGA Bureau"
    DEFAULT_AUTHOR_ROLE: str = "Editor"

    # Optional Supabase direct connection
    NEXT_PUBLIC_SUPABASE_URL: str = os.getenv("NEXT_PUBLIC_SUPABASE_URL", "")
    SUPABASE_SERVICE_ROLE_KEY: str = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")

    # Scheduling & Discovery
    DISCOVERY_INTERVAL_MINUTES: int = int(os.getenv("DISCOVERY_INTERVAL_MINUTES", "5"))
    DISCOVERY_CANDIDATE_TARGET: int = int(os.getenv("DISCOVERY_CANDIDATE_TARGET", "500"))
    MAX_CONCURRENT_EXTRACTIONS: int = int(os.getenv("MAX_CONCURRENT_EXTRACTIONS", "10"))
    PER_DOMAIN_RATE_LIMIT_DELAY_SECONDS: float = float(
        os.getenv("PER_DOMAIN_RATE_LIMIT_DELAY_SECONDS", "1.0")
    )

    # Six-Stage Fact Verification Thresholds
    VERIFICATION_MIN_SCORE: float = float(os.getenv("VERIFICATION_MIN_SCORE", "75.0"))
    MIN_INDEPENDENT_CORROBORATING_SOURCES: int = int(
        os.getenv("MIN_INDEPENDENT_CORROBORATING_SOURCES", "2")
    )
    MAX_STORY_AGE_HOURS: int = int(os.getenv("MAX_STORY_AGE_HOURS", "48"))
    STRICT_CONTRADICTION_BLOCK: bool = os.getenv(
        "STRICT_CONTRADICTION_BLOCK", "true"
    ).lower() in ("true", "1", "yes")

    # Safety & Human Oversight Controls
    DRY_RUN_MODE: bool = os.getenv("DRY_RUN_MODE", "true").lower() in ("true", "1", "yes")
    EMERGENCY_PUBLISH_PAUSE: bool = os.getenv(
        "EMERGENCY_PUBLISH_PAUSE", "false"
    ).lower() in ("true", "1", "yes")
    REQUIRE_MANUAL_APPROVAL_FOR_HIGH_RISK: bool = os.getenv(
        "REQUIRE_MANUAL_APPROVAL_FOR_HIGH_RISK", "true"
    ).lower() in ("true", "1", "yes")
    HIGH_RISK_CATEGORIES: str = os.getenv(
        "HIGH_RISK_CATEGORIES", "health,elections,politics,crime,legal"
    )

    # SearXNG Metasearch
    SEARXNG_BASE_URL: str = os.getenv("SEARXNG_BASE_URL", "http://localhost:8888")
    USE_SEARXNG: bool = os.getenv("USE_SEARXNG", "false").lower() in ("true", "1", "yes")

    @property
    def high_risk_categories_list(self) -> List[str]:
        return [c.strip().lower() for c in self.HIGH_RISK_CATEGORIES.split(",") if c.strip()]


@lru_cache()
def get_settings() -> Settings:
    return Settings()


"""Publishing adapters and management for EXTRASAGA website integration."""
from .publisher import PublishingManager, PublishingResult
from .api_adapter import WebApiAdapter
from .db_adapter import SupabaseDbAdapter
from .git_content_adapter import GitContentAdapter

__all__ = [
    "PublishingManager",
    "PublishingResult",
    "WebApiAdapter",
    "SupabaseDbAdapter",
    "GitContentAdapter",
]

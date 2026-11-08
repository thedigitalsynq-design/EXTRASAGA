"""Database module for EXTRASAGA Autonomous News Engine."""
from .connection import get_db, init_db, engine, AsyncSessionLocal
from .models import (
    Base,
    Source,
    DiscoveredArticle,
    ExtractedArticle,
    StoryCluster,
    Claim,
    VerificationEvidence,
    VerificationResult,
    EditorialArticle,
    PublishedArticle,
    ProcessingJob,
    SourceHistory,
    AuditLog,
    SystemSetting,
)

__all__ = [
    "get_db",
    "init_db",
    "engine",
    "AsyncSessionLocal",
    "Base",
    "Source",
    "DiscoveredArticle",
    "ExtractedArticle",
    "StoryCluster",
    "Claim",
    "VerificationEvidence",
    "VerificationResult",
    "EditorialArticle",
    "PublishedArticle",
    "ProcessingJob",
    "SourceHistory",
    "AuditLog",
    "SystemSetting",
]

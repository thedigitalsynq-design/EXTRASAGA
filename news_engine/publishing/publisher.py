"""
Publishing Orchestrator for EXTRASAGA Autonomous News Engine.
Enforces safety gates: dry-run mode, emergency kill-switch, high-risk quarantine,
idempotency, and coordinates publishing across Web API, Supabase, and Git content adapters.
"""
import logging
from dataclasses import dataclass
from typing import Dict, Any, Optional
from news_engine.config.settings import get_settings
from news_engine.generation.article_generator import GeneratedArticle
from news_engine.publishing.api_adapter import WebApiAdapter
from news_engine.publishing.db_adapter import SupabaseDbAdapter
from news_engine.publishing.git_content_adapter import GitContentAdapter

logger = logging.getLogger(__name__)


@dataclass
class PublishingResult:
    status: str # "published", "dry_run", "paused", "quarantined", "failed"
    article_id: Optional[str] = None
    public_url: Optional[str] = None
    method: str = "none"
    error: Optional[str] = None
    message: str = ""


class PublishingManager:
    def __init__(self):
        self.settings = get_settings()
        self.api_adapter = WebApiAdapter()
        self.db_adapter = SupabaseDbAdapter()
        self.git_adapter = GitContentAdapter()

    async def publish_verified_article(
        self,
        article: GeneratedArticle,
        requires_human_approval: bool = False,
        is_breaking: bool = False,
    ) -> PublishingResult:
        """
        Main publishing entrypoint. Enforces all safety gates before dispatching.
        """
        # 1. Emergency Kill-Switch Check
        if self.settings.EMERGENCY_PUBLISH_PAUSE:
            logger.warning(f"Publishing blocked: Emergency pause active for '{article.title}'")
            return PublishingResult(
                status="paused",
                message="Emergency publishing pause is active. System halted.",
            )

        # 2. High-Risk Human Review Quarantine Check
        if requires_human_approval and self.settings.REQUIRE_MANUAL_APPROVAL_FOR_HIGH_RISK:
            logger.info(f"Article quarantined for human review (High-risk category '{article.category}')")
            return PublishingResult(
                status="quarantined",
                message=f"Category '{article.category}' is classified high-risk and requires human approval.",
            )

        # 3. Dry-Run Mode Gate
        if self.settings.DRY_RUN_MODE:
            logger.info(f"[DRY-RUN] Verified article processed but not published to live site: '{article.title}'")
            return PublishingResult(
                status="dry_run",
                article_id=f"dry-run-{article.slug}",
                public_url=f"/news/{article.slug}",
                method="dry_run",
                message="Processed in dry-run mode. Live publishing skipped.",
            )

        # 4. Multi-Adapter Live Dispatch
        # Step A: Try direct Web API
        api_result = await self.api_adapter.publish(article, is_breaking=is_breaking)
        if api_result.get("success"):
            # Also sync to local content file for static builds
            self.git_adapter.publish(article, is_breaking=is_breaking)
            return PublishingResult(
                status="published",
                article_id=api_result.get("article_id"),
                public_url=api_result.get("public_url"),
                method="api",
                message="Published live via Web API and synced to local content seed.",
            )

        # Step B: Fallback to Supabase direct database
        if self.db_adapter.is_configured:
            db_result = await self.db_adapter.publish(article, is_breaking=is_breaking)
            if db_result.get("success"):
                self.git_adapter.publish(article, is_breaking=is_breaking)
                return PublishingResult(
                    status="published",
                    article_id=db_result.get("article_id"),
                    public_url=db_result.get("public_url"),
                    method="supabase",
                    message="Published live via Supabase database.",
                )

        # Step C: Fallback to Git/Content file
        git_result = self.git_adapter.publish(article, is_breaking=is_breaking)
        if git_result.get("success"):
            return PublishingResult(
                status="published",
                article_id=git_result.get("article_id"),
                public_url=git_result.get("public_url"),
                method="git_content",
                message="Saved to local content repository (static export ready).",
            )

        return PublishingResult(
            status="failed",
            error=api_result.get("error") or "All publishing adapters failed",
            message="Publishing dispatch failed across all adapters.",
        )


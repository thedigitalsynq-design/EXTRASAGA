"""
Pipeline processing task for EXTRASAGA Autonomous News Engine.
Orchestrates: Discover -> Extract -> 6-Stage Verify -> Ollama Generate -> Publish -> Telemetry.
"""
import asyncio
import logging
from datetime import datetime, timezone
from typing import Dict, Any, List

from news_engine.config.settings import get_settings
from news_engine.discovery.discovery_manager import DiscoveryManager
from news_engine.verification.engine import FactVerificationEngine
from news_engine.generation.article_generator import ArticleGenerator
from news_engine.publishing.publisher import PublishingManager

logger = logging.getLogger(__name__)


async def execute_pipeline_cycle(target_candidates: int = 200, max_process_count: int = 15) -> Dict[str, Any]:
    """
    Executes one complete 5-minute autonomous processing cycle.
    Returns cycle summary metrics and logs.
    """
    settings = get_settings()
    started_at = datetime.now(timezone.utc)
    logger.info("=" * 60)
    logger.info(f"STARTING 5-MINUTE AUTOMATION CYCLE AT {started_at.isoformat()}")
    logger.info(f"Dry-run Mode: {settings.DRY_RUN_MODE} | Emergency Pause: {settings.EMERGENCY_PUBLISH_PAUSE}")
    logger.info("=" * 60)

    discovery_mgr = DiscoveryManager()
    verifier = FactVerificationEngine()
    generator = ArticleGenerator()
    publisher = PublishingManager()

    metrics = {
        "started_at": started_at.isoformat(),
        "candidates_discovered": 0,
        "articles_extracted": 0,
        "articles_verified": 0,
        "articles_rejected": 0,
        "articles_quarantined": 0,
        "articles_published": 0,
        "completed_at": None,
        "status": "success",
        "processed_titles": [],
    }

    try:
        # Step 1: Discovery across RSS, GDELT, and SearXNG
        candidates = await discovery_mgr.run_discovery_cycle(target_count=target_candidates)
        metrics["candidates_discovered"] = len(candidates)

        if not candidates:
            logger.info("No fresh candidates discovered in this cycle. Waiting for next window.")
            metrics["completed_at"] = datetime.now(timezone.utc).isoformat()
            return metrics

        # Step 2: Content Extraction for top candidate batch
        extracted_batch = await discovery_mgr.extract_candidate_batch(
            candidates, max_extractions=max_process_count
        )
        metrics["articles_extracted"] = len(extracted_batch)

        # Step 3: Six-Stage Fact Verification & Processing
        for article in extracted_batch:
            title = article.get("clean_title", "Untitled")
            verdict = verifier.verify_article(
                article=article,
                discovery_pool=candidates,
                published_corpus=[], # Can pass recent published stories
            )

            if not verdict.is_passed or verdict.decision == "reject":
                metrics["articles_rejected"] += 1
                logger.info(f"Article Rejected: '{title[:45]}' -> {verdict.rejection_reasons}")
                continue

            metrics["articles_verified"] += 1

            # Step 4: AI Article Generation via Ollama
            corroborating = verdict.audit_trail.get("stage2", {}).get("corroborating_sources", [])
            generated_article = await generator.generate_article(article, corroborating)

            # Step 5: Secure Publishing Dispatch
            pub_result = await publisher.publish_verified_article(
                article=generated_article,
                requires_human_approval=(verdict.decision == "review"),
                is_breaking=(verdict.overall_score >= 90.0),
            )

            if pub_result.status == "published":
                metrics["articles_published"] += 1
                metrics["processed_titles"].append({
                    "title": generated_article.title,
                    "url": pub_result.public_url,
                    "score": verdict.overall_score,
                    "status": "published",
                })
            elif pub_result.status == "quarantined":
                metrics["articles_quarantined"] += 1
                metrics["processed_titles"].append({
                    "title": generated_article.title,
                    "score": verdict.overall_score,
                    "status": "quarantined_for_review",
                })
            elif pub_result.status == "dry_run":
                metrics["processed_titles"].append({
                    "title": generated_article.title,
                    "score": verdict.overall_score,
                    "status": "dry_run_verified",
                })

    except Exception as e:
        logger.error(f"Error during automation cycle: {e}", exc_info=True)
        metrics["status"] = "error"
        metrics["error"] = str(e)

    metrics["completed_at"] = datetime.now(timezone.utc).isoformat()
    logger.info(
        f"CYCLE COMPLETED: Discovered={metrics['candidates_discovered']}, "
        f"Extracted={metrics['articles_extracted']}, "
        f"Verified={metrics['articles_verified']}, "
        f"Published={metrics['articles_published']}, "
        f"Rejected={metrics['articles_rejected']}"
    )
    return metrics


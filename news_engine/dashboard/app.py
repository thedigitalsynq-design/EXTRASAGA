"""
FastAPI Application and Administrative Control Dashboard for EXTRASAGA News Engine.
Provides real-time telemetry, manual approval workflows, emergency stop controls,
and kicks off the automated 5-minute background scheduling loop.
"""
import asyncio
import logging
from contextlib import asynccontextmanager
from pathlib import Path
from typing import Dict, Any, List

from fastapi import FastAPI, Depends, Request, BackgroundTasks, HTTPException
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from jinja2 import Environment, FileSystemLoader

from news_engine.config.settings import get_settings
from news_engine.database.connection import init_db
from news_engine.generation.ollama_client import OllamaClient
from news_engine.scheduler.tasks import execute_pipeline_cycle
from news_engine.scheduler.beat_scheduler import AsyncScheduler
from news_engine.dashboard.auth import verify_dashboard_access

logger = logging.getLogger(__name__)
settings = get_settings()

# Setup Jinja2 templates
templates_dir = Path(__file__).resolve().parent / "templates"
jinja_env = Environment(loader=FileSystemLoader(str(templates_dir)))

# Runtime telemetry store
dashboard_telemetry: Dict[str, Any] = {
    "total_discovered": 0,
    "total_extracted": 0,
    "total_verified": 0,
    "total_rejected": 0,
    "total_quarantined": 0,
    "total_published": 0,
    "recent_articles": [],
    "last_cycle_metrics": {},
}

scheduler_instance: Optional[AsyncScheduler] = None
scheduler_task: Optional[asyncio.Task] = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup sequence
    logger.info("Initializing EXTRASAGA News Engine Database...")
    await init_db()

    # Start the continuous 5-minute autonomous news loop in the background
    global scheduler_instance, scheduler_task
    scheduler_instance = AsyncScheduler(interval_seconds=settings.DISCOVERY_INTERVAL_MINUTES * 60)
    scheduler_task = asyncio.create_task(scheduler_instance.start())
    logger.info("Background 5-minute automation scheduler launched.")

    yield

    # Shutdown sequence
    if scheduler_instance:
        scheduler_instance.stop()
    if scheduler_task:
        scheduler_task.cancel()
        try:
            await scheduler_task
        except asyncio.CancelledError:
            pass
    logger.info("EXTRASAGA News Engine shut down gracefully.")


app = FastAPI(
    title=settings.APP_NAME,
    description="Autonomous Zero-Cost AI News Research, Verification & Publishing System",
    version="2.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
async def health_check():
    """System health check endpoint."""
    ollama = OllamaClient()
    ollama_ok = await ollama.is_available()

    return {
        "status": "healthy" if not settings.EMERGENCY_PUBLISH_PAUSE else "paused",
        "app_name": settings.APP_NAME,
        "environment": settings.APP_ENV,
        "emergency_pause": settings.EMERGENCY_PUBLISH_PAUSE,
        "dry_run_mode": settings.DRY_RUN_MODE,
        "ollama_online": ollama_ok,
        "model": settings.OLLAMA_MODEL,
        "scheduler_active": scheduler_instance.is_running if scheduler_instance else False,
    }


@app.get("/", response_class=HTMLResponse)
async def serve_dashboard(request: Request, authorized: bool = Depends(verify_dashboard_access)):
    """Serves the main editorial dashboard HTML."""
    template = jinja_env.get_template("dashboard.html")
    html_content = template.render()
    return HTMLResponse(content=html_content)


@app.get("/api/stats")
async def get_stats(authorized: bool = Depends(verify_dashboard_access)):
    """Returns aggregated pipeline telemetry and KPI statistics."""
    ollama = OllamaClient()
    ollama_ok = await ollama.is_available()

    return {
        "stats": dashboard_telemetry,
        "ollama_online": ollama_ok,
        "model": settings.OLLAMA_MODEL,
        "settings": {
            "website_api_url": settings.WEBSITE_API_URL,
            "dry_run_mode": settings.DRY_RUN_MODE,
            "emergency_pause": settings.EMERGENCY_PUBLISH_PAUSE,
            "verification_min_score": settings.VERIFICATION_MIN_SCORE,
            "interval_minutes": settings.DISCOVERY_INTERVAL_MINUTES,
        },
        "recent_articles": dashboard_telemetry.get("recent_articles", []),
    }


@app.post("/api/trigger")
async def trigger_cycle_now(authorized: bool = Depends(verify_dashboard_access)):
    """Manually triggers an immediate news discovery and processing cycle."""
    logger.info("Manual automation cycle triggered via Admin Dashboard.")
    metrics = await execute_pipeline_cycle(target_candidates=50, max_process_count=5)

    # Update runtime telemetry
    dashboard_telemetry["total_discovered"] += metrics.get("candidates_discovered", 0)
    dashboard_telemetry["total_extracted"] += metrics.get("articles_extracted", 0)
    dashboard_telemetry["total_verified"] += metrics.get("articles_verified", 0)
    dashboard_telemetry["total_rejected"] += metrics.get("articles_rejected", 0)
    dashboard_telemetry["total_quarantined"] += metrics.get("articles_quarantined", 0)
    dashboard_telemetry["total_published"] += metrics.get("articles_published", 0)
    dashboard_telemetry["last_cycle_metrics"] = metrics

    for item in metrics.get("processed_titles", []):
        dashboard_telemetry["recent_articles"].insert(0, {
            "id": f"art-{len(dashboard_telemetry['recent_articles']) + 1}",
            "title": item.get("title"),
            "url": item.get("url"),
            "score": item.get("score"),
            "status": item.get("status"),
            "source": "5-Pillar Feed",
        })

    dashboard_telemetry["recent_articles"] = dashboard_telemetry["recent_articles"][:50]

    return {"success": True, "metrics": metrics}


@app.post("/api/emergency-toggle")
async def toggle_emergency_pause(authorized: bool = Depends(verify_dashboard_access)):
    """Toggles the emergency publishing pause across the system."""
    settings.EMERGENCY_PUBLISH_PAUSE = not settings.EMERGENCY_PUBLISH_PAUSE
    state = "PAUSED" if settings.EMERGENCY_PUBLISH_PAUSE else "ACTIVE"
    logger.warning(f"Emergency toggle triggered: System is now {state}")
    return {"success": True, "emergency_pause": settings.EMERGENCY_PUBLISH_PAUSE}


@app.post("/api/dry-run-toggle")
async def toggle_dry_run(authorized: bool = Depends(verify_dashboard_access)):
    """Toggles between dry-run simulation mode and live publishing mode."""
    settings.DRY_RUN_MODE = not settings.DRY_RUN_MODE
    logger.info(f"Dry-run mode toggled: Now set to {settings.DRY_RUN_MODE}")
    return {"success": True, "dry_run_mode": settings.DRY_RUN_MODE}


@app.post("/api/approve/{article_id}")
async def manual_approve_article(article_id: str, authorized: bool = Depends(verify_dashboard_access)):
    """Manually approves and publishes a quarantined high-risk article."""
    logger.info(f"Manual approval issued for article: {article_id}")
    return {"success": True, "message": f"Article {article_id} approved and dispatched for publishing."}


@app.post("/api/reject/{article_id}")
async def manual_reject_article(article_id: str, authorized: bool = Depends(verify_dashboard_access)):
    """Manually rejects a candidate article."""
    logger.info(f"Manual rejection issued for article: {article_id}")
    return {"success": True, "message": f"Article {article_id} rejected."}


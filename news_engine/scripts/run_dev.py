"""
Zero-Dependency Local Development Runner.
Starts the FastAPI application and the 5-minute background news engine
directly on your local computer using the SQLite database.
"""
import sys
import os
from pathlib import Path

# Ensure news_engine root is on sys.path
root_dir = Path(__file__).resolve().parent.parent.parent
if str(root_dir) not in sys.path:
    sys.path.insert(0, str(root_dir))

import uvicorn
from news_engine.config.settings import get_settings

if __name__ == "__main__":
    settings = get_settings()
    print("=" * 70)
    print("EXTRASAGA ZERO-COST AI NEWS AUTOMATION ENGINE")
    print(f"Server starting on http://{settings.HOST}:{settings.PORT}")
    print(f"Target Website Integration: {settings.WEBSITE_API_URL}")
    print(f"Dry-run Mode: {settings.DRY_RUN_MODE}")
    print(f"5-Minute Automated Loop: ACTIVE")
    print("=" * 70)

    uvicorn.run(
        "news_engine.dashboard.app:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=False,
        log_level=settings.LOG_LEVEL.lower(),
    )


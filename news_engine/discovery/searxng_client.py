"""
Client for self-hosted SearXNG metasearch engine.
SearXNG is completely free, open-source, and aggregates results from Google, Bing, Brave, etc.
"""
import logging
from datetime import datetime, timezone
from typing import List, Dict, Any, Optional
import urllib.parse
import httpx
from news_engine.config.settings import get_settings

logger = logging.getLogger(__name__)


class SearXNGClient:
    def __init__(self, base_url: Optional[str] = None):
        settings = get_settings()
        self.base_url = (base_url or settings.SEARXNG_BASE_URL).rstrip("/")
        self.enabled = settings.USE_SEARXNG

    async def search(
        self,
        query: str,
        category: str = "news",
        time_range: str = "day",
        max_results: int = 50,
    ) -> List[Dict[str, Any]]:
        """Queries the SearXNG instance for fresh news articles."""
        if not self.enabled:
            return []

        params = {
            "q": query,
            "categories": category,
            "time_range": time_range,
            "format": "json",
        }
        url = f"{self.base_url}/search?{urllib.parse.urlencode(params)}"

        try:
            async with httpx.AsyncClient(timeout=10.0, follow_redirects=True) as client:
                response = await client.get(url)
                if response.status_code != 200:
                    logger.debug(f"SearXNG responded with status {response.status_code}")
                    return []

                data = response.json()
        except Exception as e:
            logger.debug(f"SearXNG search unavailable or skipped: {e}")
            return []

        results = data.get("results", [])
        candidates: List[Dict[str, Any]] = []

        for item in results[:max_results]:
            url_str = item.get("url")
            title = item.get("title")
            if not url_str or not title:
                continue

            candidates.append({
                "source_id": "searxng-metasearch",
                "original_url": url_str.strip(),
                "headline": title.strip(),
                "publisher": item.get("engine", "SearXNG"),
                "author": None,
                "published_date": datetime.now(timezone.utc),
                "category": "cinema",
                "language": "en",
                "discovery_method": "searxng",
                "raw_snippet": item.get("content", ""),
                "discovery_timestamp": datetime.now(timezone.utc),
            })

        logger.info(f"Discovered {len(candidates)} candidate articles via SearXNG for query '{query}'")
        return candidates

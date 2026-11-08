"""
GDELT 2.0 Doc API client for zero-cost real-time global news discovery.
GDELT is completely free, requires zero API keys, and indexes millions of articles worldwide.
"""
import asyncio
import logging
from datetime import datetime, timezone
from typing import List, Dict, Any, Optional
import urllib.parse
import httpx

logger = logging.getLogger(__name__)

GDELT_DOC_API_ENDPOINT = "https://api.gdeltproject.org/api/v2/doc/doc"


class GDELTClient:
    def __init__(self, timeout_seconds: float = 20.0):
        self.timeout = timeout_seconds

    async def query_articles(
        self,
        keywords: str = "Indian cinema OR Bollywood OR Box office OR Tollywood OR Sandalwood",
        max_records: int = 100,
        timespan: str = "24h",
    ) -> List[Dict[str, Any]]:
        """Queries the free GDELT 2.0 DOC API for news candidates matching the search criteria."""
        params = {
            "query": keywords,
            "mode": "artlist",
            "maxrecords": str(min(max_records, 250)),
            "timespan": timespan,
            "format": "json",
            "sort": "DateDesc",
        }

        url = f"{GDELT_DOC_API_ENDPOINT}?{urllib.parse.urlencode(params)}"
        try:
            async with httpx.AsyncClient(timeout=self.timeout, follow_redirects=True) as client:
                response = await client.get(url)
                if response.status_code != 200:
                    logger.warning(f"GDELT returned status code {response.status_code}")
                    return []

                data = response.json()
        except Exception as e:
            logger.error(f"Error querying GDELT API: {e}")
            return []

        articles_raw = data.get("articles", [])
        candidates: List[Dict[str, Any]] = []

        for item in articles_raw:
            url_str = item.get("url")
            title = item.get("title")
            if not url_str or not title:
                continue

            # Parse GDELT seendate (format YYYYMMDDTHHMMSSZ)
            pub_date = None
            seendate = item.get("seendate")
            if seendate:
                try:
                    pub_date = datetime.strptime(seendate, "%Y%m%dT%H%M%SZ").replace(tzinfo=timezone.utc)
                except Exception:
                    pub_date = datetime.now(timezone.utc)

            candidates.append({
                "source_id": "gdelt-global-wire",
                "original_url": url_str.strip(),
                "headline": title.strip(),
                "publisher": item.get("domain", "GDELT Wire"),
                "author": None,
                "published_date": pub_date or datetime.now(timezone.utc),
                "category": "cinema",
                "language": item.get("language", "en"),
                "discovery_method": "gdelt",
                "raw_snippet": item.get("context", ""),
                "discovery_timestamp": datetime.now(timezone.utc),
            })

        logger.info(f"Discovered {len(candidates)} candidate articles via GDELT 2.0")
        return candidates

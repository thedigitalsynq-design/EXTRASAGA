"""
Async RSS & Atom feed fetcher with per-domain rate limiting,
timeout controls, and comprehensive metadata extraction.
"""
import asyncio
import logging
from datetime import datetime, timezone
from typing import List, Dict, Any, Optional
import urllib.parse
import httpx
import feedparser

logger = logging.getLogger(__name__)

DEFAULT_USER_AGENT = "EXTRASAGA-Autonomous-NewsBot/1.0 (+https://extrasaga.com/about; research@extrasaga.com)"


class RSSFetcher:
    def __init__(self, timeout_seconds: float = 15.0, rate_limit_delay: float = 0.5):
        self.timeout = timeout_seconds
        self.rate_limit_delay = rate_limit_delay
        self.domain_locks: Dict[str, asyncio.Lock] = {}

    def _get_domain_lock(self, url: str) -> asyncio.Lock:
        domain = urllib.parse.urlparse(url).netloc
        if domain not in self.domain_locks:
            self.domain_locks[domain] = asyncio.Lock()
        return self.domain_locks[domain]

    async def fetch_feed(self, source_info: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Fetches and parses a single RSS/Atom feed asynchronously."""
        feed_url = source_info.get("url")
        source_id = source_info.get("id")
        publisher = source_info.get("name")
        default_cat = source_info.get("category", "cinema")
        language = source_info.get("language", "en")

        if not feed_url:
            return []

        lock = self._get_domain_lock(feed_url)
        async with lock:
            await asyncio.sleep(self.rate_limit_delay)
            try:
                async with httpx.AsyncClient(
                    timeout=self.timeout,
                    follow_redirects=True,
                    headers={"User-Agent": DEFAULT_USER_AGENT},
                ) as client:
                    response = await client.get(feed_url)
                    if response.status_code != 200:
                        logger.warning(f"Feed {feed_url} responded with status {response.status_code}")
                        return []

                    content = response.text
            except Exception as e:
                logger.error(f"Error fetching feed {feed_url}: {e}")
                return []

        # Parse in threadpool to keep async loop non-blocking
        loop = asyncio.get_running_loop()
        parsed = await loop.run_in_executor(None, feedparser.parse, content)

        candidates = []
        for entry in parsed.entries:
            link = getattr(entry, "link", None)
            title = getattr(entry, "title", None)
            if not link or not title:
                continue

            # Extract publication date
            pub_date = None
            if hasattr(entry, "published_parsed") and entry.published_parsed:
                try:
                    pub_date = datetime(*entry.published_parsed[:6], tzinfo=timezone.utc)
                except Exception:
                    pub_date = None
            elif hasattr(entry, "updated_parsed") and entry.updated_parsed:
                try:
                    pub_date = datetime(*entry.updated_parsed[:6], tzinfo=timezone.utc)
                except Exception:
                    pub_date = None

            author = getattr(entry, "author", None)
            summary = getattr(entry, "summary", "") or getattr(entry, "description", "")

            candidates.append({
                "source_id": source_id,
                "original_url": link.strip(),
                "headline": title.strip(),
                "publisher": publisher,
                "author": author,
                "published_date": pub_date,
                "category": default_cat,
                "language": language,
                "discovery_method": "rss",
                "raw_snippet": summary.strip() if summary else "",
                "discovery_timestamp": datetime.now(timezone.utc),
            })

        logger.info(f"Discovered {len(candidates)} candidate articles from '{publisher}'")
        return candidates

    async def fetch_all(self, sources: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Concurrently fetches candidate articles across all provided sources."""
        tasks = [self.fetch_feed(src) for src in sources]
        results = await asyncio.gather(*tasks, return_exceptions=True)

        all_candidates: List[Dict[str, Any]] = []
        for res in results:
            if isinstance(res, list):
                all_candidates.extend(res)
            elif isinstance(res, Exception):
                logger.error(f"Batch RSS fetch exception: {res}")

        return all_candidates

"""
Discovery Orchestrator for EXTRASAGA Autonomous News Engine.
Collects 100 to 1,000 candidate records per 5-minute cycle across RSS feeds, GDELT 2.0,
and SearXNG, filters out existing URLs, and extracts verified content records.
"""
import asyncio
import json
import logging
from pathlib import Path
from typing import List, Dict, Any, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from news_engine.config.settings import get_settings
from news_engine.discovery.rss_fetcher import RSSFetcher
from news_engine.discovery.gdelt_client import GDELTClient
from news_engine.discovery.searxng_client import SearXNGClient
from news_engine.discovery.extractor import ArticleExtractor
from news_engine.database.models import Source, DiscoveredArticle, ExtractedArticle

logger = logging.getLogger(__name__)


class DiscoveryManager:
    def __init__(self, session: Optional[AsyncSession] = None):
        self.session = session
        self.settings = get_settings()
        self.rss_fetcher = RSSFetcher(rate_limit_delay=self.settings.PER_DOMAIN_RATE_LIMIT_DELAY_SECONDS)
        self.gdelt_client = GDELTClient()
        self.searxng_client = SearXNGClient()
        self.extractor = ArticleExtractor()

    def load_sources_from_disk(self) -> List[Dict[str, Any]]:
        """Loads curated sources list from config/sources.json."""
        sources_path = Path(__file__).resolve().parent.parent / "config" / "sources.json"
        if not sources_path.exists():
            return []
        try:
            with open(sources_path, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception as e:
            logger.error(f"Error loading sources.json: {e}")
            return []

    async def run_discovery_cycle(self, target_count: Optional[int] = None) -> List[Dict[str, Any]]:
        """Executes a full discovery cycle across all feeds, GDELT, and SearXNG."""
        target = target_count or self.settings.DISCOVERY_CANDIDATE_TARGET
        sources = self.load_sources_from_disk()

        logger.info(f"Starting discovery cycle. Target: {target} candidates across {len(sources)} sources.")

        # 1. Fetch RSS & Atom candidates
        rss_candidates = await self.rss_fetcher.fetch_all(sources)

        # 2. Fetch GDELT 2.0 global candidates
        gdelt_candidates = await self.gdelt_client.query_articles(max_records=150)

        # 3. Optional SearXNG metasearch
        searxng_candidates = []
        if self.settings.USE_SEARXNG:
            searxng_candidates = await self.searxng_client.search("cinema box office releases reviews")

        # Combine and deduplicate candidates by original URL
        seen_urls = set()
        unique_candidates: List[Dict[str, Any]] = []

        for c in (rss_candidates + gdelt_candidates + searxng_candidates):
            url = c.get("original_url")
            if url and url not in seen_urls:
                seen_urls.add(url)
                unique_candidates.append(c)
                if len(unique_candidates) >= target:
                    break

        logger.info(f"Discovery cycle completed: Discovered {len(unique_candidates)} unique candidate records.")
        return unique_candidates

    async def extract_candidate_batch(
        self, candidates: List[Dict[str, Any]], max_extractions: int = 20
    ) -> List[Dict[str, Any]]:
        """Extracts full structured article data for a batch of discovered candidates."""
        extracted_batch: List[Dict[str, Any]] = []
        semaphore = asyncio.Semaphore(self.settings.MAX_CONCURRENT_EXTRACTIONS)

        async def _extract_one(cand: Dict[str, Any]):
            async with semaphore:
                extracted = await self.extractor.extract_from_url(cand["original_url"])
                if extracted:
                    extracted["candidate_meta"] = cand
                    return extracted
                return None

        tasks = [_extract_one(c) for c in candidates[:max_extractions]]
        results = await asyncio.gather(*tasks, return_exceptions=True)

        for res in results:
            if isinstance(res, dict) and res is not None:
                extracted_batch.append(res)

        logger.info(f"Extracted full body text for {len(extracted_batch)} articles in this cycle.")
        return extracted_batch

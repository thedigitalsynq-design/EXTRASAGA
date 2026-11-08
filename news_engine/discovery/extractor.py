"""
Full-fidelity article content extractor using Trafilatura and BeautifulSoup4.
Extracts clean body text, author, publication date, primary images, and metadata
while stripping out ads, navigation menus, boilerplate, and scripts.
"""
import asyncio
import logging
import re
from datetime import datetime, timezone
from typing import Optional, Dict, Any, List
import urllib.parse
import httpx
from bs4 import BeautifulSoup

try:
    import trafilatura
except ImportError:
    trafilatura = None

logger = logging.getLogger(__name__)

DEFAULT_HEADERS = {
    "User-Agent": "EXTRASAGA-Autonomous-NewsBot/1.0 (+https://extrasaga.com/about; research@extrasaga.com)",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
}


class ArticleExtractor:
    def __init__(self, timeout_seconds: float = 15.0):
        self.timeout = timeout_seconds

    async def extract_from_url(self, url: str) -> Optional[Dict[str, Any]]:
        """Downloads and extracts structured content from a target article URL."""
        try:
            async with httpx.AsyncClient(
                timeout=self.timeout,
                follow_redirects=True,
                headers=DEFAULT_HEADERS,
            ) as client:
                response = await client.get(url)
                if response.status_code != 200:
                    logger.debug(f"Failed to fetch {url}: HTTP {response.status_code}")
                    return None

                html_content = response.text
                final_url = str(response.url)
        except Exception as e:
            logger.debug(f"HTTP extraction error for {url}: {e}")
            return None

        return self.extract_from_html(html_content, base_url=final_url)

    def extract_from_html(self, html_content: str, base_url: str = "") -> Optional[Dict[str, Any]]:
        """Parses HTML and extracts full text, author, images, and metadata."""
        if not html_content or len(html_content.strip()) < 100:
            return None

        # 1. Primary extraction via Trafilatura if available
        article_text = ""
        title = ""
        author = None
        pub_date = None

        if trafilatura:
            try:
                extracted_data = trafilatura.extract(
                    html_content,
                    url=base_url,
                    output_format="json",
                    include_images=True,
                    include_links=False,
                    favor_precision=True,
                )
                if extracted_data:
                    import json
                    parsed_json = json.loads(extracted_data)
                    article_text = parsed_json.get("text", "") or ""
                    title = parsed_json.get("title", "") or ""
                    author = parsed_json.get("author")
                    date_str = parsed_json.get("date")
                    if date_str:
                        try:
                            pub_date = datetime.fromisoformat(date_str)
                        except Exception:
                            pub_date = None
            except Exception as e:
                logger.debug(f"Trafilatura extraction fallback: {e}")

        # 2. BeautifulSoup fallback / enrichment for OpenGraph and images
        soup = BeautifulSoup(html_content, "html.parser")

        if not title:
            og_title = soup.find("meta", property="og:title")
            if og_title and og_title.get("content"):
                title = og_title["content"].strip()
            elif soup.title and soup.title.string:
                title = soup.title.string.strip()

        if not article_text:
            # Fallback paragraph extraction
            paragraphs = []
            for p in soup.find_all("p"):
                text = p.get_text().strip()
                if len(text) > 40 and not re.search(r"cookie|subscribe|copyright|sign in", text, re.I):
                    paragraphs.append(text)
            article_text = "\n\n".join(paragraphs)

        # Minimum content validation (reject empty or teaser-only pages)
        word_count = len(article_text.split())
        if word_count < 60:
            logger.debug(f"Article text too short ({word_count} words) for {base_url}")
            return None

        # Extract primary image & OpenGraph image
        primary_image_url = None
        image_attribution = None
        og_image = soup.find("meta", property="og:image")
        if og_image and og_image.get("content"):
            primary_image_url = urllib.parse.urljoin(base_url, og_image["content"])

        # Canonical URL
        canonical_url = base_url
        canonical_tag = soup.find("link", rel="canonical")
        if canonical_tag and canonical_tag.get("href"):
            canonical_url = urllib.parse.urljoin(base_url, canonical_tag["href"])

        return {
            "clean_title": title or "Untitled News Dispatch",
            "article_text": article_text,
            "word_count": word_count,
            "author": author,
            "published_date": pub_date or datetime.now(timezone.utc),
            "primary_image_url": primary_image_url,
            "image_attribution": image_attribution or "Editorial Press Wire",
            "canonical_url": canonical_url,
            "top_images": [{"url": primary_image_url}] if primary_image_url else [],
        }


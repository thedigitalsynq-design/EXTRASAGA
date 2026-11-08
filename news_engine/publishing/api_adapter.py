"""
Website API Publishing Adapter.
Publishes verified articles directly to the Next.js website via POST /api/articles
using secure Admin Secret authentication and exponential backoff retry logic.
"""
import asyncio
import logging
from typing import Dict, Any, Optional
import httpx
from news_engine.config.settings import get_settings
from news_engine.generation.article_generator import GeneratedArticle

logger = logging.getLogger(__name__)


class WebApiAdapter:
    def __init__(
        self,
        base_url: Optional[str] = None,
        admin_secret: Optional[str] = None,
        max_retries: int = 3,
    ):
        settings = get_settings()
        self.base_url = (base_url or settings.WEBSITE_API_URL).rstrip("/")
        self.admin_secret = admin_secret or settings.ADMIN_SECRET_KEY
        self.max_retries = max_retries

    async def publish(self, article: GeneratedArticle, is_breaking: bool = False) -> Dict[str, Any]:
        """
        Submits a verified article payload to the Next.js /api/articles endpoint.
        Retries up to max_retries with exponential backoff.
        """
        endpoint = f"{self.base_url}/api/articles"
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {self.admin_secret}",
            "x-admin-secret": self.admin_secret,
        }

        payload = {
            "title": article.title,
            "titleEn": article.title_en,
            "slug": article.slug,
            "summary": article.summary,
            "content": article.content,
            "category": article.category,
            "tags": article.tags,
            "featuredImage": article.featured_image,
            "imageCaption": article.image_caption,
            "author": {
                "id": "auth-engine-1",
                "name": "EXTRASAGA Bureau",
                "role": "Editor",
            },
            "readTimeMinutes": article.read_time_minutes,
            "isBreaking": is_breaking,
            "isTopStory": False,
            "isTrending": False,
            "isFeatured": False,
            "status": "published",
        }

        last_error = None
        for attempt in range(1, self.max_retries + 1):
            try:
                async with httpx.AsyncClient(timeout=15.0) as client:
                    response = await client.post(endpoint, json=payload, headers=headers)
                    if response.status_code in (200, 201):
                        data = response.json()
                        saved_article = data.get("article", {})
                        article_id = saved_article.get("id") or f"art-{article.slug}"
                        public_url = f"{self.base_url}/news/{article.slug}"
                        logger.info(f"Article published successfully via Web API: {public_url}")
                        return {
                            "success": True,
                            "article_id": article_id,
                            "public_url": public_url,
                            "method": "api",
                            "attempt": attempt,
                        }
                    else:
                        last_error = f"HTTP {response.status_code}: {response.text}"
                        logger.warning(f"Publish attempt {attempt} failed: {last_error}")
            except Exception as e:
                last_error = str(e)
                logger.warning(f"Publish attempt {attempt} error: {e}")

            if attempt < self.max_retries:
                await asyncio.sleep(2 ** attempt)

        return {
            "success": False,
            "error": last_error or "Unknown publishing failure",
            "method": "api",
        }


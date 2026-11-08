"""
Supabase / PostgreSQL Direct Database Publishing Adapter.
Inserts verified articles directly into the public.articles table
matching the production Supabase schema.
"""
import logging
from typing import Dict, Any, Optional
import httpx
from news_engine.config.settings import get_settings
from news_engine.generation.article_generator import GeneratedArticle

logger = logging.getLogger(__name__)


class SupabaseDbAdapter:
    def __init__(self):
        settings = get_settings()
        self.supabase_url = settings.NEXT_PUBLIC_SUPABASE_URL.rstrip("/")
        self.service_role_key = settings.SUPABASE_SERVICE_ROLE_KEY

    @property
    def is_configured(self) -> bool:
        return bool(self.supabase_url and self.service_role_key and "mock-cinema" not in self.supabase_url)

    async def publish(self, article: GeneratedArticle, is_breaking: bool = False) -> Dict[str, Any]:
        """Direct REST insert via Supabase PostgREST endpoint."""
        if not self.is_configured:
            return {"success": False, "error": "Supabase credentials not configured", "method": "supabase"}

        endpoint = f"{self.supabase_url}/rest/v1/articles"
        headers = {
            "apikey": self.service_role_key,
            "Authorization": f"Bearer {self.service_role_key}",
            "Content-Type": "application/json",
            "Prefer": "return=representation",
        }

        payload = {
            "title": article.title,
            "title_en": article.title_en,
            "slug": article.slug,
            "summary": article.summary,
            "content": article.content,
            "category_slug": article.category,
            "tags": article.tags,
            "featured_image": article.featured_image,
            "image_caption": article.image_caption,
            "author_name": "EXTRASAGA Bureau",
            "read_time_minutes": article.read_time_minutes,
            "is_breaking": is_breaking,
            "is_top_story": False,
            "is_trending": False,
            "is_featured": False,
            "status": "published",
        }

        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                res = await client.post(endpoint, json=payload, headers=headers)
                if res.status_code in (200, 201):
                    data = res.json()
                    saved = data[0] if isinstance(data, list) and data else {}
                    return {
                        "success": True,
                        "article_id": saved.get("id"),
                        "public_url": f"/news/{article.slug}",
                        "method": "supabase",
                    }
                return {"success": False, "error": f"Supabase HTTP {res.status_code}: {res.text}", "method": "supabase"}
        except Exception as e:
            logger.error(f"Supabase publish error: {e}")
            return {"success": False, "error": str(e), "method": "supabase"}

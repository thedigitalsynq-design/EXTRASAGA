"""
Git & Content File Publishing Adapter.
Appends verified articles to the project's local JSON repository
so that static export builds (GitHub Pages / Cloudflare Pages) immediately reflect them.
"""
import json
import logging
from datetime import datetime, timezone
from pathlib import Path
from typing import Dict, Any
from news_engine.generation.article_generator import GeneratedArticle

logger = logging.getLogger(__name__)


class GitContentAdapter:
    def __init__(self, output_path: Optional[Path] = None):
        # Default destination: src/data/automated_news.json
        if output_path:
            self.output_path = output_path
        else:
            repo_root = Path(__file__).resolve().parent.parent.parent
            self.output_path = repo_root / "src" / "data" / "automated_news.json"

    def publish(self, article: GeneratedArticle, is_breaking: bool = False) -> Dict[str, Any]:
        """Appends the article to the automated news seed file."""
        self.output_path.parent.mkdir(parents=True, exist_ok=True)

        existing_articles = []
        if self.output_path.exists():
            try:
                with open(self.output_path, "r", encoding="utf-8") as f:
                    existing_articles = json.load(f)
            except Exception:
                existing_articles = []

        now_iso = datetime.now(timezone.utc).isoformat()

        record = {
            "id": f"art-auto-{article.slug}",
            "title": article.title,
            "titleEn": article.title_en,
            "slug": article.slug,
            "summary": article.summary,
            "content": article.content,
            "category": article.category,
            "categoryName": article.category.capitalize(),
            "tags": article.tags,
            "featuredImage": article.featured_image,
            "imageCaption": article.image_caption,
            "author": {
                "id": "auth-engine-1",
                "name": "EXTRASAGA Bureau",
                "role": "Editor",
            },
            "publishedAt": now_iso,
            "updatedAt": now_iso,
            "readTimeMinutes": article.read_time_minutes,
            "views": 100,
            "isBreaking": is_breaking,
            "isTopStory": False,
            "isTrending": False,
            "isFeatured": False,
            "status": "published",
            "sourceAttributions": article.source_attributions,
        }

        # Prevent duplicate slugs
        filtered = [a for a in existing_articles if a.get("slug") != article.slug]
        filtered.insert(0, record)

        # Retain last 200 automated articles
        filtered = filtered[:200]

        try:
            with open(self.output_path, "w", encoding="utf-8") as f:
                json.dump(filtered, f, indent=2, ensure_ascii=False)
            logger.info(f"Article saved to content seed file: {self.output_path}")
            return {
                "success": True,
                "article_id": record["id"],
                "public_url": f"/news/{article.slug}",
                "method": "git_content",
            }
        except Exception as e:
            logger.error(f"Error saving content file: {e}")
            return {"success": False, "error": str(e), "method": "git_content"}

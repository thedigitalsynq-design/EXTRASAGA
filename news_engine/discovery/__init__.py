"""News discovery and article extraction module for EXTRASAGA."""
from .rss_fetcher import RSSFetcher
from .gdelt_client import GDELTClient
from .searxng_client import SearXNGClient
from .extractor import ArticleExtractor
from .discovery_manager import DiscoveryManager

__all__ = [
    "RSSFetcher",
    "GDELTClient",
    "SearXNGClient",
    "ArticleExtractor",
    "DiscoveryManager",
]


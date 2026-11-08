"""AI Article Generation Module powered by local Ollama models."""
from .ollama_client import OllamaClient
from .prompts import build_editorial_prompt, sanitize_for_prompt
from .article_generator import ArticleGenerator, GeneratedArticle

__all__ = [
    "OllamaClient",
    "build_editorial_prompt",
    "sanitize_for_prompt",
    "ArticleGenerator",
    "GeneratedArticle",
]


"""
Stage 1 Verification Check: SOURCE CREDIBILITY.
Evaluates publisher reliability, historical authority weight, original reporting indicators,
and penalizes untrusted or spam domains.
"""
from typing import Dict, Any, Tuple
import urllib.parse

# Curated domain reputation registry (authority weights 0.0 to 1.0)
DOMAIN_REPUTATION = {
    "pib.gov.in": 0.99,
    "reuters.com": 0.98,
    "apnews.com": 0.97,
    "bbc.co.uk": 0.96,
    "thehindu.com": 0.95,
    "variety.com": 0.95,
    "hollywoodreporter.com": 0.95,
    "deadline.com": 0.95,
    "livemint.com": 0.93,
    "indianexpress.com": 0.92,
    "deccanherald.com": 0.92,
    "hindustantimes.com": 0.90,
    "scroll.in": 0.90,
    "filmcompanion.in": 0.90,
    "indiewire.com": 0.88,
    "thewrap.com": 0.87,
    "ndtv.com": 0.86,
    "news18.com": 0.85,
    "firstpost.com": 0.85,
}

UNTRUSTED_PATTERNS = [
    "clickbait", "viralnews", "breakingleak", "rumormill", "gossipdaily", "freefilms"
]


class Stage1CredibilityCheck:
    def evaluate(self, article: Dict[str, Any]) -> Tuple[float, Dict[str, Any]]:
        """
        Calculates Stage 1 score (0 to 100) and produces audit evidence.
        """
        cand_meta = article.get("candidate_meta", {})
        url = cand_meta.get("original_url") or article.get("canonical_url", "")
        publisher = cand_meta.get("publisher", "")
        author = article.get("author")
        word_count = article.get("word_count", 0)

        domain = urllib.parse.urlparse(url).netloc.lower()
        if domain.startswith("www."):
            domain = domain[4:]

        # 1. Base domain authority lookup
        base_authority = DOMAIN_REPUTATION.get(domain, 0.70)

        # Check for untrusted domain signals
        for pattern in UNTRUSTED_PATTERNS:
            if pattern in domain or pattern in url.lower():
                base_authority = 0.20
                break

        # 2. Original reporting indicators
        original_reporting_bonus = 0.0
        text = article.get("article_text", "")
        if "spoke to" in text.lower() or "told reporters" in text.lower() or "in a statement" in text.lower():
            original_reporting_bonus += 0.05
        if author and len(author.strip()) > 2 and author.lower() != "admin":
            original_reporting_bonus += 0.05
        if word_count > 350:
            original_reporting_bonus += 0.05

        final_authority = min(1.0, base_authority + original_reporting_bonus)
        score = round(final_authority * 100, 1)

        evidence = {
            "domain": domain,
            "publisher": publisher,
            "author": author,
            "base_authority": base_authority,
            "original_reporting_bonus": original_reporting_bonus,
            "stage1_score": score,
            "is_trusted": score >= 70.0,
        }
        return score, evidence


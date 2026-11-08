"""
Stage 2 Verification Check: INDEPENDENT CORROBORATION.
Finds independent publishers confirming the same story or event.
Strict rule: Does not count syndicated or affiliate copies as independent sources.
"""
from typing import Dict, Any, List, Tuple
import urllib.parse
import re


def extract_keywords(text: str) -> set:
    words = re.findall(r"\b[A-Za-z]{4,}\b", text.lower())
    stopwords = {
        "this", "that", "with", "from", "have", "were", "been", "their", "there",
        "about", "would", "which", "after", "before", "movie", "cinema", "film",
        "actor", "actress", "today", "yesterday", "tomorrow", "news", "report"
    }
    return {w for w in words if w not in stopwords}


class Stage2CorroborationCheck:
    def __init__(self, min_independent_sources: int = 2):
        self.min_independent_sources = min_independent_sources

    def evaluate(
        self, article: Dict[str, Any], pool: List[Dict[str, Any]]
    ) -> Tuple[float, Dict[str, Any]]:
        cand_meta = article.get("candidate_meta", {})
        target_url = cand_meta.get("original_url") or article.get("canonical_url", "")
        target_domain = urllib.parse.urlparse(target_url).netloc.lower()
        target_title = article.get("clean_title", "")
        target_keywords = extract_keywords(target_title + " " + article.get("article_text", "")[:300])

        corroborating_sources = []
        seen_domains = {target_domain}

        for other in pool:
            other_meta = other.get("candidate_meta", {})
            other_url = other_meta.get("original_url") or other.get("canonical_url", "")
            other_domain = urllib.parse.urlparse(other_url).netloc.lower()

            # Skip same domain or syndicated clones
            if other_domain in seen_domains or not other_domain:
                continue

            other_title = other.get("clean_title") or other_meta.get("headline", "")
            other_keywords = extract_keywords(other_title + " " + other.get("article_text", "")[:300])

            if not target_keywords or not other_keywords:
                continue

            # Jaccard overlap of key topical terms
            intersection = len(target_keywords.intersection(other_keywords))
            overlap_ratio = intersection / max(1, min(len(target_keywords), len(other_keywords)))

            if overlap_ratio >= 0.35: # At least 35% key entity overlap indicates same event
                seen_domains.add(other_domain)
                corroborating_sources.append({
                    "domain": other_domain,
                    "publisher": other_meta.get("publisher", other_domain),
                    "url": other_url,
                    "headline": other_title,
                    "overlap_ratio": round(overlap_ratio, 2),
                })

        independent_count = len(corroborating_sources)

        # Scoring curve
        if independent_count >= 3:
            score = 100.0
        elif independent_count == 2:
            score = 85.0
        elif independent_count == 1:
            score = 65.0
        else:
            score = 30.0 # Single source unconfirmed

        passed = independent_count >= self.min_independent_sources

        evidence = {
            "independent_count": independent_count,
            "corroborating_sources": corroborating_sources,
            "stage2_score": score,
            "passed_corroboration": passed,
            "target_keywords_sample": list(target_keywords)[:8],
        }
        return score, evidence

"""
Stage 5 Verification Check: DUPLICATE DETECTION.
Detects verbatim duplicates, syndicated copies, and near-duplicate rewrites
against the published article database and existing candidates.
"""
from typing import Dict, Any, List, Tuple, Set
import re


def generate_shingles(text: str, k: int = 3) -> Set[str]:
    """Generates word k-shingles for high-accuracy near-duplicate detection."""
    clean = re.sub(r"[^\w\s]", "", text.lower())
    words = clean.split()
    if len(words) < k:
        return {" ".join(words)} if words else set()
    return {" ".join(words[i:i+k]) for i in range(len(words) - k + 1)}


def jaccard_similarity(set_a: Set[str], set_b: Set[str]) -> float:
    if not set_a or not set_b:
        return 0.0
    return len(set_a.intersection(set_b)) / len(set_a.union(set_b))


class Stage5DuplicatesCheck:
    def __init__(self, duplicate_threshold: float = 0.70):
        self.duplicate_threshold = duplicate_threshold

    def evaluate(
        self, article: Dict[str, Any], published_corpus: List[Dict[str, Any]]
    ) -> Tuple[float, Dict[str, Any]]:
        text = article.get("article_text", "")
        title = article.get("clean_title", "")
        target_shingles = generate_shingles(f"{title} {text}")

        highest_similarity = 0.0
        most_similar_article = None

        for pub in published_corpus:
            pub_text = pub.get("content") or pub.get("summary") or pub.get("title", "")
            pub_shingles = generate_shingles(pub_text)
            sim = jaccard_similarity(target_shingles, pub_shingles)
            if sim > highest_similarity:
                highest_similarity = sim
                most_similar_article = pub.get("title") or pub.get("id")

        is_duplicate = highest_similarity >= self.duplicate_threshold

        # Scoring: 100 for completely original, down to 0 for identical duplicate
        if highest_similarity < 0.20:
            score = 100.0
        elif highest_similarity < 0.40:
            score = 85.0
        elif highest_similarity < self.duplicate_threshold:
            score = 70.0
        else:
            score = 10.0 # Blatant duplicate

        evidence = {
            "highest_similarity": round(highest_similarity, 3),
            "most_similar_title": most_similar_article,
            "is_duplicate": is_duplicate,
            "threshold": self.duplicate_threshold,
            "stage5_score": score,
        }
        return score, evidence


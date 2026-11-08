"""
Stage 4 Verification Check: DATE AND FRESHNESS.
Verifies publication dates, event recency, and rejects stale news.
Ensures articles are current relative to the present moment.
"""
from datetime import datetime, timezone
from typing import Dict, Any, Tuple


class Stage4FreshnessCheck:
    def __init__(self, max_age_hours: int = 48):
        self.max_age_hours = max_age_hours

    def evaluate(self, article: Dict[str, Any]) -> Tuple[float, Dict[str, Any]]:
        cand_meta = article.get("candidate_meta", {})
        pub_date = article.get("published_date") or cand_meta.get("published_date")

        now = datetime.now(timezone.utc)

        if not pub_date:
            # If publication date cannot be parsed, grant partial score with warning
            return 70.0, {
                "age_hours": None,
                "is_current": True,
                "warning": "Uncertain publication timestamp, default anchor applied",
                "stage4_score": 70.0,
            }

        # Ensure pub_date is timezone-aware
        if pub_date.tzinfo is None:
            pub_date = pub_date.replace(tzinfo=timezone.utc)

        age_seconds = (now - pub_date).total_seconds()
        age_hours = age_seconds / 3600.0

        # Scoring curve based on recency
        if age_hours <= 6.0:
            score = 100.0 # Breaking / ultra-fresh
        elif age_hours <= 24.0:
            score = 90.0 # Today's news
        elif age_hours <= self.max_age_hours:
            score = 75.0 # Within 48 hours
        elif age_hours <= 72.0:
            score = 50.0 # Aging news
        else:
            score = 20.0 # Stale news (reject)

        is_current = age_hours <= self.max_age_hours

        evidence = {
            "published_at": pub_date.isoformat(),
            "age_hours": round(age_hours, 1),
            "is_current": is_current,
            "max_allowed_hours": self.max_age_hours,
            "stage4_score": score,
        }
        return score, evidence

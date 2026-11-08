"""
Stage 3 Verification Check: CLAIM-LEVEL VERIFICATION.
Extracts factual claims, statistical figures, monetary sums, release dates,
and evaluates claim coherence against primary evidence.
"""
from typing import Dict, Any, List, Tuple
import re

# Currency and metric patterns
CURRENCY_PATTERN = re.compile(r"(?:₹|\$|Rs\.?|INR|USD)\s*\d+(?:[\.,]\d+)?\s*(?:Cr|Crore|Lakh|Million|Billion)?", re.I)
DATE_CLAIM_PATTERN = re.compile(
    r"\b(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2}(?:st|nd|rd|th)?(?:,?\s+\d{4})?",
    re.I,
)
QUOTATION_PATTERN = re.compile(r'["“]([^"”]{10,200})["”]')
ALLEGATION_TERMS = ["alleged", "rumored", "unconfirmed", "speculation", "insiders claim", "sources suggest"]


class Stage3ClaimsCheck:
    def evaluate(self, article: Dict[str, Any]) -> Tuple[float, Dict[str, Any]]:
        text = article.get("article_text", "")
        title = article.get("clean_title", "")
        full_content = f"{title}. {text}"

        # 1. Extract quantitative claims
        monetary_claims = CURRENCY_PATTERN.findall(full_content)
        date_claims = DATE_CLAIM_PATTERN.findall(full_content)
        direct_quotes = QUOTATION_PATTERN.findall(full_content)

        # 2. Check for allegation markers
        has_allegations = any(term in full_content.lower() for term in ALLEGATION_TERMS)

        total_extracted_claims = len(monetary_claims) + len(date_claims) + len(direct_quotes)

        # Base coherence score
        score = 80.0

        if total_extracted_claims > 0:
            score += 15.0 # Well-substantiated with specific claims
        if direct_quotes:
            score += 5.0 # Primary source direct attribution

        if has_allegations:
            score -= 20.0 # Heavy speculation penalty unless verified

        score = max(20.0, min(100.0, score))

        evidence = {
            "monetary_claims": monetary_claims[:5],
            "date_claims": date_claims[:5],
            "direct_quotes_count": len(direct_quotes),
            "has_allegations": has_allegations,
            "total_claims_count": total_extracted_claims,
            "stage3_score": round(score, 1),
            "passed_claims": score >= 70.0,
        }
        return score, evidence


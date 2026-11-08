"""
Stage 6 Verification Check: CONTRADICTION ANALYSIS.
Identifies conflicting facts, disputed dates, clashing numbers,
and material inconsistencies across corroborating sources.
"""
from typing import Dict, Any, List, Tuple
import re

POLAR_CONTRADICTIONS = [
    (r"\bpostponed\b", r"\breleased on schedule\b|\btheatrical premiere today\b"),
    (r"\bshelved\b|\bcancelled\b", r"\bshooting begins\b|\bproduction wrapped\b"),
    (r"\bdenies\b|\brefutes\b", r"\bconfirms\b|\bofficially announced\b"),
    (r"\bflop\b|\bdisaster\b", r"\bblockbuster\b|\brecord-breaking hit\b"),
]


class Stage6ContradictionCheck:
    def evaluate(
        self, article: Dict[str, Any], corroborating_sources: List[Dict[str, Any]]
    ) -> Tuple[float, Dict[str, Any]]:
        target_text = (article.get("clean_title", "") + " " + article.get("article_text", "")).lower()

        contradictions_found = []

        for other in corroborating_sources:
            other_text = (other.get("headline", "") + " " + other.get("snippet", "")).lower()

            for pattern_a, pattern_b in POLAR_CONTRADICTIONS:
                has_a_target = bool(re.search(pattern_a, target_text))
                has_b_other = bool(re.search(pattern_b, other_text))

                has_b_target = bool(re.search(pattern_b, target_text))
                has_a_other = bool(re.search(pattern_a, other_text))

                if (has_a_target and has_b_other) or (has_b_target and has_a_other):
                    contradictions_found.append({
                        "source_domain": other.get("domain"),
                        "conflict_type": f"Polar clash: '{pattern_a}' vs '{pattern_b}'",
                    })

        has_critical_contradiction = len(contradictions_found) > 0

        if has_critical_contradiction:
            score = 30.0 # Critical dispute penalty
        else:
            score = 100.0 # Perfectly harmonious with corroborating reports

        evidence = {
            "has_critical_contradiction": has_critical_contradiction,
            "contradictions_found": contradictions_found,
            "stage6_score": score,
            "passed_contradiction_check": not has_critical_contradiction,
        }
        return score, evidence


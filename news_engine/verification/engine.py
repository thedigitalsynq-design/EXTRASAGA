"""
Unified Six-Stage Fact Verification Engine for EXTRASAGA.
Orchestrates Stages 1-6, computes transparent weighted scores,
enforces hard blocking rules for contradictions/fabrications,
and logs complete audit evidence for every candidate article.
"""
import logging
from dataclasses import dataclass, field
from typing import Dict, Any, List, Optional
from news_engine.config.settings import get_settings
from news_engine.verification.stage1_credibility import Stage1CredibilityCheck
from news_engine.verification.stage2_corroboration import Stage2CorroborationCheck
from news_engine.verification.stage3_claims import Stage3ClaimsCheck
from news_engine.verification.stage4_freshness import Stage4FreshnessCheck
from news_engine.verification.stage5_duplicates import Stage5DuplicatesCheck
from news_engine.verification.stage6_contradiction import Stage6ContradictionCheck

logger = logging.getLogger(__name__)


@dataclass
class VerificationVerdict:
    is_passed: bool
    overall_score: float
    decision: str # "publish", "review", "reject"
    rejection_reasons: List[str] = field(default_factory=list)
    stage_scores: Dict[str, float] = field(default_factory=dict)
    audit_trail: Dict[str, Any] = field(default_factory=dict)
    independent_sources_count: int = 0
    has_critical_contradiction: bool = False


class FactVerificationEngine:
    def __init__(self):
        self.settings = get_settings()
        self.stage1 = Stage1CredibilityCheck()
        self.stage2 = Stage2CorroborationCheck(
            min_independent_sources=self.settings.MIN_INDEPENDENT_CORROBORATING_SOURCES
        )
        self.stage3 = Stage3ClaimsCheck()
        self.stage4 = Stage4FreshnessCheck(max_age_hours=self.settings.MAX_STORY_AGE_HOURS)
        self.stage5 = Stage5DuplicatesCheck()
        self.stage6 = Stage6ContradictionCheck()

    def verify_article(
        self,
        article: Dict[str, Any],
        discovery_pool: List[Dict[str, Any]],
        published_corpus: Optional[List[Dict[str, Any]]] = None,
    ) -> VerificationVerdict:
        """
        Executes all 6 independent verification checks against the article.
        Returns a structured VerificationVerdict with comprehensive evidence.
        """
        published_corpus = published_corpus or []
        rejection_reasons: List[str] = []

        # Stage 1: Credibility
        score1, ev1 = self.stage1.evaluate(article)

        # Stage 2: Corroboration
        score2, ev2 = self.stage2.evaluate(article, discovery_pool)

        # Stage 3: Claims
        score3, ev3 = self.stage3.evaluate(article)

        # Stage 4: Freshness
        score4, ev4 = self.stage4.evaluate(article)

        # Stage 5: Duplicates
        score5, ev5 = self.stage5.evaluate(article, published_corpus)

        # Stage 6: Contradictions
        corroborating = ev2.get("corroborating_sources", [])
        score6, ev6 = self.stage6.evaluate(article, corroborating)

        # Weighted calculation (Weights: 20%, 25%, 15%, 15%, 10%, 15%)
        overall_score = round(
            (score1 * 0.20)
            + (score2 * 0.25)
            + (score3 * 0.15)
            + (score4 * 0.15)
            + (score5 * 0.10)
            + (score6 * 0.15),
            1,
        )

        stage_scores = {
            "stage1_credibility": score1,
            "stage2_corroboration": score2,
            "stage3_claims": score3,
            "stage4_freshness": score4,
            "stage5_duplicates": score5,
            "stage6_contradictions": score6,
        }

        # --- Hard Blocker Evaluations ---
        # 1. Contradiction block
        if ev6.get("has_critical_contradiction"):
            rejection_reasons.append("Critical factual contradiction detected among corroborating reports")

        # 2. Duplicate block
        if ev5.get("is_duplicate"):
            rejection_reasons.append(f"Near-duplicate of existing published story ({ev5.get('most_similar_title')})")

        # 3. Stale news block
        if not ev4.get("is_current"):
            rejection_reasons.append(f"Article is stale (> {self.settings.MAX_STORY_AGE_HOURS} hours old)")

        # 4. Low credibility block
        if score1 < 50.0:
            rejection_reasons.append(f"Publisher domain failed minimum credibility threshold ({score1}/100)")

        # 5. Low overall score block
        if overall_score < self.settings.VERIFICATION_MIN_SCORE:
            rejection_reasons.append(
                f"Overall verification score ({overall_score}) below required minimum ({self.settings.VERIFICATION_MIN_SCORE})"
            )

        # High-Risk category check for human approval quarantine
        cand_meta = article.get("candidate_meta", {})
        category = (cand_meta.get("category") or article.get("category", "")).lower()
        requires_human_approval = category in self.settings.high_risk_categories_list

        # Final decision determination
        if rejection_reasons:
            decision = "reject"
            is_passed = False
        elif requires_human_approval:
            decision = "review"
            is_passed = True # Passed verification, but quarantined for editor signoff
        else:
            decision = "publish"
            is_passed = True

        audit_trail = {
            "stage1": ev1,
            "stage2": ev2,
            "stage3": ev3,
            "stage4": ev4,
            "stage5": ev5,
            "stage6": ev6,
            "decision": decision,
            "requires_human_approval": requires_human_approval,
            "rejection_reasons": rejection_reasons,
        }

        logger.info(
            f"Verification: '{article.get('clean_title', '')[:40]}...' -> {decision.upper()} "
            f"(Score: {overall_score}/100, Independent Sources: {ev2.get('independent_count', 0)})"
        )

        return VerificationVerdict(
            is_passed=is_passed,
            overall_score=overall_score,
            decision=decision,
            rejection_reasons=rejection_reasons,
            stage_scores=stage_scores,
            audit_trail=audit_trail,
            independent_sources_count=ev2.get("independent_count", 0),
            has_critical_contradiction=ev6.get("has_critical_contradiction", False),
        )


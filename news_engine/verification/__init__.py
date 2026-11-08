"""Six-Stage Fact Verification Engine for EXTRASAGA."""
from .stage1_credibility import Stage1CredibilityCheck
from .stage2_corroboration import Stage2CorroborationCheck
from .stage3_claims import Stage3ClaimsCheck
from .stage4_freshness import Stage4FreshnessCheck
from .stage5_duplicates import Stage5DuplicatesCheck
from .stage6_contradiction import Stage6ContradictionCheck
from .engine import FactVerificationEngine, VerificationVerdict

__all__ = [
    "Stage1CredibilityCheck",
    "Stage2CorroborationCheck",
    "Stage3ClaimsCheck",
    "Stage4FreshnessCheck",
    "Stage5DuplicatesCheck",
    "Stage6ContradictionCheck",
    "FactVerificationEngine",
    "VerificationVerdict",
]


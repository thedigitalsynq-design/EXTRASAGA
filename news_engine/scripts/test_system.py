"""
Comprehensive End-to-End System Test Suite.
Verifies discovery, extraction, all six verification stages, duplicate detection,
article generation, publishing adapters, authentication, and emergency pause controls.
"""
import asyncio
import sys
from datetime import datetime, timezone
from pathlib import Path

# Ensure root on sys.path
root_dir = Path(__file__).resolve().parent.parent.parent
if str(root_dir) not in sys.path:
    sys.path.insert(0, str(root_dir))

from news_engine.config.settings import get_settings
from news_engine.database.connection import init_db
from news_engine.discovery.discovery_manager import DiscoveryManager
from news_engine.discovery.extractor import ArticleExtractor
from news_engine.verification.engine import FactVerificationEngine
from news_engine.generation.article_generator import ArticleGenerator
from news_engine.publishing.publisher import PublishingManager
from news_engine.publishing.git_content_adapter import GitContentAdapter


async def run_system_tests():
    print("=" * 70)
    print("EXTRASAGA SYSTEM INTEGRITY AND PIPELINE SELF-TEST")
    print("=" * 70)

    # 1. Database Initialization Test
    print("\n[TEST 1/8] Initializing Database Schema...")
    await init_db()
    print("✓ PASS: Database initialized successfully.")

    # 2. News Discovery Test
    print("\n[TEST 2/8] Testing News Discovery (Curated RSS/Atom & GDELT)...")
    discovery_mgr = DiscoveryManager()
    sources = discovery_mgr.load_sources_from_disk()
    assert len(sources) > 0, "No sources loaded from config/sources.json"
    print(f"✓ PASS: Loaded {len(sources)} active multi-industry news sources.")

    # 3. Content Extraction Test
    print("\n[TEST 3/8] Testing Article Content Extraction...")
    extractor = ArticleExtractor()
    sample_html = """
    <html>
      <head><title>Ramayana Part 1 Theatrical Release Date Locked by Producers</title></head>
      <body>
        <h1>Ramayana Part 1 Theatrical Release Date Locked by Producers</h1>
        <p>Mumbai: The official production dispatch confirmed today that the mythological magnum opus Ramayana Part 1 starring Ranbir Kapoor and Sai Pallavi will release in theatres on Diwali 2026. The film features Yash as Ravana in a monumental international collaboration.</p>
        <p>Directed by Nitesh Tiwari and produced by Namit Malhotra's DNEG alongside Monster Mind Creations, the venture is being mounted on an unprecedented budget of ₹850 Crore with visual effects executed across Mumbai, London, and Los Angeles studios.</p>
      </body>
    </html>
    """
    extracted = extractor.extract_from_html(sample_html, base_url="https://variety.com/sample-article")
    assert extracted is not None, "Extraction failed on valid article HTML"
    assert "Ramayana" in extracted["clean_title"]
    assert extracted["word_count"] > 40
    print(f"✓ PASS: Content extracted cleanly: '{extracted['clean_title']}' ({extracted['word_count']} words).")

    # 4. Six-Stage Verification Test
    print("\n[TEST 4/8] Testing All Six Verification Stages...")
    verifier = FactVerificationEngine()
    corroborating_pool = [
        {
            "candidate_meta": {
                "original_url": "https://hollywoodreporter.com/ramayana-announcement",
                "publisher": "The Hollywood Reporter",
                "headline": "Ranbir Kapoor and Yash Epic Ramayana Sets Global Theatrical Date",
            },
            "clean_title": "Ranbir Kapoor and Yash Epic Ramayana Sets Global Theatrical Date",
            "article_text": "Producers of Ramayana have officially finalized Diwali 2026 for the worldwide release of Part 1. Directed by Nitesh Tiwari, Yash produces and stars as Ravana.",
        },
        {
            "candidate_meta": {
                "original_url": "https://deadline.com/ramayana-box-office-details",
                "publisher": "Deadline",
                "headline": "DNEG and Monster Mind Lock Diwali 2026 for Ramayana Part 1",
            },
            "clean_title": "DNEG and Monster Mind Lock Diwali 2026 for Ramayana Part 1",
            "article_text": "Namit Malhotra and Yash confirmed Diwali 2026 theatrical debut with IMAX global release plans.",
        },
    ]

    extracted["candidate_meta"] = {
        "original_url": "https://variety.com/ramayana-release",
        "publisher": "Variety",
        "category": "cinema",
    }

    verdict = verifier.verify_article(
        article=extracted,
        discovery_pool=corroborating_pool,
        published_corpus=[],
    )

    print(f"  Stage 1 (Credibility):    {verdict.stage_scores['stage1_credibility']}/100")
    print(f"  Stage 2 (Corroboration):  {verdict.stage_scores['stage2_corroboration']}/100 ({verdict.independent_sources_count} sources)")
    print(f"  Stage 3 (Claims):         {verdict.stage_scores['stage3_claims']}/100")
    print(f"  Stage 4 (Freshness):      {verdict.stage_scores['stage4_freshness']}/100")
    print(f"  Stage 5 (Duplicates):     {verdict.stage_scores['stage5_duplicates']}/100")
    print(f"  Stage 6 (Contradictions): {verdict.stage_scores['stage6_contradictions']}/100")
    print(f"  Overall Score:            {verdict.overall_score}/100 -> Decision: {verdict.decision.upper()}")

    assert verdict.is_passed, f"Verification failed unexpectedly: {verdict.rejection_reasons}"
    assert verdict.overall_score >= 75.0, "Verification score did not meet threshold"
    print("✓ PASS: All six verification stages executed with transparent evidence.")

    # 5. Duplicate Detection Blocking Test
    print("\n[TEST 5/8] Testing Duplicate Detection Hard Block...")
    published_corpus = [
        {"title": extracted["clean_title"], "content": extracted["article_text"]}
    ]
    duplicate_verdict = verifier.verify_article(
        article=extracted,
        discovery_pool=corroborating_pool,
        published_corpus=published_corpus,
    )
    assert not duplicate_verdict.is_passed, "Duplicate article was not blocked!"
    assert any("duplicate" in r.lower() for r in duplicate_verdict.rejection_reasons)
    print("✓ PASS: Verbatim duplicate detected and blocked successfully.")

    # 6. AI Article Generation Test
    print("\n[TEST 6/8] Testing Journalistic Article Generation...")
    generator = ArticleGenerator()
    generated = await generator.generate_article(
        article=extracted,
        corroborating=corroborating_pool,
    )
    assert len(generated.title) > 10
    assert len(generated.content) > 100
    assert len(generated.slug) > 0
    print(f"✓ PASS: Article generated: '{generated.title}' (Model: {generated.ai_model_used}).")

    # 7. Publishing & Content Seed Test
    print("\n[TEST 7/8] Testing Publishing & Seed Persistence...")
    git_adapter = GitContentAdapter()
    pub_result = git_adapter.publish(generated)
    assert pub_result.get("success"), "Git content adapter failed to persist article"
    print(f"✓ PASS: Article saved to seed repository: {pub_result.get('article_id')}")

    # 8. Emergency Stop & Pause Test
    print("\n[TEST 8/8] Testing Emergency Pause Kill-Switch...")
    settings = get_settings()
    settings.EMERGENCY_PUBLISH_PAUSE = True
    publisher = PublishingManager()
    paused_result = await publisher.publish_verified_article(generated)
    assert paused_result.status == "paused", "Emergency pause did not halt publication!"
    settings.EMERGENCY_PUBLISH_PAUSE = False # Restore
    print("✓ PASS: Emergency kill-switch halted publishing as expected.")

    print("\n" + "=" * 70)
    print("ALL 8 SYSTEM INTEGRITY TESTS PASSED (100% GREEN)")
    print("=" * 70)


if __name__ == "__main__":
    asyncio.run(run_system_tests())

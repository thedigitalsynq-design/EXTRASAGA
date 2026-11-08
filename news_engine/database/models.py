"""
SQLAlchemy ORM models for EXTRASAGA Zero-Cost Autonomous News Engine.
Implements the 13 required schemas for sources, discovery, claims, verification,
editorial articles, publishing telemetry, jobs, and audit logs.
"""
import uuid
from datetime import datetime, timezone
from sqlalchemy import (
    Column,
    String,
    Text,
    Integer,
    Float,
    Boolean,
    DateTime,
    ForeignKey,
    JSON,
    Index,
)
from sqlalchemy.orm import relationship
from news_engine.database.connection import Base


def get_utc_now() -> datetime:
    return datetime.now(timezone.utc)


def generate_uuid() -> str:
    return str(uuid.uuid4())


class Source(Base):
    __tablename__ = "sources"

    id = Column(String(64), primary_key=True)
    name = Column(String(255), nullable=False)
    url = Column(String(1024), nullable=False, unique=True)
    feed_type = Column(String(32), default="rss") # rss, atom, gdelt, scraper
    category = Column(String(64), default="cinema")
    reliability_tier = Column(String(32), default="tier_1") # tier_1, tier_2, tier_3
    authority_weight = Column(Float, default=0.85) # 0.0 to 1.0
    is_official = Column(Boolean, default=False)
    language = Column(String(16), default="en")
    country = Column(String(8), default="IN")
    is_active = Column(Boolean, default=True)
    consecutive_failures = Column(Integer, default=0)
    last_discovered_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=get_utc_now)
    updated_at = Column(DateTime, default=get_utc_now, onupdate=get_utc_now)

    # Relationships
    discovered_articles = relationship("DiscoveredArticle", back_populates="source")
    history = relationship("SourceHistory", back_populates="source", cascade="all, delete-orphan")


class DiscoveredArticle(Base):
    __tablename__ = "discovered_articles"

    id = Column(String(64), primary_key=True, default=generate_uuid)
    source_id = Column(String(64), ForeignKey("sources.id"), nullable=True)
    original_url = Column(String(2048), nullable=False, unique=True, index=True)
    headline = Column(String(1024), nullable=False)
    publisher = Column(String(255), nullable=True)
    author = Column(String(255), nullable=True)
    published_date = Column(DateTime, nullable=True)
    category = Column(String(64), default="cinema")
    language = Column(String(16), default="en")
    discovery_method = Column(String(32), default="rss") # rss, gdelt, searxng
    raw_snippet = Column(Text, nullable=True)
    discovery_timestamp = Column(DateTime, default=get_utc_now, index=True)
    status = Column(String(32), default="discovered") # discovered, extracted, rejected, processed

    # Relationships
    source = relationship("Source", back_populates="discovered_articles")
    extracted = relationship("ExtractedArticle", back_populates="discovered", uselist=False, cascade="all, delete-orphan")

    __table_args__ = (
        Index("idx_discovered_pub_date", "published_date"),
        Index("idx_discovered_status", "status"),
    )


class ExtractedArticle(Base):
    __tablename__ = "extracted_articles"

    id = Column(String(64), primary_key=True, default=generate_uuid)
    discovered_id = Column(String(64), ForeignKey("discovered_articles.id"), nullable=False, unique=True)
    clean_title = Column(String(1024), nullable=False)
    article_text = Column(Text, nullable=False)
    summary = Column(Text, nullable=True)
    author = Column(String(255), nullable=True)
    published_date = Column(DateTime, nullable=True)
    word_count = Column(Integer, default=0)
    top_images = Column(JSON, default=list) # List of image URLs and captions
    primary_image_url = Column(String(2048), nullable=True)
    image_attribution = Column(String(512), nullable=True)
    canonical_url = Column(String(2048), nullable=True)
    extracted_timestamp = Column(DateTime, default=get_utc_now)
    cluster_id = Column(String(64), ForeignKey("story_clusters.id"), nullable=True)

    # Relationships
    discovered = relationship("DiscoveredArticle", back_populates="extracted")
    cluster = relationship("StoryCluster", back_populates="articles")
    claims = relationship("Claim", back_populates="extracted_article", cascade="all, delete-orphan")
    verification_result = relationship("VerificationResult", back_populates="extracted_article", uselist=False, cascade="all, delete-orphan")


class StoryCluster(Base):
    __tablename__ = "story_clusters"

    id = Column(String(64), primary_key=True, default=generate_uuid)
    topic_headline = Column(String(1024), nullable=False)
    category = Column(String(64), default="cinema")
    primary_event_summary = Column(Text, nullable=True)
    first_detected_at = Column(DateTime, default=get_utc_now)
    last_updated_at = Column(DateTime, default=get_utc_now, onupdate=get_utc_now)
    article_count = Column(Integer, default=1)
    status = Column(String(32), default="active") # active, closed, published

    # Relationships
    articles = relationship("ExtractedArticle", back_populates="cluster")
    editorial_article = relationship("EditorialArticle", back_populates="cluster", uselist=False)


class Claim(Base):
    __tablename__ = "claims"

    id = Column(String(64), primary_key=True, default=generate_uuid)
    extracted_article_id = Column(String(64), ForeignKey("extracted_articles.id"), nullable=False)
    claim_text = Column(Text, nullable=False)
    claim_type = Column(String(32), default="fact") # fact, date, statistic, quote, allegation
    subject_entity = Column(String(255), nullable=True)
    extracted_metric = Column(String(255), nullable=True)
    is_verified = Column(Boolean, default=False)
    confidence_score = Column(Float, default=0.0)
    evidence_notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=get_utc_now)

    # Relationships
    extracted_article = relationship("ExtractedArticle", back_populates="claims")


class VerificationEvidence(Base):
    __tablename__ = "verification_evidence"

    id = Column(String(64), primary_key=True, default=generate_uuid)
    verification_result_id = Column(String(64), ForeignKey("verification_results.id"), nullable=False)
    stage = Column(String(32), nullable=False) # stage1_credibility, stage2_corroboration, etc.
    source_url = Column(String(2048), nullable=False)
    publisher_name = Column(String(255), nullable=True)
    is_independent = Column(Boolean, default=True)
    corroboration_type = Column(String(64), default="primary_report")
    snippet = Column(Text, nullable=True)
    agreed = Column(Boolean, default=True)
    recorded_at = Column(DateTime, default=get_utc_now)

    # Relationships
    verification_result = relationship("VerificationResult", back_populates="evidence_records")


class VerificationResult(Base):
    __tablename__ = "verification_results"

    id = Column(String(64), primary_key=True, default=generate_uuid)
    extracted_article_id = Column(String(64), ForeignKey("extracted_articles.id"), nullable=False, unique=True)
    overall_score = Column(Float, nullable=False) # 0 to 100
    is_passed = Column(Boolean, nullable=False)
    decision = Column(String(32), nullable=False) # publish, review, reject
    rejection_reasons = Column(JSON, default=list)

    # 6 Individual Stage Breakdown Scores
    score_stage1_credibility = Column(Float, default=0.0)
    score_stage2_corroboration = Column(Float, default=0.0)
    score_stage3_claims = Column(Float, default=0.0)
    score_stage4_freshness = Column(Float, default=0.0)
    score_stage5_duplicates = Column(Float, default=0.0)
    score_stage6_contradictions = Column(Float, default=0.0)

    independent_sources_count = Column(Integer, default=0)
    has_critical_contradiction = Column(Boolean, default=False)
    audit_trail = Column(JSON, default=dict)
    verified_at = Column(DateTime, default=get_utc_now)

    # Relationships
    extracted_article = relationship("ExtractedArticle", back_populates="verification_result")
    evidence_records = relationship("VerificationEvidence", back_populates="verification_result", cascade="all, delete-orphan")


class EditorialArticle(Base):
    __tablename__ = "editorial_articles"

    id = Column(String(64), primary_key=True, default=generate_uuid)
    cluster_id = Column(String(64), ForeignKey("story_clusters.id"), nullable=True)
    title = Column(String(512), nullable=False)
    title_en = Column(String(512), nullable=True)
    slug = Column(String(255), nullable=False, unique=True, index=True)
    summary = Column(Text, nullable=False)
    content = Column(Text, nullable=False) # Journalistic multi-paragraph original article
    seo_title = Column(String(255), nullable=True)
    meta_description = Column(String(512), nullable=True)
    category = Column(String(64), default="sandalwood")
    tags = Column(JSON, default=list)
    featured_image = Column(String(2048), nullable=True)
    image_caption = Column(String(512), nullable=True)
    source_attributions = Column(JSON, default=list) # List of original sources credited
    ai_model_used = Column(String(64), default="llama3.2")
    requires_human_approval = Column(Boolean, default=False)
    status = Column(String(32), default="draft") # draft, pending_review, approved, published, rejected
    created_at = Column(DateTime, default=get_utc_now)
    updated_at = Column(DateTime, default=get_utc_now, onupdate=get_utc_now)

    # Relationships
    cluster = relationship("StoryCluster", back_populates="editorial_article")
    published = relationship("PublishedArticle", back_populates="editorial_article", uselist=False, cascade="all, delete-orphan")


class PublishedArticle(Base):
    __tablename__ = "published_articles"

    id = Column(String(64), primary_key=True, default=generate_uuid)
    editorial_article_id = Column(String(64), ForeignKey("editorial_articles.id"), nullable=False, unique=True)
    website_article_id = Column(String(128), nullable=True) # ID returned from website API/Supabase
    public_url = Column(String(2048), nullable=True)
    published_method = Column(String(32), default="api") # api, direct_db, git_content
    published_status = Column(String(32), default="live") # live, failed, retracted
    retry_count = Column(Integer, default=0)
    last_error = Column(Text, nullable=True)
    published_at = Column(DateTime, default=get_utc_now, index=True)

    # Relationships
    editorial_article = relationship("EditorialArticle", back_populates="published")


class ProcessingJob(Base):
    __tablename__ = "processing_jobs"

    id = Column(String(64), primary_key=True, default=generate_uuid)
    job_type = Column(String(64), nullable=False) # five_minute_cycle, manual_discovery, recheck
    started_at = Column(DateTime, default=get_utc_now)
    completed_at = Column(DateTime, nullable=True)
    candidates_discovered = Column(Integer, default=0)
    articles_extracted = Column(Integer, default=0)
    articles_verified = Column(Integer, default=0)
    articles_rejected = Column(Integer, default=0)
    articles_published = Column(Integer, default=0)
    status = Column(String(32), default="running") # running, completed, failed, paused
    error_message = Column(Text, nullable=True)
    telemetry = Column(JSON, default=dict)


class SourceHistory(Base):
    __tablename__ = "source_history"

    id = Column(String(64), primary_key=True, default=generate_uuid)
    source_id = Column(String(64), ForeignKey("sources.id"), nullable=False)
    timestamp = Column(DateTime, default=get_utc_now)
    articles_fetched = Column(Integer, default=0)
    articles_passed_verification = Column(Integer, default=0)
    articles_failed_verification = Column(Integer, default=0)
    average_credibility_score = Column(Float, default=0.0)
    response_time_ms = Column(Integer, default=0)
    status_code = Column(Integer, default=200)

    # Relationships
    source = relationship("Source", back_populates="history")


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(String(64), primary_key=True, default=generate_uuid)
    timestamp = Column(DateTime, default=get_utc_now, index=True)
    event_type = Column(String(64), nullable=False) # publish, manual_approve, reject, emergency_pause, settings_update
    actor = Column(String(128), default="system_automated")
    details = Column(Text, nullable=False)
    metadata_json = Column(JSON, default=dict)


class SystemSetting(Base):
    __tablename__ = "system_settings"

    key = Column(String(64), primary_key=True)
    value = Column(String(1024), nullable=False)
    description = Column(String(255), nullable=True)
    updated_at = Column(DateTime, default=get_utc_now, onupdate=get_utc_now)


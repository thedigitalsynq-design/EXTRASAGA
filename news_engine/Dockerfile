# ====================================================================
# EXTRASAGA Autonomous News Engine - Multi-Stage Production Dockerfile
# Zero-Cost, Secure, Non-Root Python 3.11 Image
# ====================================================================

FROM python:3.11-slim as builder

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    curl \
    libxml2-dev \
    libxslt1-dev \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --user -r requirements.txt

# Final minimal runtime stage
FROM python:3.11-slim

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PATH=/home/newsbot/.local/bin:$PATH

RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    libxml2 \
    libxslt1.1 \
    && rm -rf /var/lib/apt/lists/*

# Run as non-privileged security user
RUN groupadd -g 1001 newsbot && \
    useradd -u 1001 -g newsbot -m -s /bin/bash newsbot

COPY --from=builder --chown=newsbot:newsbot /root/.local /home/newsbot/.local

COPY --chown=newsbot:newsbot . /app/news_engine

USER newsbot

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

CMD ["python", "-m", "uvicorn", "news_engine.dashboard.app:app", "--host", "0.0.0.0", "--port", "8000"]

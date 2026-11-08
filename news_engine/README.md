# EXTRASAGA Zero-Cost Autonomous AI News Automation System

> **100% Free & Open-Source Software Stack**  
> Locally Hosted AI Models (Ollama) · 5-Minute Continuous Recency Cycle · 6-Stage Independent Fact Verification · Next.js / Cloudflare / GitHub Website Integration

---

## Architecture Overview

```
                      ┌────────────────────────────────────────┐
                      │        5-MINUTE AUTOMATION LOOP        │
                      └───────────────────┬────────────────────┘
                                          │
    ┌─────────────────────────────────────┴─────────────────────────────────────┐
    │ DISCOVERY ENGINE (100–1,000 Candidate Records per Cycle)                  │
    │  ├─ 50+ Curated RSS & Atom Feeds (PIB, The Hindu, Variety, ScreenDaily)   │
    │  ├─ GDELT 2.0 Global Big-Data Document API (Free Real-Time Global Wire)   │
    │  └─ Self-Hosted SearXNG Metasearch (Google/Bing/Brave without API keys)   │
    └─────────────────────────────────────┬─────────────────────────────────────┘
                                          │
    ┌─────────────────────────────────────▼─────────────────────────────────────┐
    │ EXTRACTION & PARSING (Trafilatura + BeautifulSoup4)                       │
    │  Strips ads, boilerplate, navigation; extracts clean text, author, dates  │
    └─────────────────────────────────────┬─────────────────────────────────────┘
                                          │
    ┌─────────────────────────────────────▼─────────────────────────────────────┐
    │ SIX-STAGE INDEPENDENT FACT VERIFICATION ENGINE                            │
    │  ├─ 1. Source Credibility Check (Domain reputation, authority weighting)  │
    │  ├─ 2. Multi-Publisher Corroboration (≥2 independent non-syndicated reps) │
    │  ├─ 3. Claim-Level Fact Extraction (Financial crores, dates, entities)    │
    │  ├─ 4. Temporal Freshness & Recency (Max 48 hours; today's breaking news) │
    │  ├─ 5. Duplicate Detection (3-gram MinHash/Jaccard similarity shingles)   │
    │  └─ 6. Contradiction Analysis (Polar conflict & dispute detection)        │
    │     * Critical contradictions & fabrications trigger automatic BLOCK      │
    └─────────────────────────────────────┬─────────────────────────────────────┘
                                          │
                       ┌──────────────────┴──────────────────┐
                  [Passed 75/100]                       [Failed / Blocked]
                       │                                     │
    ┌──────────────────▼──────────────────┐             ┌────▼─────────────┐
    │ LOCAL AI ARTICLE GENERATION         │             │ REJECTION LOG    │
    │  Ollama (llama3.2 / mistral / qwen) │             │ Audit Trail &    │
    │  Zero paid APIs; anti-hallucination │             │ Block Evidence   │
    └──────────────────┬──────────────────┘             └──────────────────┘
                       │
    ┌──────────────────▼────────────────────────────────────────────────────────┐
    │ AUTOMATED PUBLISHING ENGINE (Dual-Adapter Resilience)                     │
    │  ├─ Web API Adapter: POST /api/articles (Admin Secret Authorization)      │
    │  ├─ Direct DB Adapter: Supabase PostgreSQL `articles` table               │
    │  ├─ Content File Adapter: src/data/automated_news.json (Static export)    │
    │  └─ Safety Gates: Emergency Kill-Switch + High-Risk Category Quarantine   │
    └───────────────────────────────────────────────────────────────────────────┘
```

---

## Hardware & System Requirements

| Resource | Minimum (CPU-Only Mode) | Recommended (GPU-Accelerated) |
| :--- | :--- | :--- |
| **Operating System** | Windows 10/11, macOS, Ubuntu 22.04+ | Ubuntu 22.04+ or Windows 11 WSL2 |
| **RAM** | 8 GB RAM (runs `llama3.2:1b` or `llama3.2:3b`) | 16 GB - 32 GB RAM (runs `llama3.2:3b` or `mistral:7b`) |
| **CPU** | 4-Core modern x86/ARM processor | 8-Core processor or Apple Silicon (M1/M2/M3) |
| **GPU (Optional)** | None required (Ollama runs on CPU) | NVIDIA RTX 3060+ (6GB+ VRAM) or Apple Metal |
| **Disk Space** | 10 GB free space for database & models | 25 GB free space |
| **Network** | Broadband internet connection | Low-latency broadband for feed discovery |

> **Cost Transparency Note**: All software, models, libraries, and source feeds in this system are **100% free and open-source**. There are no API fees, subscriptions, or credit card requirements. The only cost is your standard personal computer electricity and home internet bandwidth.

---

## Quickstart: Running on Your Local Computer in 3 Steps

### Step 1: Install Ollama (Local AI Engine)
1. Download Ollama from [https://ollama.com](https://ollama.com) (free, 1-click installer for Windows, Mac, or Linux).
2. Open terminal and pull the lightweight 3B model:
   ```bash
   ollama pull llama3.2
   ```
3. Start the Ollama server:
   ```bash
   ollama serve
   ```

### Step 2: Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp news_engine/.env.example news_engine/.env
```
Key settings in `.env`:
```ini
OLLAMA_BASE_URL="http://localhost:11434"
OLLAMA_MODEL="llama3.2"
WEBSITE_API_URL="http://localhost:3001"
ADMIN_SECRET_KEY="cinijaatre-super-secret-admin-key-2026"
DRY_RUN_MODE=true # Keep true for initial validation; set false when ready for live publishing
EMERGENCY_PUBLISH_PAUSE=false
```

### Step 3: Run the System Test & Launch Dashboard
1. Run the system self-test:
   ```bash
   python news_engine/scripts/test_system.py
   ```
2. Start the autonomous news engine and admin dashboard:
   ```bash
   python news_engine/scripts/run_dev.py
   ```
3. Open your browser to the **Admin Dashboard**:
   ```
   http://localhost:8000
   ```
   Default credentials: Username `admin`, Password `admin123` (or as set in `ADMIN_PASSWORD`).

---

## 1-Command Production Launch with Docker Compose

If you have Docker Desktop installed, start the entire isolated stack (Postgres, Redis, Ollama, SearXNG, and News Engine):

```bash
cd news_engine
docker compose up -d --build
```

To stop:
```bash
docker compose down
```

To view real-time logs:
```bash
docker compose logs -f news-engine
```

---

## Cloudflare & GitHub Pages Integration

### How It Connects to Your Website
1. **GitHub Pages / Cloudflare Pages Static Build**:
   - The engine automatically saves verified articles into `src/data/automated_news.json`.
   - When committed to GitHub, GitHub Actions builds and deploys the static site to Pages automatically.
2. **Next.js Live API Mode**:
   - The engine dispatches `POST /api/articles` with your `ADMIN_SECRET_KEY`.
   - Articles appear instantly on the live site without waiting for a rebuild.
3. **Cloudflare Tunnel (Optional Remote Deployment)**:
   - If hosting the news engine on your home PC while the website is hosted on Cloudflare, you can expose the local dashboard securely without opening router ports:
     ```bash
     cloudflared tunnel --url http://localhost:8000
     ```

---

## Emergency Controls & Human-in-the-Loop Oversight

- **Emergency Kill-Switch**: In the dashboard or `.env`, toggle `EMERGENCY_PUBLISH_PAUSE=true`. Publishing across all adapters halts immediately.
- **Dry-Run Mode**: Keep `DRY_RUN_MODE=true` to simulate discovery, extraction, verification, and AI article generation without pushing to the live site.
- **High-Risk Category Quarantine**: Stories mentioning elections, health, or legal disputes are quarantined in the "Review Queue" and require manual 1-click approval in the Admin Dashboard.

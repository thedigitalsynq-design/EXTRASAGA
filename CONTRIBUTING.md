# CONTRIBUTING.md — Developer Contribution Guidelines

Thank you for your interest in contributing to **EXTRASAGA**! Please review the guidelines below before opening a pull request or submitting code.

---

## 1. Code of Conduct & Core Principles
- **No `shadcn/ui`**: All UI components must use pure Tailwind CSS and accessible semantic HTML. Do not install `@radix-ui/*` or shadcn component wrappers.
- **English-Only Publication**: UI labels, navigation, metadata, and seed content ship in English (`src/lib/translations.ts` pins one English dictionary; `languages.ts` collapses every legacy code to the English edition). Films keep their own language identity — a Kannada movie is still tagged `kn` as a film fact. No per-language UI parity is required anymore.
- **Zero Fake News**: Never seed misleading or fictional stories. All cinema news items must reflect authentic trade reports or include publisher attribution.
- **Reverent Presentation**: Preserve the landmark status and absence of commercial star ratings on the *Ramayana Part 1* spotlight review.
- **After-Dark Copy Voice (v3.0.0)**: New strings follow the certified film-brain voice — information-first headlines (≤ ~12 words), receipts-backed box office, zero fake tea, verdicts and numbers dead-serious. No clickbait lies, no corporate fam-speak, no emoji-spam, and reverence copy (Ramayana coverage) stays poetic and meme-free.

---

## 2. Local Development Setup

### 2.1 Prerequisites
- Node.js 18.17+ or 20+
- npm or pnpm
- Git

### 2.2 Setup Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/extra-saaga.git
   cd extra-saaga
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables:
   ```bash
   cp .env.example .env.local
   ```
4. Start the local development server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 3. Testing & Quality Checks
Before submitting your code, ensure that all tests and TypeScript compiler checks pass cleanly:

```bash
# Run unit & integration test suites
npm run test

# Run TypeScript static type analysis
npx tsc --noEmit

# Test production build
npm run build
```

---

## 4. Branching & Commit Conventions
- Branch names should follow standard prefixes:
  - `feature/add-box-office-filter`
  - `fix/tamil-font-rendering`
  - `chore/update-dependencies`
  - `docs/update-blueprint`
- Commit messages should be descriptive:
  - `feat(nav): update crimson bar active tab style`
  - `fix(auth): enforce constant-time token comparison`
  - `test(cinema): add 90-day upcoming release test case`

---

## 5. Security & PR Review Checklist
- [ ] No un-sanitized HTML inserted into the DOM.
- [ ] All mutating API routes verify `verifyAdminRequest` or `verifyCronRequest`.
- [ ] Image URLs validate against allowed remote domains or HTTPS protocols.
- [ ] No hardcoded secrets or production credentials in the commit history.


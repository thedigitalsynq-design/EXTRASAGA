# CONTRIBUTING.md — Developer Contribution Guidelines

Thank you for your interest in contributing to **FILMY GARAGE**! Please review the guidelines below before opening a pull request or submitting code.

---

## 1. Code of Conduct & Core Principles
- **No `shadcn/ui`**: All UI components must use pure Tailwind CSS and accessible semantic HTML. Do not install `@radix-ui/*` or shadcn component wrappers.
- **Maintain Multilingual Parity**: Any changes affecting UI labels, navigation menus, or metadata must provide translations across all six languages (`kn`, `te`, `ta`, `ml`, `hi`, `en`) in `src/lib/translations.ts`.
- **Zero Fake News**: Never seed misleading or fictional stories. All cinema news items must reflect authentic trade reports or include publisher attribution.
- **Reverent Presentation**: Preserve the landmark status and absence of commercial star ratings on the *Ramayana Part 1* spotlight review.

---

## 2. Local Development Setup

### 2.1 Prerequisites
- Node.js 18.17+ or 20+
- npm or pnpm
- Git

### 2.2 Setup Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/cinijaatre.git
   cd cinijaatre
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


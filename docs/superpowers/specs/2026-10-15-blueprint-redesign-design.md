# Personal website redesign: "Blueprint"

Date: 2026-10-15 · Status: draft for review · Branch: `feature/blueprint-redesign`

Visual source of truth: the approved canvas, artboards "B · Blueprint" (desktop and mobile) and
"B · 02 Projects / 03 About / 04 Contact": https://claude.ai/artifact/FAHAkktwHZc3XTgX6mGUcU.
Variant A (Dark Signal) on the same canvas was rejected and is not part of this spec.

## 1. Goal

Replace the current Create React App portfolio with a fast, static, one-page site that gets a UK
recruiter or hiring manager from "who is this" to "open the CV / the repo" in under 30 seconds,
for Backend / AI Engineer roles.

Success criteria:

- The first screen shows, without scrolling: name, role (Backend / AI Engineer), core stack,
  CV / GitHub / LinkedIn buttons and the three featured projects.
  Desktop: at viewports from 1280×800. Mobile: at 390×844.
- Content is visible on first paint: no loader, no intro screen, no "click to enter", no 3D.
- Every fact on the site is backed by code, CI or the user (see section 9).
- Lighthouse (mobile, production build): Performance ≥ 95, Accessibility 100, Best Practices 100,
  SEO 100.

## 2. Constraints and decisions already made

| Decision | Value |
|---|---|
| Visual direction | B "Blueprint": paper ground, drawing-sheet grid of 1px rules, one accent, mono labels, grain |
| Accent | Ultramarine `#2438D8`, the only accent colour |
| Motion | None beyond hover / focus colour changes; no Framer Motion |
| Loaders, intro screens, 3D | Not allowed |
| Contact | `mailto:` and links only; no form; EmailJS is removed |
| Languages section | Not shown |
| Live links | Only where a deployment exists and responds; otherwise repo only, no LIVE button |
| Test counts on cards | Only where CI runs the tests and is green |
| Theme | Light only |

## 3. Stack

| Part | Choice | Version (npm, 2026-10-15) |
|---|---|---|
| Framework | Next.js, App Router, all routes statically prerendered; default build, not `output: 'export'` | 16.4.1 |
| UI | React | 19.3.x |
| Language | TypeScript, `strict` | 6.0.3, not 7.x: `typescript-eslint` supports `<6.1.0` |
| Styling | Tailwind CSS v4, CSS-first `@theme` tokens | 4.3.x with `@tailwindcss/postcss` |
| Fonts | `next/font/google`: Schibsted Grotesk (400, 500, 600), IBM Plex Mono (400, 500) | self-hosted at build |
| Lint | ESLint flat config + `eslint-config-next` | 10.x / 16.4.x |
| Unit tests | Vitest + Testing Library | 5.x / 16.x |
| E2E | Playwright + `@axe-core/playwright` | 1.64.x |
| Runtime | Node.js 24 LTS (Next requires ≥ 20.9) | |
| Hosting | Vercel, existing project and domain `personal-website-bogdusik.vercel.app` | |

Removed with the old app: `react-scripts`, `framer-motion`, `react-typed`, `react-icons`,
`@emailjs/browser`, `web-vitals`, the particle background, the interactive demo, the theme toggle
and swipe navigation. Icons are inline stroke SVG.

## 4. Repository layout and migration

Per the folder convention, the new app lives in `frontend/`; the old CRA app at the repo root is
deleted in the same branch (it stays in git history).

```
Personal-Web-Site/
├── frontend/
│   ├── public/
│   │   ├── cv.pdf                 # renamed from "CV Bohdan Bozhenko.pdf"
│   │   ├── grain.png              # 160×160 noise tile, < 8 KB
│   │   └── favicon.svg
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx         # fonts, metadata, JSON-LD, skip link
│   │   │   ├── page.tsx           # the four sheets
│   │   │   ├── globals.css        # @import "tailwindcss"; @theme tokens; grain
│   │   │   ├── opengraph-image.tsx
│   │   │   ├── sitemap.ts
│   │   │   ├── robots.ts
│   │   │   └── not-found.tsx
│   │   ├── components/            # see section 6
│   │   └── content/               # typed content, see section 7
│   ├── scripts/
│   │   └── check-js-budget.mjs
│   ├── tests/
│   │   ├── unit/
│   │   └── e2e/
│   ├── next.config.ts
│   ├── vercel.json                # CV redirect
│   ├── playwright.config.ts
│   ├── vitest.config.ts
│   ├── eslint.config.mjs
│   └── package.json
├── docs/superpowers/specs/
├── .github/workflows/ci.yml
└── README.md                      # rewritten for the new stack
```

CV redirect: the old site served the CV at `/CV%20Bohdan%20Bozhenko.pdf` (`src/components/Hero.js`).
The redirect to `/cv.pdf` lives in `frontend/vercel.json`, not in `next.config.ts` `redirects()`:
`redirects()` stops working if the build is ever switched to `output: 'export'`, and `vercel.json`
works with either. Because `next start` does not read `vercel.json`, the redirect is verified
against the Vercel preview deployment, not in local E2E.

The CV file is `CV_Bohdan_Bozhenko_Glasgow.pdf` (fresh Canva export, supplied by the user),
published as `public/cv.pdf`. The old `public/CV Bohdan Bozhenko.pdf` is not carried over.

### Deployment steps

Changing a Vercel project's Root Directory affects every deployment of that project, production
from `main` included, so the switch happens in two projects:

1. **Preview project.** Create a second Vercel project from the same repository (for example
   `personal-website-next`) with Root Directory `frontend`, Node 24 and framework Next.js. It
   builds `feature/*` branches; the production project keeps serving the old CRA site from `main`.
2. **Review on the preview URL:** the content, the CV redirect, and a Lighthouse run on mobile.
3. **Merge** the stage PR into `main` (squash).
4. **Switch production at merge time:** in the existing project, set Root Directory to `frontend`
   and redeploy `main`. `personal-website-bogdusik.vercel.app` now serves the new site.
5. **Verify production:** `/`, `/cv.pdf`, the old CV URL redirect, and the OG card.
6. **Clean up:** delete the preview project or keep it for later preview branches; tag `v2.0.0`.

Rollback: set the production project's Root Directory back to the repository root and promote the
last CRA deployment in Vercel.

## 5. Visual system

Tokens, defined once in `globals.css` under `@theme`:

| Token | Value | Use |
|---|---|---|
| `--color-paper` | `#F1EFE8` | page ground |
| `--color-ink` | `#191917` | headings, primary text, diagram strokes |
| `--color-ink-2` | `#3E3C38` | subtitle, card summaries |
| `--color-ink-3` | `#4A4843` | body copy |
| `--color-muted` | `#5E5C55` | mono labels (5.7:1 on paper) |
| `--color-rule` | `#BDB9AE` | 1px sheet rules, dashed separators |
| `--color-accent` | `#2438D8` | the only accent (7.6:1 on paper) |
| `--font-sans` | Schibsted Grotesk | display and body |
| `--font-mono` | IBM Plex Mono | labels, stack lines, spec tables, diagram |

Type scale (desktop / mobile): name 104 / 52 px, line-height 0.92, tracking −0.045em, weight 600;
role 34 / 22 px, accent; section title 72 / 40 px; card title 26–32 / 18–24 px; body 14–17 px;
mono labels 10.5–12 px, uppercase, tracking 0.06em.

Grain: `grain.png` tiled as a `background-image` on `body` with `mix-blend-mode: multiply` at
about 14% opacity. Not a full-screen SVG `feTurbulence` filter: that repaints on scroll and costs
frames on mobile.

The sheet frame: an 8px inset with a 1px `--color-rule` border; cells are separated by 1px rules,
never by shadows or rounded cards. Corner radius is 0 everywhere.

## 6. Page structure and components

One route, `/`, with four sheets. Anchors: `#work`, `#projects`, `#about`, `#contact`.

**Sheet 01 · Index (hero)**

- `SiteHeader` (not sticky): name cell, "SHEET 01 / 04 — INDEX", status "● AVAILABLE — IMMEDIATE
  START", CONTACT link. Below 1024px: name cell plus a MENU button, with the status as its own
  strip underneath.
- `MobileMenu` (the only Client Component): a disclosure button with `aria-expanded` and
  `aria-controls`, links to 02 / 03 / 04, CV, GitHub and LinkedIn; it closes on Esc, on link click
  and on outside click, and returns focus to the button.
- `Hero`: mono kicker, name, role, subtitle "Python / FastAPI · Spring Boot · PostgreSQL",
  `ButtonLink` × 3 (CV filled with the accent, GitHub and LinkedIn outlined).
- `SystemDiagram` (SearchWork), built in HTML + CSS grid, not as an image, so it scales and stays
  crisp:
  - nodes: NEXT.JS / CLIENT; FASTAPI / ASYNC SERVICE / RATE LIMITING (SLOWAPI), in the accent;
    POSTGRESQL / STORE; CLAUDE API / CV PARSING · MATCH SCORING · COVER LETTERS;
    11 JOB-BOARD APIS / ADZUNA · REED · …
  - edges with arrowheads: Next.js → FastAPI labelled "JWT + GOOGLE OAUTH"; FastAPI → PostgreSQL
    "ASYNC ORM"; FastAPI → Claude "LLM"; job APIs → FastAPI "INGEST".
  - ≥ 1024px: horizontal elevation in the hero's right column. Below 1024px: vertical layout
    (spine Next.js → FastAPI → PostgreSQL, Claude and job APIs on the right), placed after the
    featured projects.
  - `<figure>` with a text `aria-label` describing the flow; the drawing itself is `aria-hidden`.
- `FeaturedProjects`: three `ProjectCard variant="featured"` cells and the `SpecTable`
  (TYPE, STACK, AI, EDUCATION, LOCATION, RIGHT TO WORK). On mobile the cards become
  `ProjectRow`s (code, title, stack, arrow) and the spec shows EDUCATION and LOCATION only.

**Sheet 02 · Projects**: `SheetBand` (sheet number, title, note, "All repositories on GitHub")
and four `ProjectCard variant="detailed"` in a 2×2 grid, one column on mobile. A detailed card has
a meta line (code + CI / test badge or tag), title, one-line summary, stack line, a "HARD PART"
block and links.

**Sheet 03 · About**: bio (two paragraphs), Experience, Writing (two HackerNoon articles, same
row style as Experience: date, title as a link, publication, an optional "TOP STORY" mark),
Education table plus certificate line, Tools grid (BACKEND, DATA, AI / LLM, FRONTEND, DELIVERY,
SECURITY).

**Sheet 04 · Contact**: statement "Hiring for a backend or AI role in Scotland? Let's talk.",
EMAIL ME (`mailto:`) and DOWNLOAD CV buttons, direct-lines table (email, LinkedIn, GitHub,
location, right to work), footer ("© 2026 Bohdan Bozhenko", "Built with Next.js + TypeScript",
"End of drawing set", back to top).

Breakpoints: below 1024px every sheet is a single column, in the order of the mobile artboards;
from 1024px the desktop grids apply, with fluid columns (`fr` / `minmax`) instead of the
mockup's fixed pixel widths. No horizontal scroll at any width from 320px up.

## 7. Content model

All copy lives in typed modules under `src/content/`, and components only render it. That way the
"verified facts" rule is reviewable in one place and testable.

```ts
// src/content/types.ts
export type ProjectLinks = {
  repo: string;          // https://github.com/Bogdusik/...
  live?: string;         // only for deployments that respond
  demo?: string;         // e.g. AI Office demo GIF
  article?: string;      // the HackerNoon write-up about this project
};

export type Article = {
  title: string;
  url: string;
  publication: 'HackerNoon';
  published: string;     // ISO date
  topStory?: true;       // only when the article carries #hackernoon-top-story
  projectId?: string;    // links the article to its project card
};

export type CiBadge = {
  testsRunInCi: true;    // a count may only be shown when CI runs the tests
  tests: number;         // from the last green CI run
};

export type Project = {
  id: string;
  code: `P-0${number}`;
  title: string;
  tag: string;           // right side of the meta line, e.g. "HONOURS · FIRST CLASS"
  summary: string;
  stack: string[];
  hardPart?: string;     // required for detailed cards
  ci?: CiBadge;
  links: ProjectLinks;
  placement: 'featured' | 'projects';
};
```

Modules: `profile.ts` (name, role, subtitle, status, location, right to work, contacts),
`projects.ts`, `writing.ts` (articles), `about.ts` (bio, experience, education, certificate,
tools), `diagram.ts` (SearchWork nodes and edges).

## 8. Content

Featured (sheet 01):

| Code | Project | Tag | Summary | Stack | Links |
|---|---|---|---|---|---|
| P-01 | SearchWork | LIVE | Job tracker for UK graduate roles: 11 job-board APIs (Adzuna, Reed…), Claude-powered CV parsing and match scoring. JWT + Google OAuth, rate limiting, 12 security-audit findings fixed. | FastAPI · PostgreSQL · Claude API · Next.js | repo, live `searchwork-bogdusik.vercel.app`, article |
| P-02 | AI Office | CI ✓ · 483 tests | Local 3D office where AI agents run tasks in stages (plan → research → draft → self-check) on Ollama, with a review queue. | FastAPI · PostgreSQL · Ollama · Next.js | repo, demo GIF `docs/screenshots/01-hero.gif` |
| P-03 | Programming Helper AI | HONOURS · FIRST CLASS | AI tutor that explains code in real time, with guided tasks and progress tracking. | Next.js · tRPC · Prisma / PostgreSQL · OpenAI | repo, live `programming-helper-ai.vercel.app` |

Projects (sheet 02):

| Code | Project | Badge / tag | Hard part | Links |
|---|---|---|---|---|
| P-04 | AI QA Assistant | CI ✓ · 49 tests | Zod-validated, normalised model output with one retry on failed validation; PENDING → ACCEPTED / REJECTED; exports include accepted items only | repo, live `ai-qa-assistant-lyart.vercel.app` |
| P-05 | Real-time Chat | CI ✓ · 23 tests · Testcontainers | Persist, then broadcast; per-session frame order; STOMP integration test on PostgreSQL in Testcontainers | repo |
| P-06 | Checkers | CI ✓ · 14 tests | Server-authoritative moves (FEN, turn and ownership checks, rules engine); SSE updates; both ELO ratings updated in one transaction | repo (the Vercel deployment is behind Vercel login; LIVE is added once it is public) |
| P-07 | FLYON | GEOSPATIAL · REAL-TIME | See the FLYON hard part below | repo, article |

FLYON hard part (the fix is merged, FLYON#9): "Live ingest got slower as a flight grew: every
telemetry point re-aggregated the whole flight, about 40.5M `ST_Distance` calls for a 9,000-point
flight, and indexes could not help. I replaced it with an incremental accumulator and a per-flight
write queue: 152.8 s → 50.1 s for the same flight."

About:

- Bio: "I'm a backend and AI engineer in Dumfries, Scotland. I build APIs and LLM-powered features
  in Python and Java, and I treat security as part of the job, a habit from my Cyber Security
  HNC." / "I graduated from Glasgow Caledonian University with First Class Honours in 2026 and
  I'm looking for my first engineering role in Glasgow or Edinburgh, office or hybrid."
- Experience: The Devil's Porridge Museum, volunteer, Dec 2024 – Jun 2025.
  "Maintained the museum's WordPress website and digital outreach. Event enquiries reached more
  than double the initial target, with 50+ extra participants."
- Writing (HackerNoon):
  - "I Added Every Index, but My Telemetry Pipeline Was Still Quadratic", 2026-10-06, top story,
    about FLYON:
    https://hackernoon.com/i-added-every-index-but-my-telemetry-pipeline-was-still-quadratic
  - "I Built an AI Job Tracker While Job Hunting: The AI Was the Easy Part", 2026-09-02, about
    SearchWork:
    https://hackernoon.com/i-built-an-ai-job-tracker-while-job-hunting-the-ai-was-the-easy-part
- Education: GCU, BSc (Hons) Computing, First Class, 2023–2026; Dumfries and Galloway College,
  HNC Cyber Security, 2022–2023; National Aerospace University "KhAI", Junior Bachelor's in
  Software Engineering, completed 2023. Certificate: Cisco Networking Academy, Networking
  Essentials (2023).

## 9. Fact sources

| Claim | Source |
|---|---|
| SearchWork: 11 job-board APIs | 11 `*_service.py` source services in `SearchWork/backend/services`; README fixed in SearchWork#2 |
| SearchWork: Claude for CV parsing, match scoring, cover letters (and ATS review) | `backend/services/ai_service.py` |
| SearchWork: 12 security-audit findings fixed | commits `9491be5`, `36b78fb`, `8b91850` (findings #1–8, #10, #12, #14, #17) |
| SearchWork: rate limiting (slowapi), JWT + Google OAuth | README tech stack, `backend/requirements.txt`, `auth.py` |
| Programming Helper AI on OpenAI | `package.json` (`openai`), `lib/openai.ts` |
| AI QA Assistant: 49 tests in CI | AI-QA-Assistant#2 added `npm test` to CI; green run, 3 files / 49 tests |
| Real-time Chat: 23 tests (18 backend, 5 frontend), Testcontainers | PR #4, CI green on `ea82122` |
| Checkers: 14 tests in CI | `.github/workflows/ci.yml` runs `npm test`; green on `main`; local run 14/14 |
| FLYON: quadratic ingest found and fixed | before: `telemetryService.ts` called the full recompute per point (Σ(1..9000) = 40,504,500 distance calls); fix merged in FLYON#9 (`0b2c990`); 152.8 s → 50.1 s from `docs/performance/telemetry-ingest.md` (benchmark run 2026-10-15) |
| AI Office: 483 backend tests in CI | `pytest --collect-only` on `27086d2` (= `origin/main`): 483; CI job "Backend (pytest)" green on `main` |
| AI Office: 33 audit findings | `docs/audit.md`, summary table (6 High, 9 Medium, 11 Low, 7 Info). The file is not committed, so it is not shown on the site (open item 2) |
| Articles: titles, dates, top story | both URLs return 200 (2026-10-15); `datePublished` in the page; FLYON article tagged `#hackernoon-top-story` |
| Live URLs | HTTP 200 on 2026-10-15 (SearchWork, Programming Helper AI, AI QA Assistant) |
| Volunteer outcome and dates, bio wording | provided by the user |

When a number changes (new tests, more job sources), it is updated in `src/content/` with its
new source.

## 10. Accessibility

- WCAG 2.2 AA: contrast as in section 5; visible focus ring (2px accent outline, 2px offset) on
  every interactive element; skip link to `#main`.
- Real `<a>` and `<button>` elements; touch targets ≥ 44px; icon-only controls carry `aria-label`.
- One `h1` (the name); sheets use `h2`, cards use `h3`.
- The system diagram is described in text; decorative glyphs (●, →, ↗) are `aria-hidden`, and
  the link text carries the meaning ("Repository", "Live demo").
- External links open in the same tab, except the CV (`download` attribute).
- `prefers-reduced-motion` has nothing to disable, since there are no animations.

## 11. Performance

- All of `/` is prerendered at build. Server Components everywhere except `MobileMenu`.
- Budgets: first-load JS for `/` ≤ 130 kB gzip; LCP ≤ 1.8 s and CLS ≤ 0.02 on Lighthouse mobile;
  total transfer for the first view ≤ 350 kB excluding the CV.
- Enforcement comes in the last implementation stage: `scripts/check-js-budget.mjs` sums the gzip
  size of every script the prerendered `index.html` references (independent of what `next build`
  prints), and Lighthouse CI asserts the Lighthouse scores and metrics. Before that stage they are
  checked by hand on the preview URL.
- Fonts are self-hosted via `next/font` with `display: swap` and the Latin subset only.
- No images on the first screen except the 8 KB grain tile; the demo GIF is a link, not embedded.

## 12. SEO and sharing

- Metadata API: title "Bohdan Bozhenko — Backend / AI Engineer", a description, canonical URL,
  Open Graph and Twitter cards.
- `opengraph-image.tsx` renders a 1200×630 blueprint card (name, role, accent rule) at build.
- JSON-LD `Person`: name, jobTitle, `alumniOf` GCU, `address.addressLocality` Dumfries, `sameAs`
  GitHub and LinkedIn.
- `sitemap.ts`, `robots.ts`, `not-found.tsx` in the same visual language.

## 13. Testing and CI

Unit tests (Vitest + Testing Library):

- content integrity: unique ids and codes; exactly three `featured` projects; every `projects`
  entry has `hardPart`; every `repo` is under `https://github.com/Bogdusik/`; a `ci` badge is
  allowed only with `testsRunInCi: true` and `tests > 0`;
- every article with a `projectId` matches that project's `links.article`, and vice versa;
- `ProjectCard` renders LIVE, DEMO and ARTICLE links only when `links.live`, `links.demo` and
  `links.article` are set;
- `MobileMenu`: toggles `aria-expanded`, closes on Esc and returns focus.

E2E (Playwright, against `next build && next start`, Chromium):

- at 390×844 and 1440×900: no horizontal overflow; the first-screen elements from section 1
  are inside the viewport; anchors scroll to their sheets;
- the mobile menu works with the keyboard alone;
- `@axe-core/playwright` reports no violations;
- `/cv.pdf` returns 200.

Deployment smoke (run against the Vercel URL after each deploy, with `BASE_URL`): `/` returns 200,
`/cv.pdf` returns 200, and `/CV%20Bohdan%20Bozhenko.pdf` answers 308 to `/cv.pdf`.

CI (`.github/workflows/ci.yml`, `working-directory: frontend`, Node 24): `npm ci` → lint →
`tsc --noEmit` → unit tests → build → Playwright; in the last stage, the JS budget script and
Lighthouse CI join. It runs on pull requests and on pushes to `main`.

## 14. Out of scope

- Dark theme, i18n, blog, analytics, CMS.
- A contact form or any backend; the site has no API, so the `/llms.txt` rule for APIs does not
  apply.
- Sticky or scroll-spy navigation; the header is as drawn.
- Deploying FLYON, AI QA Assistant or Checkers. Their LIVE links are added only when the user
  supplies working URLs.

## 15. Open items

1. FLYON: resolved, the fix is merged (FLYON#9).
2. AI Office audit: the summary `docs/security-audit.md` is in AI-Office#1. Not every High finding
   is fully fixed (H1 and P2 are partly fixed), so the card shows "CI ✓ · 483 TESTS · SECURITY
   AUDIT ↗" linking to that file, without a number.
3. Checkers: a public Vercel URL (the current one is behind Vercel login).
4. The CV file `CV_Bohdan_Bozhenko_Glasgow.pdf`, supplied by the user.

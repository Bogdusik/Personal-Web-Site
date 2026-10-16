# Blueprint Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the Create React App portfolio with a static one-page Next.js 16 + TypeScript site in the approved "Blueprint" design, live in production after Stage 1.

**Architecture:** A new Next.js App Router app in `frontend/`, every route prerendered at build. All copy lives in typed modules under `src/content/` and is rendered by small Server Components; the only Client Component is the mobile menu. The site ships in four stages, each merged to `main` and deployed: launch, SEO and sharing, end-to-end tests, then performance budgets.

**Tech Stack:** Next.js 16.4.1, React 19.3, TypeScript 6.0.3, Tailwind CSS 4.3 (`@tailwindcss/postcss`), `next/font/google`, Vitest 5 + Testing Library, Playwright 1.64 + `@axe-core/playwright` 4.14, `@lhci/cli` 0.15, Node 24 LTS, Vercel.

**Spec:** `docs/superpowers/specs/2026-10-15-blueprint-redesign-design.md`. Visual source of truth: the "B · Blueprint" artboards at https://claude.ai/artifact/FAHAkktwHZc3XTgX6mGUcU. Where this plan and the canvas disagree on copy, the spec's section 8 wins.

## Global Constraints

- Node 24 LTS; `"engines": { "node": "24.x" }`.
- TypeScript pinned to `6.0.3` (not 7.x: `typescript-eslint` supports `<6.1.0`).
- Default Next.js build; never `output: 'export'`.
- Colours: paper `#F1EFE8`, ink `#191917`, ink-2 `#3E3C38`, ink-3 `#4A4843`, muted `#5E5C55`, rule `#BDB9AE`, accent `#2438D8`. The accent is the only accent colour.
- Fonts: Schibsted Grotesk (400, 500, 600) and IBM Plex Mono (400, 500) via `next/font/google`, Latin subset, `display: 'swap'`.
- Corner radius 0 everywhere; separators are 1px rules, never shadows.
- No animations, no Framer Motion, no loaders, no intro screens, no 3D.
- No contact form and no EmailJS: `mailto:` and links only.
- Every fact on the page comes from `src/content/` and has a source in the spec's section 9. Test counts appear only with `testsRunInCi: true`. LIVE links appear only for deployments that respond.
- Touch targets ≥ 44px; visible focus ring of 2px accent outline with 2px offset.
- No horizontal scroll at any width from 320px.
- Commits: conventional (`type(scope): description`), with no `Co-Authored-By` or any other attribution trailer. Never commit to `main` directly; every stage is a PR, squash-merged.
- Deviation from the spec, on purpose: the budget script is `scripts/check-js-budget.mts` (run by Node 24's built-in type stripping) instead of `.mjs`, so `tsc` checks it.

## Review Focus

1. **Narrow phones (320px) with long unbreakable strings** (the email, "NEXT.JS · tRPC · PRISMA / POSTGRESQL · OPENAI", "CV PARSING · MATCH SCORING · COVER LETTERS", article titles) must wrap, not scroll sideways. Components use `min-w-0` and `break-words`/`overflow-wrap:anywhere` (Tasks 4, 6, 8); pinned by the 320px overflow test in Task 12.
2. **JavaScript disabled or still loading**: every section, all CTAs and the featured project details must be reachable; only the menu is inert. Featured rows use native `<details>`; pinned by the no-JS test in Task 12.
3. **A dead or private external link** (a Vercel deployment switched to "login required", as happened with Checkers; a moved HackerNoon slug) must be caught before visitors find it. Pinned by the external-link smoke test in Task 9.
4. **Keyboard-only visitors**: the skip link is the first focusable element and moves focus to `#main`; Esc closes the menu and returns focus to its button. Pinned by unit tests in Tasks 3 and 5 and by the keyboard test in Task 12.
5. **The download name of the CV**: a recruiter saving the file must get `Bohdan_Bozhenko_CV.pdf`, not `cv.pdf`. Pinned by the `download` attribute assertion in Task 7.

---

# Stage 1 — Launch (ends with the new site in production)

> **Order change (user, 2026-10-16):** Task 11 (metadata, Open Graph, JSON-LD, sitemap, robots, OG image, 404) runs on this branch **before Task 10**, so LinkedIn caches the right card from the first share. Stage 2 is therefore empty. Claude never pushes: the user pushes the branch and does the Vercel steps in Task 10.

Branch: `feature/blueprint-redesign` (already exists; it holds the spec and this plan).

### Task 1: Scaffold the Next.js app and CI

**Files:**
- Create: `frontend/` (via `create-next-app`), `frontend/vitest.config.ts`, `frontend/tests/setup.ts`, `frontend/tests/unit/home.test.tsx`, `.github/workflows/ci.yml`
- Modify: `frontend/package.json`, `frontend/src/app/page.tsx`
- Delete: `src/`, `public/`, `package.json`, `package-lock.json`, `start-dev.sh`, `.vercelignore` (the old CRA app at the repo root)

**Interfaces:**
- Produces: npm scripts `dev`, `build`, `start`, `lint`, `typecheck`, `test`, `test:smoke`; the `@/*` → `src/*` import alias; Vitest running `tests/unit/**/*.test.{ts,tsx}` in jsdom.

- [ ] **Step 1: Scaffold the app**

From the repo root, on `feature/blueprint-redesign`:

```bash
npx create-next-app@16.4.1 frontend --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm --yes
cd frontend
npm i -D -E typescript@6.0.3
npm i -D @types/node@24 vitest@5 @vitejs/plugin-react@6 jsdom@30 @testing-library/react@16 @testing-library/dom@10 @testing-library/jest-dom@7 @testing-library/user-event@14
```

Expected: `frontend/` contains `src/app/`, `package.json`, `eslint.config.mjs`, `postcss.config.mjs`, `next.config.ts`, `tsconfig.json`. `create-next-app` does not create a nested git repo inside an existing one.

- [ ] **Step 2: Set scripts and engines in `frontend/package.json`**

Replace the `scripts` block and add `engines`:

```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "eslint",
  "typecheck": "tsc --noEmit",
  "test": "vitest run",
  "test:smoke": "vitest run --config vitest.smoke.config.ts"
},
"engines": { "node": "24.x" }
```

- [ ] **Step 3: Configure Vitest**

`frontend/vitest.config.ts`:

```ts
import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    include: ['tests/unit/**/*.test.{ts,tsx}'],
  },
});
```

`frontend/tests/setup.ts`:

```ts
import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

afterEach(() => cleanup());
```

- [ ] **Step 4: Write the failing test**

`frontend/tests/unit/home.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import Home from '@/app/page';

it('renders the name as the only h1', () => {
  render(<Home />);
  expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
  expect(screen.getByRole('heading', { level: 1, name: 'Bohdan Bozhenko' })).toBeInTheDocument();
});
```

- [ ] **Step 5: Run it to verify it fails**

Run: `npm test`
Expected: FAIL, because the default page has no h1 "Bohdan Bozhenko".

- [ ] **Step 6: Replace the default page**

`frontend/src/app/page.tsx`:

```tsx
export default function Home() {
  return (
    <main id="main">
      <h1>Bohdan Bozhenko</h1>
    </main>
  );
}
```

Delete the default `frontend/public/*.svg` files that `create-next-app` added.

- [ ] **Step 7: Run all checks**

Run: `npm test && npm run lint && npm run typecheck && npm run build`
Expected: 1 test passes; lint, typecheck and build succeed.

- [ ] **Step 8: Remove the CRA app**

From the repo root:

```bash
git rm -r -q src public package.json package-lock.json start-dev.sh .vercelignore
```

Keep `README.md` (rewritten in Task 9) and `.gitignore`.

- [ ] **Step 9: Add CI**

`.github/workflows/ci.yml`:

```yaml
name: CI

on:
  pull_request:
  push:
    branches: [main]

jobs:
  web:
    name: Lint, types, unit tests, build
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: frontend
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 24
          cache: npm
          cache-dependency-path: frontend/package-lock.json
      - run: npm ci
      - run: npm run lint
      - run: npm run typecheck
      - run: npm test
      - run: npm run build
```

- [ ] **Step 10: Commit**

```bash
git add -A
git commit -m "chore(frontend): scaffold Next.js 16 app, Vitest and CI; remove CRA app"
```

### Task 2: Content model and data

**Files:**
- Create: `frontend/src/content/types.ts`, `profile.ts`, `projects.ts`, `writing.ts`, `about.ts`, `diagram.ts`, `format.ts`, `links.ts`, `site.ts`
- Test: `frontend/tests/unit/content.test.ts`, `frontend/tests/unit/format.test.ts`

**Interfaces:**
- Produces (types): `Profile`, `SpecRow`, `Project`, `ProjectLinks`, `CiBadge`, `Article`, `About`, `Experience`, `Education`, `ToolGroup`, `Diagram`, `DiagramNode`, `DiagramEdge`, `EdgeDir`.
- Produces (values): `profile: Profile`, `projects: Project[]`, `featuredProjects: Project[]`, `otherProjects: Project[]`, `articles: Article[]`, `about: About`, `diagram: Diagram`, `SITE_URL: string`.
- Produces (functions): `formatCi(ci: CiBadge): string`, `metaRight(p: Project): string`, `formatMonthYear(iso: string): string`, `externalLinks(): string[]`.

- [ ] **Step 1: Write the types**

`frontend/src/content/types.ts`:

```ts
export type SpecRow = { label: string; value: string; mobile?: boolean };

export type Profile = {
  name: string;
  role: string;
  stackLine: string;
  status: string;
  email: string;
  github: string;
  linkedin: string;
  cvPath: '/cv.pdf';
  cvDownloadName: string;
  location: string;
  rightToWork: string;
  spec: SpecRow[];
};

export type ProjectLinks = {
  repo: string;
  live?: string;
  demo?: string;
  article?: string;
};

export type CiBadge = {
  testsRunInCi: true;
  tests: number;
  note?: string;
  link?: { text: string; href: string };
};

export type Project = {
  id: string;
  code: `P-0${number}`;
  title: string;
  tag: string;
  summary: string;
  stack: string[];
  hardPart?: string;
  ci?: CiBadge;
  links: ProjectLinks;
  placement: 'featured' | 'projects';
};

export type Article = {
  title: string;
  url: string;
  publication: 'HackerNoon';
  published: string;
  topStory?: true;
  projectId?: string;
};

export type Experience = { dates: string; org: string; text: string };
export type Education = { years: string; school: string; award: string; highlight?: string };
export type ToolGroup = { group: string; items: string[] };

export type About = {
  bio: [string, string];
  experience: Experience[];
  education: Education[];
  certificate: string;
  tools: ToolGroup[];
};

export type EdgeDir = 'up' | 'down' | 'left' | 'right';
export type DiagramNodeId = 'client' | 'api' | 'db' | 'claude' | 'jobs';
export type DiagramNode = { id: DiagramNodeId; title: string; lines: string[]; accent?: true };
export type DiagramEdge = {
  id: 'eauth' | 'eorm' | 'ellm' | 'eingest';
  label: string;
  mobile: EdgeDir;
  desktop: EdgeDir;
};
export type Diagram = {
  caption: string;
  description: string;
  nodes: DiagramNode[];
  edges: DiagramEdge[];
};
```

`CiBadge.note` and `CiBadge.link` extend the spec's type: the "TESTCONTAINERS" suffix on Real-time Chat and the "SECURITY AUDIT ↗" link on AI Office.

- [ ] **Step 2: Write the failing tests**

`frontend/tests/unit/content.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { about } from '@/content/about';
import { diagram } from '@/content/diagram';
import { externalLinks } from '@/content/links';
import { profile } from '@/content/profile';
import { featuredProjects, otherProjects, projects } from '@/content/projects';
import { articles } from '@/content/writing';

describe('projects', () => {
  it('has unique ids and codes', () => {
    expect(new Set(projects.map((p) => p.id)).size).toBe(projects.length);
    expect(new Set(projects.map((p) => p.code)).size).toBe(projects.length);
  });

  it('features exactly P-01..P-03 and lists P-04..P-07 below', () => {
    expect(featuredProjects.map((p) => p.code)).toEqual(['P-01', 'P-02', 'P-03']);
    expect(otherProjects.map((p) => p.code)).toEqual(['P-04', 'P-05', 'P-06', 'P-07']);
  });

  it('gives every non-featured project a hard part', () => {
    for (const p of otherProjects) expect(p.hardPart, p.id).toBeTruthy();
  });

  it('points every repo at github.com/Bogdusik', () => {
    for (const p of projects) expect(p.links.repo, p.id).toMatch(/^https:\/\/github\.com\/Bogdusik\/[\w.-]+$/);
  });

  it('shows test counts only for tests that run in CI', () => {
    for (const p of projects) {
      if (!p.ci) continue;
      expect(p.ci.testsRunInCi, p.id).toBe(true);
      expect(Number.isInteger(p.ci.tests) && p.ci.tests > 0, p.id).toBe(true);
    }
  });

  it('keeps Checkers without a LIVE link until its deployment is public', () => {
    expect(projects.find((p) => p.id === 'checkers')?.links.live).toBeUndefined();
  });
});

describe('articles', () => {
  it('match their project cards both ways', () => {
    for (const a of articles) {
      if (!a.projectId) continue;
      expect(projects.find((p) => p.id === a.projectId)?.links.article, a.title).toBe(a.url);
    }
    for (const p of projects) {
      if (!p.links.article) continue;
      expect(articles.find((a) => a.url === p.links.article)?.projectId, p.id).toBe(p.id);
    }
  });
});

describe('profile and about', () => {
  it('shows exactly two spec rows on mobile', () => {
    expect(profile.spec.filter((r) => r.mobile).map((r) => r.label)).toEqual(['EDUCATION', 'LOCATION']);
  });

  it('lists three education entries and six tool groups', () => {
    expect(about.education).toHaveLength(3);
    expect(about.tools.map((t) => t.group)).toEqual(['BACKEND', 'DATA', 'AI / LLM', 'FRONTEND', 'DELIVERY', 'SECURITY']);
  });
});

describe('diagram', () => {
  it('has the five nodes and four edges of the SearchWork elevation', () => {
    expect(diagram.nodes.map((n) => n.id).sort()).toEqual(['api', 'claude', 'client', 'db', 'jobs']);
    expect(diagram.edges.map((e) => e.id).sort()).toEqual(['eauth', 'eingest', 'ellm', 'eorm']);
  });
});

describe('externalLinks', () => {
  it('is https-only and free of duplicates', () => {
    const links = externalLinks();
    expect(new Set(links).size).toBe(links.length);
    for (const l of links) expect(l, l).toMatch(/^https:\/\//);
  });
});
```

`frontend/tests/unit/format.test.ts`:

```ts
import { expect, it } from 'vitest';
import { formatCi, formatMonthYear, metaRight } from '@/content/format';
import type { Project } from '@/content/types';

const base: Project = {
  id: 'x', code: 'P-09', title: 'X', tag: 'TAG', summary: 's', stack: [], links: { repo: 'https://github.com/Bogdusik/x' }, placement: 'projects',
};

it('formats a CI badge with and without a note', () => {
  expect(formatCi({ testsRunInCi: true, tests: 49 })).toBe('CI ✓ · 49 TESTS');
  expect(formatCi({ testsRunInCi: true, tests: 23, note: 'TESTCONTAINERS' })).toBe('CI ✓ · 23 TESTS · TESTCONTAINERS');
});

it('uses the CI badge for the meta line when there is one, else the tag', () => {
  expect(metaRight(base)).toBe('TAG');
  expect(metaRight({ ...base, ci: { testsRunInCi: true, tests: 483 } })).toBe('CI ✓ · 483 TESTS');
});

it('formats ISO dates as MON YYYY', () => {
  expect(formatMonthYear('2026-10-06')).toBe('OCT 2026');
  expect(formatMonthYear('2026-09-02')).toBe('SEP 2026');
});
```

- [ ] **Step 3: Run them to verify they fail**

Run: `npm test`
Expected: FAIL, modules `@/content/...` not found.

- [ ] **Step 4: Write the data**

`frontend/src/content/site.ts`:

```ts
export const SITE_URL = 'https://personal-website-bogdusik.vercel.app';
```

`frontend/src/content/profile.ts`:

```ts
import type { Profile } from './types';

export const profile: Profile = {
  name: 'Bohdan Bozhenko',
  role: 'Backend / AI Engineer',
  stackLine: 'Python / FastAPI · Spring Boot · PostgreSQL',
  status: 'AVAILABLE — IMMEDIATE START',
  email: 'bogdyn6@gmail.com',
  github: 'https://github.com/Bogdusik',
  linkedin: 'https://www.linkedin.com/in/bohdan-bozhenko/',
  cvPath: '/cv.pdf',
  cvDownloadName: 'Bohdan_Bozhenko_CV.pdf',
  location: 'DUMFRIES → GLASGOW / EDINBURGH · OFFICE OR HYBRID',
  rightToWork: 'UK — NO SPONSORSHIP NEEDED',
  spec: [
    { label: 'TYPE', value: 'BACKEND / AI ENGINEER' },
    { label: 'STACK', value: 'PYTHON / FASTAPI · SPRING BOOT · POSTGRESQL' },
    { label: 'AI', value: 'CLAUDE API · OPENAI · OLLAMA' },
    { label: 'EDUCATION', value: 'BSC (HONS) COMPUTING, FIRST CLASS — GCU 2026', mobile: true },
    { label: 'LOCATION', value: 'DUMFRIES → GLASGOW / EDINBURGH · OFFICE OR HYBRID', mobile: true },
    { label: 'RIGHT TO WORK', value: 'UK — NO SPONSORSHIP NEEDED' },
  ],
};
```

`frontend/src/content/projects.ts`:

```ts
import type { Project } from './types';

export const projects: Project[] = [
  {
    id: 'searchwork',
    code: 'P-01',
    title: 'SearchWork',
    tag: 'LIVE',
    summary:
      'Job tracker for UK graduate roles: 11 job-board APIs (Adzuna, Reed…), Claude-powered CV parsing and match scoring. JWT + Google OAuth, rate limiting, 12 security-audit findings fixed.',
    stack: ['FASTAPI', 'POSTGRESQL', 'CLAUDE API', 'NEXT.JS'],
    links: {
      repo: 'https://github.com/Bogdusik/SearchWork',
      live: 'https://searchwork-bogdusik.vercel.app',
      article: 'https://hackernoon.com/i-built-an-ai-job-tracker-while-job-hunting-the-ai-was-the-easy-part',
    },
    placement: 'featured',
  },
  {
    id: 'ai-office',
    code: 'P-02',
    title: 'AI Office',
    tag: 'LOCAL LLM',
    summary:
      'Local 3D office where AI agents run tasks in stages (plan → research → draft → self-check) on Ollama, with a review queue.',
    stack: ['FASTAPI', 'POSTGRESQL', 'OLLAMA', 'NEXT.JS'],
    ci: {
      testsRunInCi: true,
      tests: 483,
      link: { text: 'SECURITY AUDIT', href: 'https://github.com/Bogdusik/AI-Office/blob/main/docs/security-audit.md' },
    },
    links: {
      repo: 'https://github.com/Bogdusik/AI-Office',
      demo: 'https://github.com/Bogdusik/AI-Office/blob/main/docs/screenshots/01-hero.gif',
    },
    placement: 'featured',
  },
  {
    id: 'programming-helper-ai',
    code: 'P-03',
    title: 'Programming Helper AI',
    tag: 'HONOURS · FIRST CLASS',
    summary: 'AI tutor that explains code in real time, with guided tasks and progress tracking.',
    stack: ['NEXT.JS', 'tRPC', 'PRISMA / POSTGRESQL', 'OPENAI'],
    links: {
      repo: 'https://github.com/Bogdusik/Programming-Helper-AI',
      live: 'https://programming-helper-ai.vercel.app',
    },
    placement: 'featured',
  },
  {
    id: 'ai-qa-assistant',
    code: 'P-04',
    title: 'AI QA Assistant',
    tag: 'AI · HUMAN REVIEW',
    summary:
      'Turns requirements into test cases, checklists, bug-report drafts and API test ideas, with human review before export.',
    stack: ['NEXT.JS 15', 'PRISMA / POSTGRESQL', 'NEXTAUTH', 'OPENAI', 'ZOD'],
    hardPart:
      'Model output is validated against Zod schemas and normalised before it is saved; a response that fails validation is retried once. Items go PENDING → ACCEPTED / REJECTED, and exports include accepted items only.',
    ci: { testsRunInCi: true, tests: 49 },
    links: {
      repo: 'https://github.com/Bogdusik/AI-QA-Assistant',
      live: 'https://ai-qa-assistant-lyart.vercel.app',
    },
    placement: 'projects',
  },
  {
    id: 'realtime-chat',
    code: 'P-05',
    title: 'Real-time Chat',
    tag: 'SPRING BOOT',
    summary: 'Group chat over STOMP/WebSocket with a SockJS fallback; message history in PostgreSQL.',
    stack: ['JAVA 17', 'SPRING BOOT 3.4', 'SPRING DATA JPA', 'POSTGRESQL', 'REACT'],
    hardPart:
      'Persist, then broadcast: a message is saved in its own transaction and only the saved row goes out. Each session’s frames are handled in arrival order, which the STOMP integration test on Testcontainers only passed reliably after that fix.',
    ci: { testsRunInCi: true, tests: 23, note: 'TESTCONTAINERS' },
    links: { repo: 'https://github.com/Bogdusik/Real-Time-Chat-Application' },
    placement: 'projects',
  },
  {
    id: 'checkers',
    code: 'P-06',
    title: 'Checkers',
    tag: 'REAL-TIME',
    summary: 'Online multiplayer checkers with matchmaking, ELO rating and in-game chat.',
    stack: ['NEXT.JS 14', 'PRISMA / POSTGRESQL', 'JWT', 'SSE', 'ZOD'],
    hardPart:
      'Server-authoritative moves: the server rebuilds the board from FEN, checks turn and piece ownership and applies the rules engine before saving. Players get updates over SSE; a finished game updates both ELO ratings in one transaction.',
    ci: { testsRunInCi: true, tests: 14 },
    links: { repo: 'https://github.com/Bogdusik/Checkers' },
    placement: 'projects',
  },
  {
    id: 'flyon',
    code: 'P-07',
    title: 'FLYON',
    tag: 'GEOSPATIAL · REAL-TIME',
    summary:
      'Flight analytics for drone and FPV owners: live telemetry over WebSocket, danger-zone warnings, post-flight analysis.',
    stack: ['NODE.JS / EXPRESS (TS)', 'POSTGRESQL + POSTGIS', 'WEBSOCKET', 'NEXT.JS'],
    hardPart:
      'Live ingest got slower as a flight grew: every telemetry point re-aggregated the whole flight, about 40.5M ST_Distance calls for a 9,000-point flight, and indexes could not help. I replaced it with an incremental accumulator and a per-flight write queue: 152.8 s → 50.1 s for the same flight.',
    links: {
      repo: 'https://github.com/Bogdusik/FLYON',
      article: 'https://hackernoon.com/i-added-every-index-but-my-telemetry-pipeline-was-still-quadratic',
    },
    placement: 'projects',
  },
];

export const featuredProjects = projects.filter((p) => p.placement === 'featured');
export const otherProjects = projects.filter((p) => p.placement === 'projects');
```

`frontend/src/content/writing.ts`:

```ts
import type { Article } from './types';

export const articles: Article[] = [
  {
    title: 'I Added Every Index, but My Telemetry Pipeline Was Still Quadratic',
    url: 'https://hackernoon.com/i-added-every-index-but-my-telemetry-pipeline-was-still-quadratic',
    publication: 'HackerNoon',
    published: '2026-10-06',
    topStory: true,
    projectId: 'flyon',
  },
  {
    title: 'I Built an AI Job Tracker While Job Hunting: The AI Was the Easy Part',
    url: 'https://hackernoon.com/i-built-an-ai-job-tracker-while-job-hunting-the-ai-was-the-easy-part',
    publication: 'HackerNoon',
    published: '2026-09-02',
    projectId: 'searchwork',
  },
];
```

`frontend/src/content/about.ts`:

```ts
import type { About } from './types';

export const about: About = {
  bio: [
    'I’m a backend and AI engineer in Dumfries, Scotland. I build APIs and LLM-powered features in Python and Java, and I treat security as part of the job, a habit from my Cyber Security HNC.',
    'I graduated from Glasgow Caledonian University with First Class Honours in 2026 and I’m looking for my first engineering role in Glasgow or Edinburgh, office or hybrid.',
  ],
  experience: [
    {
      dates: 'DEC 2024 — JUN 2025',
      org: 'The Devil’s Porridge Museum',
      text: 'Volunteer. Maintained the museum’s WordPress website and digital outreach. Event enquiries reached more than double the initial target, with 50+ extra participants.',
    },
  ],
  education: [
    { years: '2023 — 2026', school: 'Glasgow Caledonian University', award: 'BSc (Hons) Computing', highlight: 'First Class' },
    { years: '2022 — 2023', school: 'Dumfries and Galloway College', award: 'HNC Cyber Security' },
    { years: '— 2023', school: 'National Aerospace University “KhAI”', award: 'Junior Bachelor’s, Software Engineering' },
  ],
  certificate: 'CISCO NETWORKING ACADEMY — NETWORKING ESSENTIALS (2023)',
  tools: [
    { group: 'BACKEND', items: ['PYTHON', 'FASTAPI', 'SQLALCHEMY 2 (ASYNC)', 'PYDANTIC V2', 'JAVA', 'SPRING BOOT', 'NODE.JS'] },
    { group: 'DATA', items: ['POSTGRESQL', 'POSTGIS', 'ALEMBIC', 'PRISMA', 'MONGODB', 'MYSQL'] },
    { group: 'AI / LLM', items: ['CLAUDE API', 'OPENAI API', 'OLLAMA', 'FASTER WHISPER'] },
    { group: 'FRONTEND', items: ['NEXT.JS', 'REACT', 'TYPESCRIPT', 'TAILWIND CSS'] },
    { group: 'DELIVERY', items: ['DOCKER', 'GITHUB ACTIONS', 'JENKINS', 'AWS', 'VERCEL', 'RAILWAY'] },
    { group: 'SECURITY', items: ['JWT + OAUTH', 'RATE LIMITING', 'SSRF GUARDS', 'SECURITY AUDITS'] },
  ],
};
```

`frontend/src/content/diagram.ts`:

```ts
import type { Diagram } from './types';

export const diagram: Diagram = {
  caption: 'FIG. 01 — SEARCHWORK / SYSTEM ELEVATION',
  description:
    'SearchWork system diagram: the Next.js client calls the FastAPI service with JWT and Google OAuth; FastAPI applies rate limiting, stores data in PostgreSQL, uses the Claude API for CV parsing, match scoring and cover letters, and ingests 11 job-board APIs.',
  nodes: [
    { id: 'client', title: 'NEXT.JS', lines: ['CLIENT'] },
    { id: 'api', title: 'FASTAPI', lines: ['ASYNC SERVICE', 'RATE LIMITING', '(SLOWAPI)'], accent: true },
    { id: 'db', title: 'POSTGRESQL', lines: ['STORE'] },
    { id: 'claude', title: 'CLAUDE API', lines: ['CV PARSING · MATCH SCORING · COVER LETTERS'] },
    { id: 'jobs', title: '11 JOB-BOARD APIS', lines: ['ADZUNA · REED · …'] },
  ],
  edges: [
    { id: 'eauth', label: 'JWT + GOOGLE OAUTH', mobile: 'down', desktop: 'right' },
    { id: 'eorm', label: 'ASYNC ORM', mobile: 'down', desktop: 'right' },
    { id: 'ellm', label: 'LLM', mobile: 'right', desktop: 'up' },
    { id: 'eingest', label: 'INGEST', mobile: 'left', desktop: 'up' },
  ],
};
```

`frontend/src/content/format.ts`:

```ts
import type { CiBadge, Project } from './types';

const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

export function formatCi(ci: CiBadge): string {
  return `CI ✓ · ${ci.tests} TESTS${ci.note ? ` · ${ci.note}` : ''}`;
}

export function metaRight(p: Project): string {
  return p.ci ? formatCi(p.ci) : p.tag;
}

export function formatMonthYear(iso: string): string {
  const [year, month] = iso.split('-');
  return `${MONTHS[Number(month) - 1]} ${year}`;
}
```

`frontend/src/content/links.ts`:

```ts
import { profile } from './profile';
import { projects } from './projects';
import { articles } from './writing';

export function externalLinks(): string[] {
  const all = [
    profile.github,
    profile.linkedin,
    ...projects.flatMap((p) => [...Object.values(p.links), p.ci?.link?.href]),
    ...articles.map((a) => a.url),
  ];
  return [...new Set(all.filter((l): l is string => Boolean(l)))];
}
```

- [ ] **Step 5: Run the tests**

Run: `npm test`
Expected: PASS (content and format suites, plus the home test).

- [ ] **Step 6: Commit**

```bash
git add frontend/src/content frontend/tests/unit
git commit -m "feat(content): typed site content with integrity tests"
```

### Task 3: Theme, layout shell and primitives

**Files:**
- Create: `frontend/scripts/make-grain.ts`, `frontend/public/grain.png` (generated), `frontend/src/components/ui/ButtonLink.tsx`, `frontend/src/components/ui/SkipLink.tsx`, `frontend/src/components/ui/Dot.tsx`, `frontend/src/components/ui/MetaLine.tsx`, `frontend/src/components/ui/ProjectLinks.tsx`, `frontend/src/components/ui/Sheet.tsx`
- Modify: `frontend/src/app/globals.css`, `frontend/src/app/layout.tsx`
- Test: `frontend/tests/unit/ui.test.tsx`, `frontend/tests/unit/grain.test.ts`

**Interfaces:**
- Consumes: `profile`, `ProjectLinks` type (Task 2).
- Produces: `ButtonLink({ href, children, variant?: 'solid' | 'outline', download?: string, className?: string })`; `SkipLink()`; `Dot({ className? })`; `MetaLine({ code: string, right: string, link?: { text: string; href: string } })`; `ProjectLinks({ title: string, links: ProjectLinks, className?: string })`; `Sheet({ id, labelledBy?, className?, children })`; Tailwind tokens `bg-paper text-ink text-ink-2 text-ink-3 text-muted border-rule text-accent bg-accent font-mono` and the `label-mono` utility.

- [ ] **Step 1: Write the failing tests**

`frontend/tests/unit/ui.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { MetaLine } from '@/components/ui/MetaLine';
import { ProjectLinks } from '@/components/ui/ProjectLinks';
import { SkipLink } from '@/components/ui/SkipLink';

describe('SkipLink', () => {
  it('targets #main', () => {
    render(<SkipLink />);
    expect(screen.getByRole('link', { name: 'Skip to content' })).toHaveAttribute('href', '#main');
  });
});

describe('ButtonLink', () => {
  it('passes href and download through', () => {
    render(<ButtonLink href="/cv.pdf" download="Bohdan_Bozhenko_CV.pdf" variant="solid">DOWNLOAD CV</ButtonLink>);
    const link = screen.getByRole('link', { name: 'DOWNLOAD CV' });
    expect(link).toHaveAttribute('href', '/cv.pdf');
    expect(link).toHaveAttribute('download', 'Bohdan_Bozhenko_CV.pdf');
  });
});

describe('MetaLine', () => {
  it('shows the code and the right-hand label', () => {
    render(<MetaLine code="P-04" right="CI ✓ · 49 TESTS" />);
    expect(screen.getByText('P-04')).toBeInTheDocument();
    expect(screen.getByText('CI ✓ · 49 TESTS')).toBeInTheDocument();
    expect(screen.queryByRole('link')).toBeNull();
  });

  it('appends an optional link after the label', () => {
    render(<MetaLine code="P-02" right="CI ✓ · 483 TESTS" link={{ text: 'SECURITY AUDIT', href: 'https://example.com/audit' }} />);
    expect(screen.getByText('CI ✓ · 483 TESTS')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /SECURITY AUDIT/ })).toHaveAttribute('href', 'https://example.com/audit');
  });
});

describe('ProjectLinks', () => {
  it('renders only the links that exist, each named with the project', () => {
    render(<ProjectLinks title="SearchWork" links={{ repo: 'https://github.com/Bogdusik/SearchWork', live: 'https://searchwork-bogdusik.vercel.app' }} />);
    expect(screen.getByRole('link', { name: /REPO.*SearchWork/ })).toHaveAttribute('href', 'https://github.com/Bogdusik/SearchWork');
    expect(screen.getByRole('link', { name: /LIVE.*SearchWork/ })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /DEMO/ })).toBeNull();
    expect(screen.queryByRole('link', { name: /ARTICLE/ })).toBeNull();
  });
});
```

`frontend/tests/unit/grain.test.ts`:

```ts
import { readFileSync } from 'node:fs';
import { expect, it } from 'vitest';

it('ships a grain tile that is a PNG under 8 KB', () => {
  const png = readFileSync(new URL('../../public/grain.png', import.meta.url));
  expect(png.subarray(0, 8)).toEqual(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
  expect(png.length).toBeLessThan(8 * 1024);
});
```

- [ ] **Step 2: Run them to verify they fail**

Run: `npm test`
Expected: FAIL, components and `public/grain.png` missing.

- [ ] **Step 3: Generate the grain tile**

`frontend/scripts/make-grain.ts` (run with Node 24's built-in type stripping):

```ts
import { writeFileSync } from 'node:fs';
import { crc32, deflateSync } from 'node:zlib';

const SIZE = 128;
const ALPHA = 36; // about 14% opacity

function chunk(type: string, data: Buffer): Buffer {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length);
  const typeAndData = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(typeAndData));
  return Buffer.concat([length, typeAndData, crc]);
}

let seed = 20261015;
const rand = () => (seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff;

const stride = SIZE * 2 + 1; // grey + alpha per pixel, one filter byte per row
const raw = Buffer.alloc(stride * SIZE);
for (let y = 0; y < SIZE; y++) {
  raw[y * stride] = 0;
  for (let x = 0; x < SIZE; x++) {
    raw[y * stride + 1 + x * 2] = Math.floor(rand() * 4) * 85;
    raw[y * stride + 2 + x * 2] = ALPHA;
  }
}

const ihdr = Buffer.alloc(13);
ihdr.writeUInt32BE(SIZE, 0);
ihdr.writeUInt32BE(SIZE, 4);
ihdr[8] = 8; // bit depth
ihdr[9] = 4; // greyscale with alpha

const png = Buffer.concat([
  Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
  chunk('IHDR', ihdr),
  chunk('IDAT', deflateSync(raw, { level: 9 })),
  chunk('IEND', Buffer.alloc(0)),
]);
writeFileSync(new URL('../public/grain.png', import.meta.url), png);
console.log(`grain.png: ${png.length} bytes`);
```

Run: `node scripts/make-grain.ts`
Expected: prints a size below 8192 bytes.

- [ ] **Step 4: Write the theme**

`frontend/src/app/globals.css` (replace the file):

```css
@import "tailwindcss";

@theme {
  --color-paper: #f1efe8;
  --color-ink: #191917;
  --color-ink-2: #3e3c38;
  --color-ink-3: #4a4843;
  --color-muted: #5e5c55;
  --color-rule: #bdb9ae;
  --color-accent: #2438d8;
}

@theme inline {
  --font-sans: var(--font-schibsted), ui-sans-serif, system-ui, sans-serif;
  --font-mono: var(--font-plex-mono), ui-monospace, monospace;
}

@utility label-mono {
  font-family: var(--font-mono);
  font-size: 11px;
  line-height: 1.5;
  letter-spacing: 0.06em;
}

@layer base {
  body {
    background-color: var(--color-paper);
    background-image: url("/grain.png");
    background-repeat: repeat;
    background-blend-mode: multiply;
    color: var(--color-ink);
    font-family: var(--font-sans);
  }

  :focus-visible {
    outline: 2px solid var(--color-accent);
    outline-offset: 2px;
  }
}
```

- [ ] **Step 5: Write the primitives**

`frontend/src/components/ui/SkipLink.tsx`:

```tsx
export function SkipLink() {
  return (
    <a
      href="#main"
      className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:bg-accent focus:px-4 focus:py-3 focus:text-paper"
    >
      Skip to content
    </a>
  );
}
```

`frontend/src/components/ui/ButtonLink.tsx`:

```tsx
import type { ReactNode } from 'react';

type Props = {
  href: string;
  children: ReactNode;
  variant?: 'solid' | 'outline';
  download?: string;
  className?: string;
};

export function ButtonLink({ href, children, variant = 'outline', download, className = '' }: Props) {
  const look =
    variant === 'solid'
      ? 'border-accent bg-accent text-paper hover:border-ink hover:bg-ink'
      : 'border-ink text-ink hover:bg-ink hover:text-paper';
  return (
    <a
      href={href}
      download={download}
      className={`inline-flex min-h-12 items-center justify-center border px-5.5 font-mono text-[13px] font-medium tracking-[0.06em] ${look} ${className}`}
    >
      {children}
    </a>
  );
}
```

`frontend/src/components/ui/Dot.tsx`:

```tsx
export function Dot({ className = '' }: { className?: string }) {
  return <span aria-hidden="true" className={`inline-block size-2 shrink-0 rounded-full bg-accent ${className}`} />;
}
```

`frontend/src/components/ui/MetaLine.tsx`:

```tsx
type MetaLink = { text: string; href: string };

export function MetaLine({ code, right, link }: { code: string; right: string; link?: MetaLink }) {
  return (
    <p className="flex justify-between gap-3 label-mono text-muted">
      <span className="text-accent">{code}</span>
      <span className="text-right">
        <span>{right}</span>
        {link && (
          <>
            {' · '}
            <a href={link.href} className="text-accent hover:underline">
              {link.text}
              <span aria-hidden="true">&nbsp;↗</span>
            </a>
          </>
        )}
      </span>
    </p>
  );
}
```

`frontend/src/components/ui/ProjectLinks.tsx`:

```tsx
import type { ProjectLinks as Links } from '@/content/types';

const ITEMS = [
  { key: 'repo', text: 'REPO' },
  { key: 'live', text: 'LIVE' },
  { key: 'demo', text: 'DEMO GIF' },
  { key: 'article', text: 'ARTICLE' },
] as const;

export function ProjectLinks({ title, links, className = '' }: { title: string; links: Links; className?: string }) {
  return (
    <ul className={`flex flex-wrap gap-x-5 label-mono font-medium text-accent ${className}`}>
      {ITEMS.filter((item) => links[item.key]).map((item) => (
        <li key={item.key}>
          <a href={links[item.key]} className="inline-flex min-h-11 items-center hover:underline">
            {item.text}
            <span aria-hidden="true">&nbsp;↗</span>
            <span className="sr-only"> — {title}</span>
          </a>
        </li>
      ))}
    </ul>
  );
}
```

`frontend/src/components/ui/Sheet.tsx`:

```tsx
import type { ReactNode } from 'react';

type Props = { id: string; labelledBy?: string; className?: string; children: ReactNode };

export function Sheet({ id, labelledBy, className = '', children }: Props) {
  return (
    <section id={id} aria-labelledby={labelledBy} className={`mx-2 mb-2 border border-rule ${className}`}>
      {children}
    </section>
  );
}
```

- [ ] **Step 6: Write the layout**

`frontend/src/app/layout.tsx` (replace the file):

```tsx
import type { Metadata } from 'next';
import { IBM_Plex_Mono, Schibsted_Grotesk } from 'next/font/google';
import type { ReactNode } from 'react';
import { SkipLink } from '@/components/ui/SkipLink';
import './globals.css';

const sans = Schibsted_Grotesk({ subsets: ['latin'], weight: ['400', '500', '600'], variable: '--font-schibsted', display: 'swap' });
const mono = IBM_Plex_Mono({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-plex-mono', display: 'swap' });

export const metadata: Metadata = {
  title: 'Bohdan Bozhenko — Backend / AI Engineer',
  description:
    'Backend / AI engineer in Scotland. Python / FastAPI, Spring Boot, PostgreSQL and LLM-powered products. First Class BSc Computing, available immediately.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en-GB" className={`${sans.variable} ${mono.variable}`}>
      <body className="min-w-80 antialiased">
        <SkipLink />
        {children}
      </body>
    </html>
  );
}
```

- [ ] **Step 7: Run the tests and the build**

Run: `npm test && npm run build`
Expected: PASS; the build succeeds.

- [ ] **Step 8: Commit**

```bash
git add frontend
git commit -m "feat(ui): Blueprint theme, fonts, grain tile and primitives"
```

### Task 4: Project cards

**Files:**
- Create: `frontend/src/components/projects/FeaturedCard.tsx`, `FeaturedRow.tsx`, `DetailedCard.tsx`
- Test: `frontend/tests/unit/cards.test.tsx`

**Interfaces:**
- Consumes: `Project`, `metaRight` (Task 2); `MetaLine`, `ProjectLinks` (Task 3).
- Produces: `FeaturedCard({ project })` (desktop card, `<article id={project.id}>`), `FeaturedRow({ project })` (mobile `<details>`), `DetailedCard({ project })` (sheet 02 card, `<article id={project.id}>`).

- [ ] **Step 1: Write the failing tests**

`frontend/tests/unit/cards.test.tsx`:

```tsx
import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { DetailedCard } from '@/components/projects/DetailedCard';
import { FeaturedCard } from '@/components/projects/FeaturedCard';
import { FeaturedRow } from '@/components/projects/FeaturedRow';
import { projects } from '@/content/projects';

const byId = (id: string) => projects.find((p) => p.id === id)!;

describe('FeaturedCard', () => {
  it('shows LIVE and ARTICLE for SearchWork but no DEMO', () => {
    render(<FeaturedCard project={byId('searchwork')} />);
    const card = screen.getByRole('article');
    expect(within(card).getByRole('heading', { level: 3, name: 'SearchWork' })).toBeInTheDocument();
    expect(within(card).getByRole('link', { name: /LIVE/ })).toBeInTheDocument();
    expect(within(card).getByRole('link', { name: /ARTICLE/ })).toBeInTheDocument();
    expect(within(card).queryByRole('link', { name: /DEMO/ })).toBeNull();
  });

  it('shows the CI badge with the audit link and DEMO GIF for AI Office, no LIVE', () => {
    render(<FeaturedCard project={byId('ai-office')} />);
    expect(screen.getByText('CI ✓ · 483 TESTS')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /SECURITY AUDIT/ })).toHaveAttribute(
      'href',
      'https://github.com/Bogdusik/AI-Office/blob/main/docs/security-audit.md',
    );
    expect(screen.getByRole('link', { name: /DEMO GIF/ })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /LIVE/ })).toBeNull();
  });
});

describe('FeaturedRow', () => {
  it('is a closed native disclosure: title in the summary, details and links in the body', () => {
    const { container } = render(<FeaturedRow project={byId('programming-helper-ai')} />);
    const details = container.querySelector('details')!;
    expect(details.open).toBe(false);
    expect(details.querySelector('summary')?.textContent).toContain('Programming Helper AI');
    const body = details.querySelector('summary + div') as HTMLElement;
    expect(within(body).getByText(/AI tutor that explains code/)).toBeInTheDocument();
    expect(within(body).getByText('HONOURS · FIRST CLASS')).toBeInTheDocument();
    expect(within(body).getByText('REPO')).toBeInTheDocument();
  });
});

describe('DetailedCard', () => {
  it('shows the hard part, the CI badge with its note, and repo only', () => {
    render(<DetailedCard project={byId('realtime-chat')} />);
    expect(screen.getByText('HARD PART')).toBeInTheDocument();
    expect(screen.getByText(/Persist, then broadcast/)).toBeInTheDocument();
    expect(screen.getByText('CI ✓ · 23 TESTS · TESTCONTAINERS')).toBeInTheDocument();
    expect(screen.getAllByRole('link')).toHaveLength(1);
  });

  it('shows the tag when a project has no CI badge', () => {
    render(<DetailedCard project={byId('flyon')} />);
    expect(screen.getByText('GEOSPATIAL · REAL-TIME')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /ARTICLE/ })).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run them to verify they fail**

Run: `npm test -- cards`
Expected: FAIL, modules not found.

- [ ] **Step 3: Write the cards**

`frontend/src/components/projects/FeaturedCard.tsx`:

```tsx
import { MetaLine } from '@/components/ui/MetaLine';
import { ProjectLinks } from '@/components/ui/ProjectLinks';
import { metaRight } from '@/content/format';
import type { Project } from '@/content/types';

export function FeaturedCard({ project }: { project: Project }) {
  return (
    <article id={project.id} className="flex h-full min-w-0 flex-col px-7 py-6">
      <MetaLine code={project.code} right={metaRight(project)} link={project.ci?.link} />
      <h3 className="mt-3.5 text-[26px] font-semibold tracking-[-0.02em]">{project.title}</h3>
      <p className="mt-2 text-sm leading-normal text-ink-3">{project.summary}</p>
      <p className="mt-auto pt-2.5 label-mono tracking-[0.04em] break-words">{project.stack.join(' · ')}</p>
      <ProjectLinks title={project.title} links={project.links} className="mt-1" />
    </article>
  );
}
```

`frontend/src/components/projects/FeaturedRow.tsx`:

```tsx
import { ProjectLinks } from '@/components/ui/ProjectLinks';
import { metaRight } from '@/content/format';
import type { Project } from '@/content/types';

export function FeaturedRow({ project }: { project: Project }) {
  return (
    <details className="group border-b border-rule">
      <summary className="grid min-h-16 cursor-pointer list-none grid-cols-[44px_minmax(0,1fr)_16px] items-center px-3.5 py-3 [&::-webkit-details-marker]:hidden">
        <span className="label-mono text-[10.5px] text-accent">{project.code}</span>
        <span className="min-w-0">
          <span className="block text-lg font-semibold tracking-[-0.01em]">{project.title}</span>
          <span className="mt-0.5 block font-mono text-[10px] tracking-[0.04em] break-words text-muted">
            {project.stack.join(' · ')}
          </span>
        </span>
        <span aria-hidden="true" className="text-accent group-open:rotate-90">→</span>
      </summary>
      <div className="pr-3.5 pb-4 pl-[58px]">
        <p className="label-mono text-[10.5px] text-muted">
          {metaRight(project)}
          {project.ci?.link && (
            <>
              {' · '}
              <a href={project.ci.link.href} className="text-accent hover:underline">
                {project.ci.link.text}
                <span aria-hidden="true">&nbsp;↗</span>
              </a>
            </>
          )}
        </p>
        <p className="mt-1.5 text-[15px] leading-normal text-ink-3">{project.summary}</p>
        <ProjectLinks title={project.title} links={project.links} className="mt-1" />
      </div>
    </details>
  );
}
```

`frontend/src/components/projects/DetailedCard.tsx`:

```tsx
import { MetaLine } from '@/components/ui/MetaLine';
import { ProjectLinks } from '@/components/ui/ProjectLinks';
import { metaRight } from '@/content/format';
import type { Project } from '@/content/types';

export function DetailedCard({ project }: { project: Project }) {
  return (
    <article id={project.id} className="flex h-full min-w-0 flex-col px-4 py-6 lg:px-10 lg:py-8">
      <MetaLine code={project.code} right={metaRight(project)} link={project.ci?.link} />
      <h3 className="mt-2.5 text-2xl font-semibold tracking-[-0.025em] lg:mt-3.5 lg:text-[32px]">{project.title}</h3>
      <p className="mt-2 text-[15px] leading-normal text-ink-2 lg:text-base">{project.summary}</p>
      <p className="mt-3 label-mono tracking-[0.04em] break-words">{project.stack.join(' · ')}</p>
      {project.hardPart && (
        <div className="mt-4 grid gap-1.5 border-t border-dashed border-rule pt-3.5 lg:grid-cols-[96px_minmax(0,1fr)] lg:gap-3">
          <p className="label-mono text-accent">HARD PART</p>
          <p className="text-sm leading-[1.55] text-ink-3 lg:text-[14.5px]">{project.hardPart}</p>
        </div>
      )}
      <ProjectLinks title={project.title} links={project.links} className="mt-auto pt-3" />
    </article>
  );
}
```

- [ ] **Step 4: Run the tests**

Run: `npm test -- cards`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add frontend/src/components/projects frontend/tests/unit/cards.test.tsx
git commit -m "feat(projects): featured card, mobile disclosure row and detailed card"
```

### Task 5: Site header and mobile menu

**Files:**
- Create: `frontend/src/components/header/MobileMenu.tsx`, `frontend/src/components/header/SiteHeader.tsx`
- Test: `frontend/tests/unit/header.test.tsx`

**Interfaces:**
- Consumes: `profile` (Task 2); `Dot` (Task 3).
- Produces: `type MenuLink = { href: string; label: string; download?: string }`; `MobileMenu({ links: MenuLink[] })` (Client Component); `SiteHeader()`.

- [ ] **Step 1: Write the failing tests**

`frontend/tests/unit/header.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { MobileMenu } from '@/components/header/MobileMenu';
import { SiteHeader } from '@/components/header/SiteHeader';

const links = [
  { href: '#projects', label: '02 Projects' },
  { href: '#contact', label: '04 Contact' },
];

describe('MobileMenu', () => {
  it('starts closed and toggles aria-expanded', async () => {
    const user = userEvent.setup();
    render(<MobileMenu links={links} />);
    const button = screen.getByRole('button', { name: /menu/i });
    expect(button).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('link', { name: '02 Projects' })).toBeNull();
    await user.click(button);
    expect(button).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('link', { name: '02 Projects' })).toBeVisible();
  });

  it('closes on Escape and returns focus to the button', async () => {
    const user = userEvent.setup();
    render(<MobileMenu links={links} />);
    const button = screen.getByRole('button', { name: /menu/i });
    await user.click(button);
    await user.tab();
    expect(screen.getByRole('link', { name: '02 Projects' })).toHaveFocus();
    await user.keyboard('{Escape}');
    expect(button).toHaveAttribute('aria-expanded', 'false');
    expect(button).toHaveFocus();
  });

  it('closes when a link is chosen and on an outside click', async () => {
    const user = userEvent.setup();
    render(<div><MobileMenu links={links} /><p>outside</p></div>);
    const button = screen.getByRole('button', { name: /menu/i });
    await user.click(button);
    await user.click(screen.getByRole('link', { name: '04 Contact' }));
    expect(button).toHaveAttribute('aria-expanded', 'false');
    await user.click(button);
    await user.click(screen.getByText('outside'));
    expect(button).toHaveAttribute('aria-expanded', 'false');
  });
});

describe('SiteHeader', () => {
  it('shows the status and a contact link', () => {
    render(<SiteHeader />);
    expect(screen.getAllByText('AVAILABLE — IMMEDIATE START').length).toBeGreaterThan(0);
    expect(screen.getByRole('link', { name: /CONTACT/ })).toHaveAttribute('href', '#contact');
  });
});
```

- [ ] **Step 2: Run them to verify they fail**

Run: `npm test -- header`
Expected: FAIL, modules not found.

- [ ] **Step 3: Write the menu**

`frontend/src/components/header/MobileMenu.tsx`:

```tsx
'use client';

import { useEffect, useId, useRef, useState } from 'react';

export type MenuLink = { href: string; label: string; download?: string };

export function MobileMenu({ links }: { links: MenuLink[] }) {
  const [open, setOpen] = useState(false);
  const navId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setOpen(false);
      buttonRef.current?.focus();
    };
    const onPointer = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onPointer);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onPointer);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative h-full">
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={navId}
        onClick={() => setOpen((value) => !value)}
        className="flex h-full w-full items-center justify-center gap-2 label-mono font-medium text-accent"
      >
        MENU
        <svg aria-hidden="true" width="16" height="10" viewBox="0 0 16 10" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M0 1h16M0 9h16" />
        </svg>
      </button>
      <nav id={navId} hidden={!open} aria-label="Site" className="absolute top-full right-0 z-40 w-64 border border-rule bg-paper">
        <ul>
          {links.map((link) => (
            <li key={link.href} className="border-b border-rule last:border-b-0">
              <a
                href={link.href}
                download={link.download}
                onClick={() => setOpen(false)}
                className="flex min-h-12 items-center px-4 label-mono font-medium hover:text-accent"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
```

- [ ] **Step 4: Write the header**

`frontend/src/components/header/SiteHeader.tsx`:

```tsx
import { Dot } from '@/components/ui/Dot';
import { profile } from '@/content/profile';
import { MobileMenu, type MenuLink } from './MobileMenu';

const menuLinks: MenuLink[] = [
  { href: '#projects', label: '02 PROJECTS' },
  { href: '#about', label: '03 ABOUT' },
  { href: '#contact', label: '04 CONTACT' },
  { href: profile.cvPath, label: 'DOWNLOAD CV', download: profile.cvDownloadName },
  { href: profile.github, label: 'GITHUB' },
  { href: profile.linkedin, label: 'LINKEDIN' },
];

export function SiteHeader() {
  return (
    <header>
      <div className="grid h-12 grid-cols-[minmax(0,1fr)_96px] border-b border-rule lg:h-14 lg:grid-cols-[minmax(0,1fr)_220px_320px_160px]">
        <a href="#index" className="flex items-center px-3.5 label-mono font-medium lg:px-6">
          <span className="lg:hidden">B. BOZHENKO — SHEET 01</span>
          <span className="hidden lg:inline">BOHDAN BOZHENKO — PORTFOLIO</span>
        </a>
        <p className="hidden items-center border-l border-rule px-5 label-mono text-muted lg:flex">SHEET 01 / 04 — INDEX</p>
        <p className="hidden items-center gap-2.5 border-l border-rule px-5 label-mono font-medium lg:flex">
          <Dot />
          {profile.status}
        </p>
        <a href="#contact" className="hidden items-center justify-between border-l border-rule px-5 label-mono font-medium text-accent lg:flex">
          CONTACT <span aria-hidden="true">→</span>
        </a>
        <div className="border-l border-rule lg:hidden">
          <MobileMenu links={menuLinks} />
        </div>
      </div>
      <p className="flex h-8.5 items-center gap-2.5 border-b border-rule px-3.5 label-mono text-[10.5px] font-medium lg:hidden">
        <Dot className="size-[7px]" />
        {profile.status}
      </p>
    </header>
  );
}
```

- [ ] **Step 5: Run the tests**

Run: `npm test -- header`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add frontend/src/components/header frontend/tests/unit/header.test.tsx
git commit -m "feat(header): site header with an accessible mobile menu"
```

### Task 6: SearchWork system diagram

**Files:**
- Create: `frontend/src/components/diagram/SystemDiagram.tsx`, `frontend/src/components/diagram/SystemDiagram.module.css`
- Test: `frontend/tests/unit/diagram.test.tsx`

**Interfaces:**
- Consumes: `diagram` (Task 2).
- Produces: `SystemDiagram()`, a `<figure role="img">` whose accessible name is `diagram.description`.

- [ ] **Step 1: Write the failing test**

`frontend/tests/unit/diagram.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { SystemDiagram } from '@/components/diagram/SystemDiagram';

it('exposes the flow as one described image', () => {
  render(<SystemDiagram />);
  const figure = screen.getByRole('img', { name: /SearchWork system diagram/ });
  expect(figure.getAttribute('aria-label')).toMatch(/Claude API for CV parsing, match scoring and cover letters/);
});

it('draws every node and edge label', () => {
  const { container } = render(<SystemDiagram />);
  for (const text of ['NEXT.JS', 'FASTAPI', 'POSTGRESQL', 'CLAUDE API', '11 JOB-BOARD APIS', 'JWT + GOOGLE OAUTH', 'ASYNC ORM', 'LLM', 'INGEST']) {
    expect(container.textContent).toContain(text);
  }
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npm test -- diagram`
Expected: FAIL, module not found.

- [ ] **Step 3: Write the styles**

`frontend/src/components/diagram/SystemDiagram.module.css`:

```css
.figure {
  margin: 0;
  padding: 14px 16px 24px;
  background-image:
    linear-gradient(rgb(25 25 23 / 0.06) 1px, transparent 1px),
    linear-gradient(90deg, rgb(25 25 23 / 0.06) 1px, transparent 1px);
  background-size: 24px 24px;
}

.caption {
  display: flex;
  justify-content: space-between;
  gap: 12px;
}

.diagram {
  display: grid;
  margin-top: 20px;
  grid-template-columns: minmax(0, 1fr) 36px minmax(0, 1fr);
  grid-template-rows: auto 72px auto auto 56px auto;
  grid-template-areas:
    "client  .       ."
    "eauth   .       ."
    "api     ellm    claude"
    "api     eingest jobs"
    "eorm    .       ."
    "db      .       .";
  font-family: var(--font-mono);
  font-size: 10.5px;
  letter-spacing: 0.04em;
}

.node {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  min-width: 0;
  padding: 12px 8px;
  border: 1px solid var(--color-ink);
  background: var(--color-paper);
  text-align: center;
  overflow-wrap: anywhere;
}

.node[data-node="claude"] { margin-bottom: 10px; }
.node[data-node="jobs"] { margin-top: 10px; }

.title { font-weight: 500; }
.sub { color: var(--color-muted); font-size: 0.92em; }
.accent { border: 1.5px solid var(--color-accent); color: var(--color-accent); }
.accent .sub { color: inherit; }

.edge {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 0;
  min-height: 0;
}
.line { flex: 1 1 auto; background: var(--color-ink); }
.head { flex: none; width: 8px; height: 8px; background: var(--color-ink); }
.label {
  position: absolute;
  color: var(--color-muted);
  font-size: 0.92em;
  line-height: 1.3;
  white-space: nowrap;
}

.edge[data-m="down"]  { flex-direction: column; }
.edge[data-m="up"]    { flex-direction: column-reverse; }
.edge[data-m="right"] { flex-direction: row; }
.edge[data-m="left"]  { flex-direction: row-reverse; }
.edge[data-m="down"] .line, .edge[data-m="up"] .line { width: 1px; height: auto; }
.edge[data-m="right"] .line, .edge[data-m="left"] .line { height: 1px; width: auto; }
.edge[data-m="down"] .head  { clip-path: polygon(0 0, 100% 0, 50% 100%); }
.edge[data-m="up"] .head    { clip-path: polygon(50% 0, 100% 100%, 0 100%); }
.edge[data-m="right"] .head { clip-path: polygon(0 0, 100% 50%, 0 100%); }
.edge[data-m="left"] .head  { clip-path: polygon(100% 0, 0 50%, 100% 100%); }
.edge[data-m="down"] .label, .edge[data-m="up"] .label {
  left: calc(50% + 10px);
  top: 50%;
  transform: translateY(-50%);
}
.edge[data-m="right"] .label, .edge[data-m="left"] .label { display: none; }

@media (width >= 64rem) {
  .figure { padding: 16px 20px 32px; background-size: 32px 32px; }

  .diagram {
    margin-top: 32px;
    grid-template-columns: minmax(0, 1fr) 92px minmax(0, 1fr) 92px minmax(0, 1fr);
    grid-template-rows: auto 72px auto 70px auto;
    grid-template-areas:
      ".      claude claude  claude ."
      ".      .      ellm    .      ."
      "client eauth  api     eorm   db"
      ".      .      eingest .      ."
      ".      jobs   jobs    jobs   .";
    font-size: 11px;
  }

  .node[data-node="claude"], .node[data-node="jobs"] { margin: 0; }

  .edge[data-d="right"] { flex-direction: row; }
  .edge[data-d="up"]    { flex-direction: column-reverse; }
  .edge[data-d="right"] .line { height: 1px; width: auto; }
  .edge[data-d="up"] .line    { width: 1px; height: auto; }
  .edge[data-d="right"] .head { clip-path: polygon(0 0, 100% 50%, 0 100%); }
  .edge[data-d="up"] .head    { clip-path: polygon(50% 0, 100% 100%, 0 100%); }
  .edge[data-d="right"] .label {
    display: block;
    left: 50%;
    top: auto;
    bottom: calc(50% + 6px);
    transform: translateX(-50%);
    width: max-content;
    max-width: 100%;
    white-space: normal;
    text-align: center;
  }
  .edge[data-d="up"] .label {
    display: block;
    left: calc(50% + 10px);
    top: 50%;
    bottom: auto;
    transform: translateY(-50%);
  }
}
```

- [ ] **Step 4: Write the component**

`frontend/src/components/diagram/SystemDiagram.tsx`:

```tsx
import { diagram } from '@/content/diagram';
import styles from './SystemDiagram.module.css';

export function SystemDiagram() {
  return (
    <figure role="img" aria-label={diagram.description} className={styles.figure}>
      <figcaption className={`${styles.caption} label-mono text-muted`}>
        <span>{diagram.caption}</span>
        <span>P-01</span>
      </figcaption>
      <div aria-hidden="true" className={styles.diagram}>
        {diagram.nodes.map((node) => (
          <div
            key={node.id}
            data-node={node.id}
            style={{ gridArea: node.id }}
            className={`${styles.node} ${node.accent ? styles.accent : ''}`}
          >
            <span className={styles.title}>{node.title}</span>
            {node.lines.map((line) => (
              <span key={line} className={styles.sub}>{line}</span>
            ))}
          </div>
        ))}
        {diagram.edges.map((edge) => (
          <div key={edge.id} style={{ gridArea: edge.id }} className={styles.edge} data-m={edge.mobile} data-d={edge.desktop}>
            <span className={styles.line} />
            <span className={styles.head} />
            <span className={styles.label}>{edge.label}</span>
          </div>
        ))}
      </div>
    </figure>
  );
}
```

- [ ] **Step 5: Run the tests and check it by eye**

Run: `npm test -- diagram && npm run dev`
Expected: tests PASS. Temporarily render `<SystemDiagram />` in `page.tsx` and compare it with the canvas at 390px (vertical spine, Claude and the job APIs on the right) and at 1440px (horizontal elevation). Arrowheads point at FastAPI from the client and the job APIs, and from FastAPI to PostgreSQL and Claude. Remove the temporary render.

- [ ] **Step 6: Commit**

```bash
git add frontend/src/components/diagram frontend/tests/unit/diagram.test.tsx
git commit -m "feat(diagram): responsive SearchWork system elevation in HTML and CSS"
```

### Task 7: Sheet 01 — Index

**Files:**
- Create: `frontend/src/components/sheets/Hero.tsx`, `frontend/src/components/sheets/SpecTable.tsx`, `frontend/src/components/sheets/IndexSheet.tsx`
- Modify: `frontend/src/app/page.tsx`, `frontend/tests/unit/home.test.tsx`
- Test: `frontend/tests/unit/index-sheet.test.tsx`

**Interfaces:**
- Consumes: `profile`, `featuredProjects` (Task 2); `ButtonLink`, `Sheet` (Task 3); `FeaturedCard`, `FeaturedRow` (Task 4); `SiteHeader` (Task 5); `SystemDiagram` (Task 6).
- Produces: `Hero()`, `SpecTable({ rows: SpecRow[] })`, `IndexSheet()`; `page.tsx` renders the header frame and `<main id="main">`.

- [ ] **Step 1: Write the failing tests**

`frontend/tests/unit/index-sheet.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { IndexSheet } from '@/components/sheets/IndexSheet';

describe('IndexSheet', () => {
  it('has the name, role and stack line', () => {
    render(<IndexSheet />);
    expect(screen.getByRole('heading', { level: 1, name: 'Bohdan Bozhenko' })).toBeInTheDocument();
    expect(screen.getByText('Backend / AI Engineer')).toBeInTheDocument();
    expect(screen.getByText('Python / FastAPI · Spring Boot · PostgreSQL')).toBeInTheDocument();
  });

  it('offers the CV under a sensible file name, plus GitHub and LinkedIn', () => {
    render(<IndexSheet />);
    const cv = screen.getByRole('link', { name: /DOWNLOAD CV/ });
    expect(cv).toHaveAttribute('href', '/cv.pdf');
    expect(cv).toHaveAttribute('download', 'Bohdan_Bozhenko_CV.pdf');
    expect(screen.getByRole('link', { name: /GITHUB/ })).toHaveAttribute('href', 'https://github.com/Bogdusik');
    expect(screen.getByRole('link', { name: /LINKEDIN/ })).toHaveAttribute('href', 'https://www.linkedin.com/in/bohdan-bozhenko/');
  });

  it('renders each featured project as a desktop card and a mobile row', () => {
    const { container } = render(<IndexSheet />);
    for (const title of ['SearchWork', 'AI Office', 'Programming Helper AI']) {
      expect(screen.getAllByText(title)).toHaveLength(2);
    }
    expect(container.querySelectorAll('details')).toHaveLength(3);
  });

  it('shows all six spec rows, two of them on mobile', () => {
    const { container } = render(<IndexSheet />);
    expect(container.querySelectorAll('dl dt')).toHaveLength(6);
    expect(container.querySelectorAll('dl > div.contents')).toHaveLength(2);
  });
});
```

Update `frontend/tests/unit/home.test.tsx` so it checks the assembled page:

```tsx
import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import Home from '@/app/page';

it('renders the name as the only h1 inside #main', () => {
  const { container } = render(<Home />);
  expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
  expect(container.querySelector('main#main h1')?.textContent).toBe('Bohdan Bozhenko');
});
```

- [ ] **Step 2: Run them to verify they fail**

Run: `npm test -- index-sheet home`
Expected: FAIL, `IndexSheet` not found.

- [ ] **Step 3: Write the hero and spec table**

`frontend/src/components/sheets/Hero.tsx`:

```tsx
import { ButtonLink } from '@/components/ui/ButtonLink';
import { profile } from '@/content/profile';

export function Hero() {
  const [first, last] = profile.name.split(' ');
  return (
    <div className="px-4 pt-5 lg:px-12 lg:pt-9 lg:pb-10">
      <p className="label-mono text-[10.5px] text-muted lg:text-[12px]">
        WELCOME <span aria-hidden="true" className="lg:hidden">----------</span>
        <span aria-hidden="true" className="hidden lg:inline">------------------------------</span> BACKEND / AI ENGINEERING
      </p>
      <h1 className="mt-3.5 text-[52px] leading-[0.94] font-semibold tracking-[-0.045em] lg:mt-5 lg:text-[104px] lg:leading-[0.92]">
        <span className="block">{first}</span> <span className="block">{last}</span>
      </h1>
      <p className="mt-3.5 flex items-center gap-2.5 text-[22px] font-medium tracking-[-0.01em] text-accent lg:mt-4.5 lg:gap-3.5 lg:text-[34px] lg:tracking-[-0.02em]">
        <span aria-hidden="true" className="size-2.5 bg-accent lg:size-3" />
        {profile.role}
      </p>
      <p className="mt-2 text-base font-medium text-ink-2 lg:mt-3 lg:text-xl">{profile.stackLine}</p>
      <div className="mt-5 grid grid-cols-2 gap-2 lg:mt-7 lg:flex lg:gap-2.5">
        <ButtonLink href={profile.cvPath} download={profile.cvDownloadName} variant="solid" className="col-span-2">
          DOWNLOAD CV <span aria-hidden="true">&nbsp;↓</span>
        </ButtonLink>
        <ButtonLink href={profile.github}>
          GITHUB <span aria-hidden="true">&nbsp;↗</span>
        </ButtonLink>
        <ButtonLink href={profile.linkedin}>
          LINKEDIN <span aria-hidden="true">&nbsp;↗</span>
        </ButtonLink>
      </div>
    </div>
  );
}
```

`frontend/src/components/sheets/SpecTable.tsx`:

```tsx
import type { SpecRow } from '@/content/types';

export function SpecTable({ rows }: { rows: SpecRow[] }) {
  return (
    <div className="font-mono text-[10.5px] leading-[1.7] tracking-[0.03em] lg:text-[11.5px] lg:leading-[1.75]">
      <p aria-hidden="true" className="mb-2.5 hidden tracking-[0.06em] text-muted lg:block">SPEC --------------------------------------</p>
      <dl className="grid grid-cols-[84px_minmax(0,1fr)] lg:grid-cols-[116px_minmax(0,1fr)]">
        {rows.map((row) => (
          <div key={row.label} className={row.mobile ? 'contents' : 'hidden lg:contents'}>
            <dt className="text-muted">{row.label}</dt>
            <dd className="break-words">: {row.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
```

- [ ] **Step 4: Write the sheet and the page**

`frontend/src/components/sheets/IndexSheet.tsx`:

```tsx
import { SystemDiagram } from '@/components/diagram/SystemDiagram';
import { FeaturedCard } from '@/components/projects/FeaturedCard';
import { FeaturedRow } from '@/components/projects/FeaturedRow';
import { Sheet } from '@/components/ui/Sheet';
import { featuredProjects } from '@/content/projects';
import { profile } from '@/content/profile';
import { Hero } from './Hero';
import { SpecTable } from './SpecTable';

export function IndexSheet() {
  return (
    <Sheet id="index" className="border-t-0">
      <div className="grid lg:grid-cols-[repeat(3,minmax(0,1fr))_minmax(0,440px)]">
        <div className="order-1 lg:order-none lg:col-span-2">
          <Hero />
        </div>
        <div className="order-6 border-t border-rule lg:order-none lg:col-span-2 lg:border-t-0 lg:border-l">
          <SystemDiagram />
        </div>
        <h2 id="selected-work" className="sr-only">Selected work</h2>
        {featuredProjects.map((project, index) => (
          <div key={project.id} className={`hidden border-t border-rule lg:block ${index > 0 ? 'lg:border-l' : ''}`}>
            <FeaturedCard project={project} />
          </div>
        ))}
        <div className="order-2 px-4 pt-4 lg:order-none lg:border-t lg:border-l lg:border-rule lg:px-7 lg:py-6">
          <SpecTable rows={profile.spec} />
        </div>
        <div className="order-3 mt-5 border-t border-rule lg:hidden">
          <p aria-hidden="true" className="border-b border-rule px-3.5 py-2.5 label-mono text-[10.5px] text-muted">SELECTED WORK — 03</p>
          {featuredProjects.map((project) => (
            <FeaturedRow key={project.id} project={project} />
          ))}
        </div>
      </div>
    </Sheet>
  );
}
```

`frontend/src/app/page.tsx`:

```tsx
import { SiteHeader } from '@/components/header/SiteHeader';
import { IndexSheet } from '@/components/sheets/IndexSheet';

export default function Home() {
  return (
    <>
      <div className="mx-2 mt-2 border-x border-t border-rule">
        <SiteHeader />
      </div>
      <main id="main" tabIndex={-1} className="outline-none">
        <IndexSheet />
      </main>
    </>
  );
}
```

- [ ] **Step 5: Run the tests**

Run: `npm test`
Expected: PASS.

- [ ] **Step 6: Check the first screen by eye**

Run: `npm run dev`. At 390×844, the name, role, stack, three CTAs, both spec rows and the three project rows are visible without scrolling, and the diagram follows below. At 1440×900, the layout matches the "B · Blueprint — desktop" artboard.

- [ ] **Step 7: Commit**

```bash
git add frontend/src frontend/tests/unit
git commit -m "feat(index): sheet 01 with hero, spec table, featured projects and diagram"
```

### Task 8: Sheets 02–04 — Projects, About, Contact

**Files:**
- Create: `frontend/src/components/sheets/SheetBand.tsx`, `ProjectsSheet.tsx`, `AboutSheet.tsx`, `ContactSheet.tsx`
- Modify: `frontend/src/app/page.tsx`
- Test: `frontend/tests/unit/sheets.test.tsx`

**Interfaces:**
- Consumes: `otherProjects`, `articles`, `about`, `profile`, `formatMonthYear` (Task 2); `ButtonLink`, `Dot`, `Sheet` (Task 3); `DetailedCard` (Task 4).
- Produces: `SheetBand({ number: '02' | '03' | '04', title: string, headingId: string, aside?: ReactNode })`, `ProjectsSheet()`, `AboutSheet()`, `ContactSheet()`.

- [ ] **Step 1: Write the failing tests**

`frontend/tests/unit/sheets.test.tsx`:

```tsx
import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AboutSheet } from '@/components/sheets/AboutSheet';
import { ContactSheet } from '@/components/sheets/ContactSheet';
import { ProjectsSheet } from '@/components/sheets/ProjectsSheet';

describe('ProjectsSheet', () => {
  it('is section #projects titled "Projects" with four detailed cards', () => {
    const { container } = render(<ProjectsSheet />);
    expect(screen.getByRole('region', { name: 'Projects' })).toHaveAttribute('id', 'projects');
    expect(container.querySelectorAll('article')).toHaveLength(4);
    expect(screen.getAllByText('HARD PART')).toHaveLength(4);
    expect(screen.getByRole('link', { name: /ALL REPOSITORIES ON GITHUB/ })).toHaveAttribute('href', 'https://github.com/Bogdusik');
  });
});

describe('AboutSheet', () => {
  it('has the bio, the museum role with dates, and both articles', () => {
    render(<AboutSheet />);
    const about = screen.getByRole('region', { name: 'About' });
    expect(within(about).getByText(/backend and AI engineer in Dumfries/)).toBeInTheDocument();
    expect(within(about).getByText('DEC 2024 — JUN 2025')).toBeInTheDocument();
    expect(within(about).getByRole('link', { name: /Telemetry Pipeline Was Still Quadratic/ })).toHaveAttribute(
      'href',
      'https://hackernoon.com/i-added-every-index-but-my-telemetry-pipeline-was-still-quadratic',
    );
    expect(within(about).getByText('OCT 2026')).toBeInTheDocument();
    expect(within(about).getByText('HACKERNOON · TOP STORY')).toBeInTheDocument();
    expect(within(about).getByText('HACKERNOON')).toBeInTheDocument();
  });

  it('lists education with the First Class highlight and six tool groups', () => {
    render(<AboutSheet />);
    expect(screen.getByText('Glasgow Caledonian University')).toBeInTheDocument();
    expect(screen.getByText('First Class')).toBeInTheDocument();
    expect(screen.getAllByRole('term').map((t) => t.textContent)).toEqual(['BACKEND', 'DATA', 'AI / LLM', 'FRONTEND', 'DELIVERY', 'SECURITY']);
  });
});

describe('ContactSheet', () => {
  it('offers mailto, the CV and the direct lines, with no form', () => {
    const { container } = render(<ContactSheet />);
    expect(screen.getByRole('region', { name: 'Contact' })).toHaveAttribute('id', 'contact');
    expect(screen.getByRole('link', { name: /EMAIL ME/ })).toHaveAttribute('href', 'mailto:bogdyn6@gmail.com');
    expect(screen.getByRole('link', { name: 'bogdyn6@gmail.com' })).toHaveAttribute('href', 'mailto:bogdyn6@gmail.com');
    expect(screen.getByRole('link', { name: /DOWNLOAD CV/ })).toHaveAttribute('download', 'Bohdan_Bozhenko_CV.pdf');
    expect(container.querySelector('form')).toBeNull();
    expect(screen.getByRole('link', { name: /BACK TO TOP/ })).toHaveAttribute('href', '#index');
  });
});
```

- [ ] **Step 2: Run them to verify they fail**

Run: `npm test -- sheets`
Expected: FAIL, modules not found.

- [ ] **Step 3: Write the band and the Projects sheet**

`frontend/src/components/sheets/SheetBand.tsx`:

```tsx
import type { ReactNode } from 'react';

type Props = { number: '02' | '03' | '04'; title: string; headingId: string; aside?: ReactNode };

export function SheetBand({ number, title, headingId, aside }: Props) {
  return (
    <div className="grid grid-cols-[72px_minmax(0,1fr)] border-b border-rule lg:min-h-[150px] lg:grid-cols-[220px_minmax(0,1fr)_400px]">
      <div className="flex flex-col justify-between border-r border-rule p-3.5 lg:px-6 lg:py-5.5">
        <span className="hidden label-mono text-muted lg:block">SHEET {number} / 04</span>
        <span aria-hidden="true" className="font-mono text-[30px] leading-none text-accent lg:text-[56px] lg:tracking-[-0.02em]">{number}</span>
      </div>
      <div className="flex flex-col justify-end px-4 py-3.5 lg:px-10 lg:py-5.5">
        <p className="label-mono text-[10px] text-muted lg:hidden">SHEET {number} / 04</p>
        <h2 id={headingId} className="mt-1.5 text-[40px] leading-none font-semibold tracking-[-0.04em] lg:mt-0 lg:text-[72px] lg:leading-[0.95] lg:tracking-[-0.045em]">
          {title}
        </h2>
      </div>
      {aside && (
        <div className="hidden flex-col justify-end gap-2.5 border-l border-rule px-7 py-5.5 font-mono text-[11.5px] leading-[1.6] tracking-[0.04em] text-ink-3 lg:flex">
          {aside}
        </div>
      )}
    </div>
  );
}
```

`frontend/src/components/sheets/ProjectsSheet.tsx`:

```tsx
import { DetailedCard } from '@/components/projects/DetailedCard';
import { Sheet } from '@/components/ui/Sheet';
import { otherProjects } from '@/content/projects';
import { profile } from '@/content/profile';
import { SheetBand } from './SheetBand';

export function ProjectsSheet() {
  return (
    <Sheet id="projects" labelledBy="projects-title">
      <SheetBand
        number="02"
        title="Projects"
        headingId="projects-title"
        aside={<span>FOUR MORE BUILDS. EACH CARD NAMES ONE PROBLEM I HAD TO SOLVE.</span>}
      />
      <div className="grid lg:grid-cols-2">
        {otherProjects.map((project, index) => (
          <div
            key={project.id}
            className={`border-b border-rule ${index % 2 === 0 ? 'lg:border-r' : ''} ${index >= 2 ? 'lg:border-b-0' : ''}`}
          >
            <DetailedCard project={project} />
          </div>
        ))}
      </div>
      <a href={profile.github} className="flex min-h-12 items-center border-t border-rule px-4 label-mono font-medium text-accent lg:px-10">
        ALL REPOSITORIES ON GITHUB <span aria-hidden="true">&nbsp;↗</span>
      </a>
    </Sheet>
  );
}
```

- [ ] **Step 4: Write the About sheet**

`frontend/src/components/sheets/AboutSheet.tsx`:

```tsx
import { Sheet } from '@/components/ui/Sheet';
import { about } from '@/content/about';
import { formatMonthYear } from '@/content/format';
import { articles } from '@/content/writing';
import { SheetBand } from './SheetBand';

function BlockLabel({ children }: { children: string }) {
  return <h3 className="mb-3.5 label-mono text-accent">{children}</h3>;
}

export function AboutSheet() {
  return (
    <Sheet id="about" labelledBy="about-title">
      <SheetBand
        number="03"
        title="About"
        headingId="about-title"
        aside={<span>EDUCATION, EXPERIENCE, WRITING AND THE TOOLS I SHIP WITH.</span>}
      />
      <div className="grid lg:grid-cols-[minmax(0,620px)_minmax(0,1fr)]">
        <div className="flex flex-col lg:border-r lg:border-rule">
          <div className="border-b border-rule px-4 py-5.5 lg:px-10 lg:py-9">
            <p className="text-[19px] leading-[1.45] tracking-[-0.01em] lg:text-2xl">{about.bio[0]}</p>
            <p className="mt-3.5 text-[15px] leading-[1.6] text-ink-3 lg:mt-4.5 lg:text-[17px]">{about.bio[1]}</p>
          </div>
          <div className="border-b border-rule px-4 py-5.5 lg:px-10">
            <BlockLabel>EXPERIENCE</BlockLabel>
            {about.experience.map((item) => (
              <div key={item.org} className="grid gap-1 lg:grid-cols-[120px_minmax(0,1fr)] lg:gap-3">
                <p className="label-mono text-muted">{item.dates}</p>
                <div>
                  <p className="text-[19px] font-semibold">{item.org}</p>
                  <p className="mt-1 text-[15px] leading-normal text-ink-3">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="border-b border-rule px-4 py-5.5 lg:border-b-0 lg:px-10">
            <BlockLabel>WRITING</BlockLabel>
            <ul className="grid gap-4">
              {articles.map((article) => (
                <li key={article.url} className="grid gap-1 lg:grid-cols-[120px_minmax(0,1fr)] lg:gap-3">
                  <p className="label-mono text-muted">{formatMonthYear(article.published)}</p>
                  <div className="min-w-0">
                    <a href={article.url} className="text-[17px] leading-snug font-semibold break-words hover:text-accent">
                      {article.title}
                    </a>
                    <p className="mt-1 label-mono text-muted">
                      {article.publication.toUpperCase()}
                      {article.topStory ? ' · TOP STORY' : ''}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div>
          <div className="border-b border-rule px-4 py-5.5 lg:px-10 lg:pt-8">
            <BlockLabel>EDUCATION</BlockLabel>
            <ul>
              {about.education.map((item) => (
                <li key={item.school} className="grid gap-0.5 border-t border-rule py-2.5 last:border-b lg:grid-cols-[112px_minmax(0,1fr)_minmax(0,1fr)] lg:gap-3">
                  <span className="font-mono text-[11.5px] text-muted">{item.years}</span>
                  <span className="font-semibold">{item.school}</span>
                  <span>
                    {item.award}
                    {item.highlight && (
                      <>
                        {' — '}
                        <span className="font-medium text-accent">{item.highlight}</span>
                      </>
                    )}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-3 label-mono text-muted">+ {about.certificate}</p>
          </div>
          <div className="px-4 py-5.5 lg:px-10 lg:py-7">
            <BlockLabel>TOOLS</BlockLabel>
            <dl className="grid gap-x-3 gap-y-2.5 font-mono text-[11px] leading-[1.5] tracking-[0.03em] lg:grid-cols-[112px_minmax(0,1fr)] lg:text-[12px]">
              {about.tools.map((group) => (
                <div key={group.group} className="contents">
                  <dt className="text-muted">{group.group}</dt>
                  <dd className="break-words">{group.items.join(' · ')}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </Sheet>
  );
}
```

- [ ] **Step 5: Write the Contact sheet**

`frontend/src/components/sheets/ContactSheet.tsx`:

```tsx
import { ButtonLink } from '@/components/ui/ButtonLink';
import { Dot } from '@/components/ui/Dot';
import { Sheet } from '@/components/ui/Sheet';
import { profile } from '@/content/profile';
import { SheetBand } from './SheetBand';

const rowClass = 'border-t border-rule py-3.5 lg:py-3';

export function ContactSheet() {
  const mailto = `mailto:${profile.email}`;
  return (
    <Sheet id="contact" labelledBy="contact-title">
      <SheetBand
        number="04"
        title="Contact"
        headingId="contact-title"
        aside={
          <span className="flex items-center gap-2.5 font-medium text-ink">
            <Dot />
            {profile.status}
          </span>
        }
      />
      <div className="grid lg:grid-cols-[minmax(0,1fr)_560px]">
        <div className="flex flex-col justify-center border-b border-rule px-4 py-6 lg:border-b-0 lg:p-10">
          <p className="max-w-[680px] text-[32px] leading-[1.08] font-semibold tracking-[-0.035em] lg:text-[52px] lg:leading-[1.04] lg:tracking-[-0.04em]">
            Hiring for a backend or AI role in Scotland? <span className="text-accent">Let’s talk.</span>
          </p>
          <div className="mt-5 grid grid-cols-2 gap-2 lg:mt-8 lg:flex lg:gap-2.5">
            <ButtonLink href={mailto} variant="solid">
              EMAIL ME <span aria-hidden="true">&nbsp;↗</span>
            </ButtonLink>
            <ButtonLink href={profile.cvPath} download={profile.cvDownloadName}>
              DOWNLOAD CV <span aria-hidden="true">&nbsp;↓</span>
            </ButtonLink>
          </div>
        </div>
        <div className="px-4 pt-2 pb-5 font-mono text-[11px] tracking-[0.03em] lg:border-l lg:border-rule lg:p-10 lg:text-[12.5px]">
          <h3 className="mb-3.5 hidden label-mono text-accent lg:block">DIRECT LINES</h3>
          <dl className="grid grid-cols-[minmax(0,110px)_minmax(0,1fr)] lg:grid-cols-[130px_minmax(0,1fr)]">
            <dt className={`${rowClass} text-muted`}>EMAIL</dt>
            <dd className={rowClass}>
              <a href={mailto} className="font-medium break-all hover:text-accent">{profile.email}</a>
            </dd>
            <dt className={`${rowClass} text-muted`}>LINKEDIN</dt>
            <dd className={rowClass}>
              <a href={profile.linkedin} className="font-medium hover:text-accent">in/bohdan-bozhenko <span aria-hidden="true">↗</span></a>
            </dd>
            <dt className={`${rowClass} text-muted`}>GITHUB</dt>
            <dd className={rowClass}>
              <a href={profile.github} className="font-medium hover:text-accent">Bogdusik <span aria-hidden="true">↗</span></a>
            </dd>
            <dt className={`${rowClass} text-muted`}>LOCATION</dt>
            <dd className={`${rowClass} break-words`}>{profile.location}</dd>
            <dt className={`${rowClass} border-b text-muted`}>RIGHT TO WORK</dt>
            <dd className={`${rowClass} border-b`}>{profile.rightToWork}</dd>
          </dl>
        </div>
      </div>
      <footer className="grid border-t border-rule font-mono text-[10px] tracking-[0.06em] text-muted lg:h-14 lg:grid-cols-[minmax(0,1fr)_320px_220px_180px] lg:text-[11px]">
        <span className="flex items-center px-4 py-3 lg:px-6 lg:py-0">© 2026 BOHDAN BOZHENKO</span>
        <span className="hidden items-center border-l border-rule px-5 lg:flex">BUILT WITH NEXT.JS + TYPESCRIPT</span>
        <span className="hidden items-center border-l border-rule px-5 lg:flex">END OF DRAWING SET</span>
        <a href="#index" className="flex min-h-12 items-center justify-between border-t border-rule px-4 font-medium text-accent lg:border-t-0 lg:border-l lg:px-5">
          BACK TO TOP <span aria-hidden="true">↑</span>
        </a>
      </footer>
    </Sheet>
  );
}
```

- [ ] **Step 6: Add the sheets to the page**

In `frontend/src/app/page.tsx`, import the three sheets and render them after `<IndexSheet />` inside `<main>`:

```tsx
import { SiteHeader } from '@/components/header/SiteHeader';
import { AboutSheet } from '@/components/sheets/AboutSheet';
import { ContactSheet } from '@/components/sheets/ContactSheet';
import { IndexSheet } from '@/components/sheets/IndexSheet';
import { ProjectsSheet } from '@/components/sheets/ProjectsSheet';

export default function Home() {
  return (
    <>
      <div className="mx-2 mt-2 border-x border-t border-rule">
        <SiteHeader />
      </div>
      <main id="main" tabIndex={-1} className="outline-none">
        <IndexSheet />
        <ProjectsSheet />
        <AboutSheet />
        <ContactSheet />
      </main>
    </>
  );
}
```

On mobile the About sheet reads bio → experience → writing → education → tools. That differs from the mobile artboard, which puts education before experience; it follows the DOM order of the desktop columns, on purpose.

- [ ] **Step 7: Run all checks**

Run: `npm test && npm run lint && npm run typecheck && npm run build`
Expected: PASS.

- [ ] **Step 8: Commit**

```bash
git add frontend/src frontend/tests/unit
git commit -m "feat(sheets): projects, about with writing, and contact sheets"
```

### Task 9: CV, redirect, README and deployment smoke tests

**Files:**
- Create: `frontend/public/cv.pdf` (the user's `CV_Bohdan_Bozhenko_Glasgow.pdf`), `frontend/public/favicon.svg`, `frontend/vercel.json`, `frontend/vitest.smoke.config.ts`, `frontend/tests/smoke/deployment.test.ts`
- Modify: `README.md`, `frontend/src/app/layout.tsx` (favicon)
- Delete: `frontend/src/app/favicon.ico` (from `create-next-app`)
- Test: `frontend/tests/unit/vercel-config.test.ts`

**Interfaces:**
- Consumes: `externalLinks()` (Task 2).
- Produces: `npm run test:smoke` with `SMOKE_URL` (required for the deployment checks; `BASE_URL` is reserved by Vite) and `VERCEL_BYPASS` (optional, a Vercel protection-bypass secret for protected preview deployments).

- [ ] **Step 1: Add the CV**

Blocked until the user sends `CV_Bohdan_Bozhenko_Glasgow.pdf`. Copy it to `frontend/public/cv.pdf`. Check: `node -e "const b=require('fs').readFileSync('frontend/public/cv.pdf');if(b.subarray(0,5).toString()!=='%PDF-')process.exit(1)"` exits 0.

- [ ] **Step 2: Write the failing config test**

`frontend/tests/unit/vercel-config.test.ts`:

```ts
import { readFileSync } from 'node:fs';
import { expect, it } from 'vitest';

it('permanently redirects the old CV URL to /cv.pdf', () => {
  const config = JSON.parse(readFileSync(new URL('../../vercel.json', import.meta.url), 'utf8'));
  expect(config.redirects).toContainEqual({ source: '/CV%20Bohdan%20Bozhenko.pdf', destination: '/cv.pdf', permanent: true });
});
```

Run: `npm test -- vercel-config`
Expected: FAIL, `vercel.json` missing.

- [ ] **Step 3: Write `vercel.json`**

`frontend/vercel.json`:

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "redirects": [
    { "source": "/CV%20Bohdan%20Bozhenko.pdf", "destination": "/cv.pdf", "permanent": true }
  ]
}
```

Run: `npm test -- vercel-config`
Expected: PASS.

- [ ] **Step 4: Write the smoke tests**

`frontend/vitest.smoke.config.ts`:

```ts
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
  test: { environment: 'node', include: ['tests/smoke/**/*.test.ts'], testTimeout: 30_000 },
});
```

`frontend/tests/smoke/deployment.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { externalLinks } from '@/content/links';

const base = process.env.BASE_URL?.replace(/\/$/, '');
if (!base) throw new Error('Set BASE_URL to the deployment to check, e.g. https://personal-website-bogdusik.vercel.app');

const bypass = process.env.VERCEL_BYPASS ? { 'x-vercel-protection-bypass': process.env.VERCEL_BYPASS } : undefined;
const BOT_BLOCKING_HOSTS = ['www.linkedin.com']; // LinkedIn answers 999 to non-browser clients

describe('deployment', () => {
  it('serves the home page', async () => {
    const res = await fetch(`${base}/`, { headers: bypass });
    expect(res.status).toBe(200);
    expect(await res.text()).toContain('Bohdan');
  });

  it('serves the CV as a PDF', async () => {
    const res = await fetch(`${base}/cv.pdf`, { headers: bypass });
    expect(res.status).toBe(200);
    expect(res.headers.get('content-type')).toContain('application/pdf');
  });

  it('redirects the old CV URL permanently to /cv.pdf', async () => {
    const res = await fetch(`${base}/CV%20Bohdan%20Bozhenko.pdf`, { redirect: 'manual', headers: bypass });
    expect(res.status).toBe(308);
    expect(new URL(res.headers.get('location')!, base).pathname).toBe('/cv.pdf');
  });
});

describe('external links', () => {
  const links = externalLinks().filter((l) => !BOT_BLOCKING_HOSTS.includes(new URL(l).host));

  it.each(links)('%s opens and is public', async (link) => {
    const res = await fetch(link, { headers: { 'user-agent': 'Mozilla/5.0 (portfolio link check)' } });
    expect(res.status, link).toBeLessThan(400);
    expect(res.url, `${link} ended on a login page`).not.toMatch(/vercel\.com\/login|github\.com\/login/);
  });
});
```

Run against the current SearchWork deployment to prove the link checks work (the site checks will fail until the new site is deployed; that is expected): `SMOKE_URL=https://searchwork-bogdusik.vercel.app npm run test:smoke -- -t "external links"`
Expected: all external-link cases PASS. If one fails, fix the link in `src/content/` or report it to the user before going on.

- [ ] **Step 5: Favicon**

`frontend/public/favicon.svg`:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect width="32" height="32" fill="#F1EFE8"/>
  <rect x="1" y="1" width="30" height="30" fill="none" stroke="#BDB9AE" stroke-width="2"/>
  <text x="16" y="21.5" text-anchor="middle" font-family="monospace" font-size="13" font-weight="600" fill="#2438D8">BB</text>
</svg>
```

Delete `frontend/src/app/favicon.ico` and add `icons: { icon: '/favicon.svg' }` to `metadata` in `frontend/src/app/layout.tsx`.

- [ ] **Step 6: Rewrite the README**

`README.md` at the repo root:

````markdown
# Bohdan Bozhenko — portfolio

Personal site: https://personal-website-bogdusik.vercel.app

A static one-page site in a "drawing set" style: four sheets (Index, Projects, About, Contact), one accent colour, mono labels. No loaders, no 3D, no tracking.

## Stack

Next.js 16 (App Router, prerendered), React 19, TypeScript 6, Tailwind CSS 4, Vitest + Testing Library, Playwright, Vercel. The app lives in `frontend/`.

## Run

```bash
cd frontend
npm ci
npm run dev        # http://localhost:3000
npm test           # unit tests
npm run build
```

## Content

All copy is in `frontend/src/content/`. Every number on the site has a source (a file, a commit or a green CI run), listed in `docs/superpowers/specs/2026-10-15-blueprint-redesign-design.md`, section 9. Test counts are shown only for tests that CI runs.

## Deployment checks

```bash
SMOKE_URL=https://personal-website-bogdusik.vercel.app npm run test:smoke
```
````

- [ ] **Step 7: Run all checks**

Run: `npm test && npm run lint && npm run typecheck && npm run build`
Expected: PASS.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat(release): CV with old-URL redirect, favicon, deployment smoke tests and README"
```

### Task 10: Ship Stage 1 to production

Operations in Vercel and GitHub; no code. Follow the spec's "Deployment steps".

- [ ] **Step 1: Push and open the PR**

```bash
git push -u origin feature/blueprint-redesign
```

Open a PR into `main` titled `feat: Blueprint redesign on Next.js 16`. CI must be green.

- [ ] **Step 2: Create the preview project**

In Vercel: Add New → Project → import `Bogdusik/Personal-Web-Site` again, name `personal-website-next`, Root Directory `frontend`, framework Next.js, Node.js 24.x. Deploy the `feature/blueprint-redesign` branch. If Deployment Protection is on, create a Protection Bypass for Automation secret.

- [ ] **Step 3: Check the preview**

Run: `SMOKE_URL=<preview URL> VERCEL_BYPASS=<secret> npm run test:smoke`
Expected: all PASS. Then a manual pass: compare it with the canvas at 390px and 1440px; run Lighthouse on mobile and record the four scores in the PR description (budgets are not enforced until Stage 4).

- [ ] **Step 4: Merge and switch production**

Squash-merge the PR. Immediately, in the existing production project: Settings → Build & Deployment → Root Directory `frontend`, Node.js 24.x; then redeploy `main`.

- [ ] **Step 5: Verify production**

Run: `SMOKE_URL=https://personal-website-bogdusik.vercel.app npm run test:smoke`
Expected: all PASS. On failure, roll back: set Root Directory back to the repository root and promote the last CRA deployment.

- [ ] **Step 6: Tag and clean up**

```bash
git switch main && git pull --ff-only
git tag v2.0.0 && git push origin v2.0.0
```

Delete the `personal-website-next` project, or keep it for the preview branches of later stages.

---

# Stage 2 — SEO and sharing (moved into Stage 1)

Task 11 now runs on `feature/blueprint-redesign` before Task 10. Its last step ("Commit, PR, merge, verify") becomes a commit on that branch; the PR, merge and production check happen in Task 10.

### Task 11: Metadata, JSON-LD, sitemap, robots, OG image, 404

**Files:**
- Create: `frontend/src/app/site-metadata.ts`, `frontend/src/content/jsonld.ts`, `frontend/src/app/sitemap.ts`, `frontend/src/app/robots.ts`, `frontend/src/app/opengraph-image.tsx`, `frontend/src/app/not-found.tsx`
- Modify: `frontend/src/app/layout.tsx`
- Test: `frontend/tests/unit/seo.test.ts`

**Interfaces:**
- Consumes: `profile`, `SITE_URL` (Task 2).
- Produces: `siteMetadata: Metadata`; `personJsonLd(): Record<string, unknown>`; Next file conventions `sitemap()`, `robots()`, `opengraph-image`.

- [ ] **Step 1: Write the failing tests**

`frontend/tests/unit/seo.test.ts`:

```ts
import { expect, it } from 'vitest';
import robots from '@/app/robots';
import { siteMetadata } from '@/app/site-metadata';
import sitemap from '@/app/sitemap';
import { personJsonLd } from '@/content/jsonld';
import { SITE_URL } from '@/content/site';

it('sets canonical, Open Graph and Twitter metadata', () => {
  expect(siteMetadata.metadataBase?.toString()).toBe(`${SITE_URL}/`);
  expect(siteMetadata.alternates?.canonical).toBe('/');
  expect(siteMetadata.openGraph).toMatchObject({ type: 'profile', url: '/', title: 'Bohdan Bozhenko — Backend / AI Engineer' });
  expect(siteMetadata.twitter).toMatchObject({ card: 'summary_large_image' });
});

it('describes a Person with the profile links', () => {
  const ld = personJsonLd();
  expect(ld).toMatchObject({
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Bohdan Bozhenko',
    jobTitle: 'Backend / AI Engineer',
    alumniOf: { '@type': 'CollegeOrUniversity', name: 'Glasgow Caledonian University' },
    address: { '@type': 'PostalAddress', addressLocality: 'Dumfries', addressCountry: 'GB' },
  });
  expect(ld.sameAs).toEqual(['https://github.com/Bogdusik', 'https://www.linkedin.com/in/bohdan-bozhenko/']);
});

it('lists the home page in the sitemap and points robots at it', () => {
  expect(sitemap()).toEqual([{ url: `${SITE_URL}/`, changeFrequency: 'monthly', priority: 1 }]);
  expect(robots()).toEqual({ rules: [{ userAgent: '*', allow: '/' }], sitemap: `${SITE_URL}/sitemap.xml` });
});
```

Run: `npm test -- seo`
Expected: FAIL, modules not found.

- [ ] **Step 2: Write metadata and JSON-LD**

`frontend/src/app/site-metadata.ts`:

```ts
import type { Metadata } from 'next';
import { SITE_URL } from '@/content/site';

const title = 'Bohdan Bozhenko — Backend / AI Engineer';
const description =
  'Backend / AI engineer in Scotland. Python / FastAPI, Spring Boot, PostgreSQL and LLM-powered products. First Class BSc Computing, available immediately.';

export const siteMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title,
  description,
  alternates: { canonical: '/' },
  icons: { icon: '/favicon.svg' },
  openGraph: { type: 'profile', url: '/', title, description, siteName: 'Bohdan Bozhenko', locale: 'en_GB' },
  twitter: { card: 'summary_large_image', title, description },
};
```

`frontend/src/content/jsonld.ts`:

```ts
import { profile } from './profile';
import { SITE_URL } from './site';

export function personJsonLd(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: profile.name,
    jobTitle: profile.role,
    url: SITE_URL,
    email: `mailto:${profile.email}`,
    alumniOf: { '@type': 'CollegeOrUniversity', name: 'Glasgow Caledonian University' },
    address: { '@type': 'PostalAddress', addressLocality: 'Dumfries', addressCountry: 'GB' },
    sameAs: [profile.github, profile.linkedin],
  };
}
```

In `frontend/src/app/layout.tsx`, replace the inline `metadata` with `export const metadata = siteMetadata;` (import from `./site-metadata`) and add, as the first child of `<body>` after `<SkipLink />`:

```tsx
<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd()) }} />
```

- [ ] **Step 3: Write sitemap and robots**

`frontend/src/app/sitemap.ts`:

```ts
import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/content/site';

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: `${SITE_URL}/`, changeFrequency: 'monthly', priority: 1 }];
}
```

`frontend/src/app/robots.ts`:

```ts
import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/content/site';

export default function robots(): MetadataRoute.Robots {
  return { rules: [{ userAgent: '*', allow: '/' }], sitemap: `${SITE_URL}/sitemap.xml` };
}
```

Run: `npm test -- seo`
Expected: PASS.

- [ ] **Step 4: Write the OG image and the 404 page**

`frontend/src/app/opengraph-image.tsx`:

```tsx
import { ImageResponse } from 'next/og';

export const alt = 'Bohdan Bozhenko — Backend / AI Engineer';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', background: '#F1EFE8', padding: 16 }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', border: '2px solid #BDB9AE', padding: '48px 56px', color: '#191917' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 22, letterSpacing: 2, color: '#5E5C55' }}>
            <span>SHEET 01 / 04 — INDEX</span>
            <span style={{ color: '#2438D8' }}>● AVAILABLE — IMMEDIATE START</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: 120, fontWeight: 600, letterSpacing: -5, lineHeight: 0.95 }}>Bohdan Bozhenko</span>
            <span style={{ marginTop: 24, fontSize: 48, color: '#2438D8' }}>Backend / AI Engineer</span>
            <span style={{ marginTop: 12, fontSize: 30, color: '#3E3C38' }}>Python / FastAPI · Spring Boot · PostgreSQL</span>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
```

`frontend/src/app/not-found.tsx`:

```tsx
export default function NotFound() {
  return (
    <main id="main" className="m-2 border border-rule px-4 py-16 lg:px-12">
      <p className="label-mono text-muted">SHEET 404 — NOT IN THIS DRAWING SET</p>
      <h1 className="mt-4 text-[52px] leading-none font-semibold tracking-[-0.045em] lg:text-[96px]">Page not found</h1>
      <a href="/" className="mt-8 inline-flex min-h-12 items-center border border-ink px-5.5 label-mono font-medium hover:bg-ink hover:text-paper">
        BACK TO SHEET 01 <span aria-hidden="true">&nbsp;→</span>
      </a>
    </main>
  );
}
```

`not-found.tsx` uses a plain `<a>` on purpose: the site has a single route, so client-side navigation via `next/link` adds nothing.

- [ ] **Step 5: Run all checks and inspect the output**

Run: `npm test && npm run lint && npm run typecheck && npm run build && npm run start`
Expected: PASS. `http://localhost:3000/opengraph-image` shows the card; `/sitemap.xml` and `/robots.txt` are served; `/nope` shows the 404 sheet; the page source has the JSON-LD script.

- [ ] **Step 6: Commit, PR, merge, verify**

```bash
git add frontend
git commit -m "feat(seo): metadata, Person JSON-LD, sitemap, robots, OG image and 404 sheet"
git push -u origin feature/seo-sharing
```

Open the PR, wait for green CI, squash-merge, then run `SMOKE_URL=https://personal-website-bogdusik.vercel.app npm run test:smoke` and check the share card with a link-preview tool.

---

# Stage 3 — End-to-end tests

Branch: `chore/e2e-tests` from `main`.

### Task 12b: Mobile menu focus and featured headings on mobile

From the Stage 1 review, moved here by the user.

**Files:**
- Modify: `frontend/src/components/header/MobileMenu.tsx`, `frontend/src/components/projects/FeaturedRow.tsx`, `frontend/src/components/sheets/IndexSheet.tsx`
- Test: `frontend/tests/unit/header.test.tsx`, `frontend/tests/unit/index-sheet.test.tsx`

- [ ] **Step 1: Write the failing tests**

Append to `frontend/tests/unit/header.test.tsx`, inside `describe('MobileMenu', …)`:

```tsx
  it('closes when keyboard focus leaves the menu', async () => {
    const user = userEvent.setup();
    render(<div><MobileMenu links={links} /><button type="button">after</button></div>);
    const button = screen.getByRole('button', { name: /menu/i });
    await user.click(button);
    await user.tab(); // 02 Projects
    await user.tab(); // 04 Contact
    await user.tab(); // leaves the menu
    expect(screen.getByRole('button', { name: 'after' })).toHaveFocus();
    expect(button).toHaveAttribute('aria-expanded', 'false');
  });
```

Append to `frontend/tests/unit/index-sheet.test.tsx`, inside `describe('IndexSheet', …)`:

```tsx
  it('gives every featured project a heading in both layouts, after the spec table', () => {
    const { container } = render(<IndexSheet />);
    for (const title of ['SearchWork', 'AI Office', 'Programming Helper AI']) {
      expect(screen.getAllByRole('heading', { level: 3, name: title })).toHaveLength(2);
    }
    const spec = container.querySelector('dl')!;
    const h2 = screen.getByRole('heading', { level: 2, name: 'Selected work' });
    expect(spec.compareDocumentPosition(h2) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });
```

Run: `npm test -- header index-sheet`
Expected: FAIL: aria-expanded stays "true"; one h3 per title; the spec table follows the h2.

- [ ] **Step 2: Close the menu when focus leaves it**

In `MobileMenu.tsx`, give the root `<div ref={rootRef} …>` an `onBlur` handler:

```tsx
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setOpen(false);
      }}
```

- [ ] **Step 3: Headings in the mobile rows**

In `FeaturedRow.tsx`, replace the title `<span className="block text-lg font-semibold tracking-[-0.01em]">{project.title}</span>` with:

```tsx
          <h3 className="text-lg font-semibold tracking-[-0.01em]">{project.title}</h3>
```

(A heading is allowed inside `<summary>`.)

- [ ] **Step 4: Spec table before the "Selected work" heading**

In `IndexSheet.tsx`, move the spec cell (`<div className="order-2 px-4 pt-4 …"><SpecTable … /></div>`) to just after the diagram cell, and pin it on desktop by adding `lg:col-start-4 lg:row-start-2` to its className, so the desktop grid still places it as the fourth cell of the second row.

- [ ] **Step 5: Run the tests and check the layout**

Run: `npm test && npm run lint && npm run typecheck`
Expected: PASS. At 1440×900 the spec table is still the right-hand cell of the bottom band; at 390×844 the order is hero, spec, rows, diagram.

- [ ] **Step 6: Commit**

```bash
git add frontend
git commit -m "fix(a11y): close the mobile menu when focus leaves it; headings for featured projects on mobile"
```

### Task 12: Playwright, accessibility and layout checks in CI

**Files:**
- Create: `frontend/playwright.config.ts`, `frontend/tests/e2e/layout.spec.ts`, `frontend/tests/e2e/keyboard.spec.ts`, `frontend/tests/e2e/a11y.spec.ts`, `frontend/tests/e2e/nojs.spec.ts`, `frontend/tests/e2e/assets.spec.ts`
- Modify: `frontend/package.json` (script `test:e2e`), `.github/workflows/ci.yml`

**Interfaces:**
- Consumes: the built site from Stages 1–2; element ids `#index`, `#main`, `#projects`, `#about`, `#contact`; desktop cards `article#searchwork`, `article#ai-office`, `article#programming-helper-ai`.
- Produces: `npm run test:e2e`; CI job `e2e`.

- [ ] **Step 1: Install and configure**

```bash
cd frontend
npm i -D @playwright/test@1.64 @axe-core/playwright@4.14
npx playwright install chromium
```

Add `"test:e2e": "playwright test"` to `scripts`.

`frontend/playwright.config.ts`:

```ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: 'tests/e2e',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  use: { baseURL: 'http://localhost:3000' },
  webServer: { command: 'npm run start', url: 'http://localhost:3000', reuseExistingServer: !process.env.CI, timeout: 120_000 },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
});
```

- [ ] **Step 2: Write the layout tests**

`frontend/tests/e2e/layout.spec.ts`:

```ts
import { expect, test, type Locator, type Page } from '@playwright/test';

async function expectAboveFold(page: Page, locator: Locator) {
  const box = await locator.boundingBox();
  expect(box, 'element is rendered').not.toBeNull();
  expect(box!.y + box!.height).toBeLessThanOrEqual(page.viewportSize()!.height);
}

for (const viewport of [
  { width: 320, height: 640 },
  { width: 390, height: 844 },
  { width: 1024, height: 768 },
  { width: 1440, height: 900 },
]) {
  test(`no horizontal scroll at ${viewport.width}px`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto('/');
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBe(0);
  });
}

test('mobile first screen at 390x844', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await expectAboveFold(page, page.getByRole('heading', { level: 1, name: 'Bohdan Bozhenko' }));
  await expectAboveFold(page, page.getByText('Backend / AI Engineer').first());
  await expectAboveFold(page, page.getByRole('link', { name: /DOWNLOAD CV/ }).first());
  await expectAboveFold(page, page.getByRole('link', { name: /GITHUB/ }).first());
  await expectAboveFold(page, page.getByRole('link', { name: /LINKEDIN/ }).first());
  for (const title of ['SearchWork', 'AI Office', 'Programming Helper AI']) {
    await expectAboveFold(page, page.locator('summary', { hasText: title }));
  }
});

test('desktop first screen at 1280x800', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('/');
  await expectAboveFold(page, page.getByRole('heading', { level: 1, name: 'Bohdan Bozhenko' }));
  await expectAboveFold(page, page.getByRole('link', { name: /DOWNLOAD CV/ }).first());
  for (const id of ['searchwork', 'ai-office', 'programming-helper-ai']) {
    await expectAboveFold(page, page.locator(`article#${id} h3`));
  }
});

test('the CONTACT link scrolls to the contact sheet', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  await page.getByRole('link', { name: /^CONTACT/ }).click();
  await expect(page.locator('#contact')).toBeInViewport();
});
```

- [ ] **Step 3: Write the keyboard test**

`frontend/tests/e2e/keyboard.spec.ts`:

```ts
import { expect, test } from '@playwright/test';

test.use({ viewport: { width: 390, height: 844 } });

test('skip link first, then the menu works by keyboard alone', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('#main')).toBeFocused();

  await page.goto('/');
  const menu = page.getByRole('button', { name: /menu/i });
  await menu.focus();
  await page.keyboard.press('Enter');
  await expect(menu).toHaveAttribute('aria-expanded', 'true');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: '02 PROJECTS' })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(menu).toHaveAttribute('aria-expanded', 'false');
  await expect(menu).toBeFocused();
});
```

- [ ] **Step 4: Write the accessibility, no-JS and asset tests**

`frontend/tests/e2e/a11y.spec.ts`:

```ts
import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

for (const viewport of [{ width: 390, height: 844 }, { width: 1440, height: 900 }]) {
  test(`no axe violations at ${viewport.width}px`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto('/');
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze();
    expect(results.violations).toEqual([]);
  });
}
```

`frontend/tests/e2e/nojs.spec.ts`:

```ts
import { expect, test } from '@playwright/test';

test.use({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });

test('without JavaScript every sheet, CTA and project detail is reachable', async ({ page }) => {
  await page.goto('/');
  for (const id of ['projects', 'about', 'contact']) await expect(page.locator(`#${id}`)).toBeAttached();
  await expect(page.getByRole('link', { name: /DOWNLOAD CV/ }).first()).toBeVisible();
  await page.locator('summary', { hasText: 'SearchWork' }).click();
  await expect(page.getByText(/Job tracker for UK graduate roles/).first()).toBeVisible();
});
```

`frontend/tests/e2e/assets.spec.ts`:

```ts
import { expect, test } from '@playwright/test';

test('the CV, OG image, sitemap and robots are served', async ({ request }) => {
  const cv = await request.get('/cv.pdf');
  expect(cv.status()).toBe(200);
  expect(cv.headers()['content-type']).toContain('application/pdf');

  const og = await request.get('/opengraph-image');
  expect(og.status()).toBe(200);
  expect(og.headers()['content-type']).toContain('image/png');

  expect((await request.get('/sitemap.xml')).status()).toBe(200);
  expect((await request.get('/robots.txt')).status()).toBe(200);
});
```

- [ ] **Step 5: Run them**

Run: `npm run build && npm run test:e2e`
Expected: all PASS. A failure here is a product bug: fix the component (most likely suspects are `min-w-0` or `break-words` for overflow, and contrast or names for axe), not the test.

- [ ] **Step 6: Add the CI job**

Append to `jobs:` in `.github/workflows/ci.yml`:

```yaml
  e2e:
    name: End-to-end (Playwright)
    needs: web
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: frontend
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 24
          cache: npm
          cache-dependency-path: frontend/package-lock.json
      - run: npm ci
      - run: npx playwright install --with-deps chromium
      - run: npm run build
      - run: npm run test:e2e
```

- [ ] **Step 7: Commit, PR, merge**

```bash
git add frontend .github
git commit -m "test(e2e): layout, keyboard, axe, no-JS and asset checks in CI"
git push -u origin chore/e2e-tests
```

Open the PR, wait for both CI jobs to go green, then squash-merge.

---

# Stage 4 — Performance budgets in CI

Branch: `chore/perf-budgets` from `main`.

### Task 13: First-load JS budget

**Files:**
- Create: `frontend/scripts/check-js-budget.mts`
- Modify: `frontend/package.json` (script `check:js-budget`), `.github/workflows/ci.yml`
- Test: `frontend/tests/unit/js-budget.test.ts`

**Interfaces:**
- Produces: `scriptSources(html: string): string[]`, `firstLoadJsBytes(opts: { html: string; nextDir: string }): Promise<number>`, `JS_BUDGET_BYTES = 130 * 1024`; CLI `node scripts/check-js-budget.mts`.

- [ ] **Step 1: Write the failing test**

`frontend/tests/unit/js-budget.test.ts`:

```ts
import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { gzipSync } from 'node:zlib';
import { expect, it } from 'vitest';
import { firstLoadJsBytes, scriptSources } from '../../scripts/check-js-budget.mts';

const html = `<html><head>
<script src="/_next/static/chunks/a.js" async=""></script>
<script src="/_next/static/chunks/b.js"></script>
<script src="/_next/static/chunks/a.js" async=""></script>
<script src="https://example.com/x.js"></script>
<script>self.__next_f=[]</script>
</head></html>`;

it('collects unique same-origin Next.js script sources', () => {
  expect(scriptSources(html)).toEqual(['/_next/static/chunks/a.js', '/_next/static/chunks/b.js']);
});

it('sums the gzip size of each script once', async () => {
  const nextDir = mkdtempSync(path.join(tmpdir(), 'budget-'));
  mkdirSync(path.join(nextDir, 'static', 'chunks'), { recursive: true });
  const a = Buffer.from('console.log("a");'.repeat(50));
  const b = Buffer.from('console.log("b");');
  writeFileSync(path.join(nextDir, 'static', 'chunks', 'a.js'), a);
  writeFileSync(path.join(nextDir, 'static', 'chunks', 'b.js'), b);
  expect(await firstLoadJsBytes({ html, nextDir })).toBe(gzipSync(a).length + gzipSync(b).length);
});

it('fails loudly when a referenced chunk is missing', async () => {
  const nextDir = mkdtempSync(path.join(tmpdir(), 'budget-'));
  await expect(firstLoadJsBytes({ html, nextDir })).rejects.toThrow(/a\.js/);
});
```

Run: `npm test -- js-budget`
Expected: FAIL, module not found.

- [ ] **Step 2: Write the script**

`frontend/scripts/check-js-budget.mts`:

```ts
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { gzipSync } from 'node:zlib';

export const JS_BUDGET_BYTES = 130 * 1024;
const PREFIX = '/_next/static/';

export function scriptSources(html: string): string[] {
  const sources = [...html.matchAll(/<script\b[^>]*\bsrc="([^"]+)"/g)].map((match) => match[1]);
  return [...new Set(sources.filter((src) => src.startsWith(PREFIX)))];
}

export async function firstLoadJsBytes({ html, nextDir }: { html: string; nextDir: string }): Promise<number> {
  let total = 0;
  for (const src of scriptSources(html)) {
    const file = path.join(nextDir, 'static', src.slice(PREFIX.length).split('?')[0]);
    total += gzipSync(await readFile(file)).length;
  }
  return total;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
  const nextDir = path.join(root, '.next');
  const html = await readFile(path.join(nextDir, 'server', 'app', 'index.html'), 'utf8');
  const bytes = await firstLoadJsBytes({ html, nextDir });
  const kb = (n: number) => `${(n / 1024).toFixed(1)} kB`;
  console.log(`First-load JS for /: ${kb(bytes)} gzip (budget ${kb(JS_BUDGET_BYTES)})`);
  if (bytes > JS_BUDGET_BYTES) {
    console.error('Over budget.');
    process.exit(1);
  }
}
```

Add `"check:js-budget": "node scripts/check-js-budget.mts"` to `scripts`.

- [ ] **Step 3: Run the tests and the real check**

Run: `npm test -- js-budget && npm run build && npm run check:js-budget`
Expected: tests PASS; the check prints a size and exits 0. If `.next/server/app/index.html` does not exist in this Next.js version, find the prerendered HTML for `/` (`find .next/server -name "index.html"`) and fix the path in the script before going on. If the page is over budget, stop and report the largest chunks; do not raise the budget without the user's agreement.

- [ ] **Step 4: Add it to CI**

In `.github/workflows/ci.yml`, job `web`, after `- run: npm run build`:

```yaml
      - run: npm run check:js-budget
```

- [ ] **Step 5: Commit**

```bash
git add frontend .github
git commit -m "ci(perf): enforce the 130 kB first-load JS budget"
```

### Task 14: Lighthouse CI

**Files:**
- Create: `frontend/lighthouserc.json`
- Modify: `frontend/package.json` (devDependency, script `lhci`), `.github/workflows/ci.yml`, `frontend/.gitignore` (`.lighthouseci/`)

**Interfaces:**
- Consumes: the production build (`npm run build && npm run start`).
- Produces: CI job `lighthouse` asserting the spec's targets.

- [ ] **Step 1: Install and configure**

```bash
cd frontend
npm i -D @lhci/cli@0.15
```

Add `"lhci": "lhci autorun"` to `scripts`, and `.lighthouseci/` to `frontend/.gitignore`.

`frontend/lighthouserc.json`:

```json
{
  "ci": {
    "collect": {
      "startServerCommand": "npm run start",
      "startServerReadyPattern": "Ready",
      "url": ["http://localhost:3000/"],
      "numberOfRuns": 3
    },
    "assert": {
      "assertions": {
        "categories:performance": ["error", { "minScore": 0.95 }],
        "categories:accessibility": ["error", { "minScore": 1 }],
        "categories:best-practices": ["error", { "minScore": 1 }],
        "categories:seo": ["error", { "minScore": 1 }],
        "largest-contentful-paint": ["error", { "maxNumericValue": 1800 }],
        "cumulative-layout-shift": ["error", { "maxNumericValue": 0.02 }],
        "total-byte-weight": ["error", { "maxNumericValue": 358400 }]
      }
    },
    "upload": { "target": "filesystem", "outputDir": ".lighthouseci" }
  }
}
```

Lighthouse uses mobile emulation by default, which is what the spec measures. `total-byte-weight` covers the first view only, so the CV is not included.

- [ ] **Step 2: Run it locally**

Run: `npm run build && npm run lhci`
Expected: all assertions pass. If one fails, read `.lighthouseci/` for the failing audit and fix the cause (image sizes, font loading, contrast, metadata). Do not loosen a threshold without the user's agreement.

- [ ] **Step 3: Add the CI job**

Append to `jobs:` in `.github/workflows/ci.yml`:

```yaml
  lighthouse:
    name: Lighthouse CI
    needs: web
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: frontend
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 24
          cache: npm
          cache-dependency-path: frontend/package-lock.json
      - run: npm ci
      - run: npm run build
      - run: npm run lhci
      - if: always()
        uses: actions/upload-artifact@v4
        with:
          name: lighthouse-report
          path: frontend/.lighthouseci
```

- [ ] **Step 4: Commit, PR, merge, verify**

```bash
git add frontend .github
git commit -m "ci(perf): Lighthouse CI with the spec's score and metric budgets"
git push -u origin chore/perf-budgets
```

Open the PR, wait for all three CI jobs to go green, squash-merge, run `SMOKE_URL=https://personal-website-bogdusik.vercel.app npm run test:smoke` against production, and tag `v2.1.0`.

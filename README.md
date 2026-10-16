# Bohdan Bozhenko — portfolio

Personal site: https://personal-website-bogdusik.vercel.app

A static one-page site in a "drawing set" style: four sheets (Index, Projects, About, Contact), one accent colour, mono labels. No loaders, no 3D, no tracking.

## Stack

Next.js 16 (App Router, prerendered), React 19, TypeScript 6, Tailwind CSS 4, Vitest + Testing Library, Vercel. The app lives in `frontend/`.

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
cd frontend
SMOKE_URL=https://personal-website-bogdusik.vercel.app npm run test:smoke
```

The smoke tests check the home page, the CV and the old CV URL redirect on the deployment, and that every external link on the site opens and is public. For a protected preview deployment, also set `VERCEL_BYPASS` to a Vercel protection-bypass secret.

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

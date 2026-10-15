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

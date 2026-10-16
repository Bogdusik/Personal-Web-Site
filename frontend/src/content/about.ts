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

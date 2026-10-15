import { describe, expect, it } from 'vitest';
import { externalLinks } from '@/content/links';
import { landedOnSamePage } from './link-check';

const base = process.env.SMOKE_URL?.replace(/\/$/, '');
if (!base) throw new Error('Set SMOKE_URL to the deployment to check, e.g. https://personal-website-bogdusik.vercel.app');

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
    expect(res.headers.get('content-disposition')).toContain('filename="Bohdan_Bozhenko_CV.pdf"');
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
    expect(landedOnSamePage(link, res.url), `${link} ended on ${res.url}`).toBe(true);
  });
});

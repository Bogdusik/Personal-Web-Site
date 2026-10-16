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

  it('shows no CI badge for FLYON while its build is red and tsc is not in CI (FLYON#10)', () => {
    expect(projects.find((p) => p.id === 'flyon')?.ci).toBeUndefined();
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

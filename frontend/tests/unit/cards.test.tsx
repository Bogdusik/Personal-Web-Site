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

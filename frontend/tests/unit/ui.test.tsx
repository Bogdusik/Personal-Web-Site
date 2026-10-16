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

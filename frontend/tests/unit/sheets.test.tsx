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

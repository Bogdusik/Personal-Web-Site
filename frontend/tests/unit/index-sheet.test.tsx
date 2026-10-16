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

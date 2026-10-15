import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import Home from '@/app/page';

it('renders the name as the only h1 inside #main', () => {
  const { container } = render(<Home />);
  expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
  expect(container.querySelector('main#main h1')?.textContent).toBe('Bohdan Bozhenko');
});

import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import Home from '@/app/page';

it('renders the name as the only h1', () => {
  render(<Home />);
  expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
  expect(screen.getByRole('heading', { level: 1, name: 'Bohdan Bozhenko' })).toBeInTheDocument();
});

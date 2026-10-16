import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { SystemDiagram } from '@/components/diagram/SystemDiagram';

it('exposes the flow as one described image', () => {
  render(<SystemDiagram />);
  const figure = screen.getByRole('img', { name: /SearchWork system diagram/ });
  expect(figure.getAttribute('aria-label')).toMatch(/Claude API for CV parsing, match scoring and cover letters/);
});

it('draws every node and edge label', () => {
  const { container } = render(<SystemDiagram />);
  for (const text of ['NEXT.JS', 'FASTAPI', 'POSTGRESQL', 'CLAUDE API', '11 JOB-BOARD APIS', 'JWT + GOOGLE OAUTH', 'ASYNC ORM', 'LLM', 'INGEST']) {
    expect(container.textContent).toContain(text);
  }
});

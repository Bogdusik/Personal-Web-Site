import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { AboutSheet } from '@/components/sheets/AboutSheet';
import { ContactSheet } from '@/components/sheets/ContactSheet';
import { MetaLine } from '@/components/ui/MetaLine';

// Layout cannot be measured in jsdom; the 44px minimum is the min-h-11 utility. Stage 3's Playwright run measures it.
const TOUCH = 'min-h-11';

it('gives the SECURITY AUDIT link a 44px touch target', () => {
  render(<MetaLine code="P-02" right="CI ✓ · 483 TESTS" link={{ text: 'SECURITY AUDIT', href: 'https://example.com' }} />);
  expect(screen.getByRole('link', { name: /SECURITY AUDIT/ })).toHaveClass(TOUCH);
});

it('gives the direct-line links a 44px touch target', () => {
  render(<ContactSheet />);
  for (const name of ['bogdyn6@gmail.com', /in\/bohdan-bozhenko/, /Bogdusik/]) {
    expect(screen.getByRole('link', { name })).toHaveClass(TOUCH);
  }
});

it('gives the article titles a 44px touch target', () => {
  render(<AboutSheet />);
  expect(screen.getByRole('link', { name: /Telemetry Pipeline Was Still Quadratic/ })).toHaveClass(TOUCH);
  expect(screen.getByRole('link', { name: /AI Job Tracker/ })).toHaveClass(TOUCH);
});

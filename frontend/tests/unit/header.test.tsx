import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { MobileMenu } from '@/components/header/MobileMenu';
import { SiteHeader } from '@/components/header/SiteHeader';

const links = [
  { href: '#projects', label: '02 Projects' },
  { href: '#contact', label: '04 Contact' },
];

describe('MobileMenu', () => {
  it('starts closed and toggles aria-expanded', async () => {
    const user = userEvent.setup();
    render(<MobileMenu links={links} />);
    const button = screen.getByRole('button', { name: /menu/i });
    expect(button).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('link', { name: '02 Projects' })).toBeNull();
    await user.click(button);
    expect(button).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('link', { name: '02 Projects' })).toBeVisible();
  });

  it('closes on Escape and returns focus to the button', async () => {
    const user = userEvent.setup();
    render(<MobileMenu links={links} />);
    const button = screen.getByRole('button', { name: /menu/i });
    await user.click(button);
    await user.tab();
    expect(screen.getByRole('link', { name: '02 Projects' })).toHaveFocus();
    await user.keyboard('{Escape}');
    expect(button).toHaveAttribute('aria-expanded', 'false');
    expect(button).toHaveFocus();
  });

  it('closes when a link is chosen and on an outside click', async () => {
    const user = userEvent.setup();
    render(<div><MobileMenu links={links} /><p>outside</p></div>);
    const button = screen.getByRole('button', { name: /menu/i });
    await user.click(button);
    await user.click(screen.getByRole('link', { name: '04 Contact' }));
    expect(button).toHaveAttribute('aria-expanded', 'false');
    await user.click(button);
    await user.click(screen.getByText('outside'));
    expect(button).toHaveAttribute('aria-expanded', 'false');
  });
});

describe('SiteHeader', () => {
  it('shows the status and a contact link', () => {
    render(<SiteHeader />);
    expect(screen.getAllByText('AVAILABLE — IMMEDIATE START').length).toBeGreaterThan(0);
    expect(screen.getByRole('link', { name: /CONTACT/ })).toHaveAttribute('href', '#contact');
  });
});

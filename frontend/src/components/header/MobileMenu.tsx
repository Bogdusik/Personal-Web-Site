'use client';

import { useEffect, useId, useRef, useState } from 'react';

export type MenuLink = { href: string; label: string; download?: string };

export function MobileMenu({ links }: { links: MenuLink[] }) {
  const [open, setOpen] = useState(false);
  const navId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setOpen(false);
      buttonRef.current?.focus();
    };
    const onPointer = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onPointer);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onPointer);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative h-full">
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={navId}
        onClick={() => setOpen((value) => !value)}
        className="flex h-full w-full items-center justify-center gap-2 label-mono font-medium text-accent"
      >
        MENU
        <svg aria-hidden="true" width="16" height="10" viewBox="0 0 16 10" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M0 1h16M0 9h16" />
        </svg>
      </button>
      <nav id={navId} hidden={!open} aria-label="Site" className="absolute top-full right-0 z-40 w-64 border border-rule bg-paper">
        <ul>
          {links.map((link) => (
            <li key={link.href} className="border-b border-rule last:border-b-0">
              <a
                href={link.href}
                download={link.download}
                onClick={() => setOpen(false)}
                className="flex min-h-12 items-center px-4 label-mono font-medium hover:text-accent"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

import type { ReactNode } from 'react';

type Props = { id: string; labelledBy?: string; className?: string; children: ReactNode };

export function Sheet({ id, labelledBy, className = '', children }: Props) {
  return (
    <section id={id} aria-labelledby={labelledBy} className={`mx-2 mb-2 border border-rule ${className}`}>
      {children}
    </section>
  );
}

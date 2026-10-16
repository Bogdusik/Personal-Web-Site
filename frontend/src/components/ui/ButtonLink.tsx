import type { ReactNode } from 'react';

type Props = {
  href: string;
  children: ReactNode;
  variant?: 'solid' | 'outline';
  download?: string;
  className?: string;
};

export function ButtonLink({ href, children, variant = 'outline', download, className = '' }: Props) {
  const look =
    variant === 'solid'
      ? 'border-accent bg-accent text-paper hover:border-ink hover:bg-ink'
      : 'border-ink text-ink hover:bg-ink hover:text-paper';
  return (
    <a
      href={href}
      download={download}
      className={`inline-flex min-h-12 items-center justify-center border px-5.5 font-mono text-[13px] font-medium tracking-[0.06em] ${look} ${className}`}
    >
      {children}
    </a>
  );
}

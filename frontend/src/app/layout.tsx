import type { Metadata } from 'next';
import { IBM_Plex_Mono, Schibsted_Grotesk } from 'next/font/google';
import type { ReactNode } from 'react';
import { SkipLink } from '@/components/ui/SkipLink';
import './globals.css';

const sans = Schibsted_Grotesk({ subsets: ['latin'], weight: ['400', '500', '600'], variable: '--font-schibsted', display: 'swap' });
const mono = IBM_Plex_Mono({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-plex-mono', display: 'swap' });

export const metadata: Metadata = {
  title: 'Bohdan Bozhenko — Backend / AI Engineer',
  description:
    'Backend / AI engineer in Scotland. Python / FastAPI, Spring Boot, PostgreSQL and LLM-powered products. First Class BSc Computing, available immediately.',
  icons: { icon: '/favicon.svg' },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en-GB" className={`${sans.variable} ${mono.variable}`}>
      <body className="antialiased">
        <SkipLink />
        {children}
      </body>
    </html>
  );
}

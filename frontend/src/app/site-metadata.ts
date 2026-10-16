import type { Metadata } from 'next';
import { SITE_URL } from '@/content/site';

const title = 'Bohdan Bozhenko — Backend / AI Engineer';
const description =
  'Backend / AI engineer in Scotland. Python / FastAPI, Spring Boot, PostgreSQL and LLM-powered products. First Class BSc Computing, available immediately.';

export const siteMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title,
  description,
  alternates: { canonical: '/' },
  icons: { icon: '/favicon.svg' },
  openGraph: { type: 'profile', url: '/', title, description, siteName: 'Bohdan Bozhenko', locale: 'en_GB' },
  twitter: { card: 'summary_large_image', title, description },
};

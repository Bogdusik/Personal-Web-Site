import { expect, it } from 'vitest';
import robots from '@/app/robots';
import { siteMetadata } from '@/app/site-metadata';
import sitemap from '@/app/sitemap';
import { personJsonLd } from '@/content/jsonld';
import { SITE_URL } from '@/content/site';

it('sets canonical, Open Graph and Twitter metadata', () => {
  expect(siteMetadata.metadataBase?.toString()).toBe(`${SITE_URL}/`);
  expect(siteMetadata.alternates?.canonical).toBe('/');
  expect(siteMetadata.openGraph).toMatchObject({ type: 'profile', url: '/', title: 'Bohdan Bozhenko — Backend / AI Engineer' });
  expect(siteMetadata.twitter).toMatchObject({ card: 'summary_large_image' });
});

it('describes a Person with the profile links', () => {
  const ld = personJsonLd();
  expect(ld).toMatchObject({
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Bohdan Bozhenko',
    jobTitle: 'Backend / AI Engineer',
    alumniOf: { '@type': 'CollegeOrUniversity', name: 'Glasgow Caledonian University' },
    address: { '@type': 'PostalAddress', addressLocality: 'Dumfries', addressCountry: 'GB' },
  });
  expect(ld.sameAs).toEqual(['https://github.com/Bogdusik', 'https://www.linkedin.com/in/bohdan-bozhenko/']);
});

it('lists the home page in the sitemap and points robots at it', () => {
  expect(sitemap()).toEqual([{ url: `${SITE_URL}/`, changeFrequency: 'monthly', priority: 1 }]);
  expect(robots()).toEqual({ rules: [{ userAgent: '*', allow: '/' }], sitemap: `${SITE_URL}/sitemap.xml` });
});

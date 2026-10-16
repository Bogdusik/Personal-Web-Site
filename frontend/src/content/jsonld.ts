import { profile } from './profile';
import { SITE_URL } from './site';

export function personJsonLd(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: profile.name,
    jobTitle: profile.role,
    url: SITE_URL,
    email: `mailto:${profile.email}`,
    alumniOf: { '@type': 'CollegeOrUniversity', name: 'Glasgow Caledonian University' },
    address: { '@type': 'PostalAddress', addressLocality: 'Dumfries', addressCountry: 'GB' },
    sameAs: [profile.github, profile.linkedin],
  };
}

import { profile } from './profile';
import { projects } from './projects';
import { articles } from './writing';

export function externalLinks(): string[] {
  const all = [
    profile.github,
    profile.linkedin,
    ...projects.flatMap((p) => [...Object.values(p.links), p.ci?.link?.href]),
    ...articles.map((a) => a.url),
  ];
  return [...new Set(all.filter((l): l is string => Boolean(l)))];
}

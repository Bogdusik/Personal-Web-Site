import type { ProjectLinks as Links } from '@/content/types';

const ITEMS = [
  { key: 'repo', text: 'REPO' },
  { key: 'live', text: 'LIVE' },
  { key: 'demo', text: 'DEMO GIF' },
  { key: 'article', text: 'ARTICLE' },
] as const;

export function ProjectLinks({ title, links, className = '' }: { title: string; links: Links; className?: string }) {
  return (
    <ul className={`flex flex-wrap gap-x-5 label-mono font-medium text-accent ${className}`}>
      {ITEMS.filter((item) => links[item.key]).map((item) => (
        <li key={item.key}>
          <a href={links[item.key]} className="inline-flex min-h-11 items-center hover:underline">
            {item.text}
            <span aria-hidden="true">&nbsp;↗</span>
            <span className="sr-only"> — {title}</span>
          </a>
        </li>
      ))}
    </ul>
  );
}

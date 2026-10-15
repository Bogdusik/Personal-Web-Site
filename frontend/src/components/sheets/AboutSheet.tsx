import { Sheet } from '@/components/ui/Sheet';
import { about } from '@/content/about';
import { formatMonthYear } from '@/content/format';
import { articles } from '@/content/writing';
import { SheetBand } from './SheetBand';

function BlockLabel({ children }: { children: string }) {
  return <h3 className="mb-3.5 label-mono text-accent">{children}</h3>;
}

export function AboutSheet() {
  return (
    <Sheet id="about" labelledBy="about-title">
      <SheetBand
        number="03"
        title="About"
        headingId="about-title"
        aside={<span>EDUCATION, EXPERIENCE, WRITING AND THE TOOLS I SHIP WITH.</span>}
      />
      <div className="grid lg:grid-cols-[minmax(0,620px)_minmax(0,1fr)]">
        <div className="flex flex-col lg:border-r lg:border-rule">
          <div className="border-b border-rule px-4 py-5.5 lg:px-10 lg:py-9">
            <p className="text-[19px] leading-[1.45] tracking-[-0.01em] lg:text-2xl">{about.bio[0]}</p>
            <p className="mt-3.5 text-[15px] leading-[1.6] text-ink-3 lg:mt-4.5 lg:text-[17px]">{about.bio[1]}</p>
          </div>
          <div className="border-b border-rule px-4 py-5.5 lg:px-10">
            <BlockLabel>EXPERIENCE</BlockLabel>
            {about.experience.map((item) => (
              <div key={item.org} className="grid gap-1 lg:grid-cols-[120px_minmax(0,1fr)] lg:gap-3">
                <p className="label-mono text-muted">{item.dates}</p>
                <div>
                  <p className="text-[19px] font-semibold">{item.org}</p>
                  <p className="mt-1 text-[15px] leading-normal text-ink-3">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="border-b border-rule px-4 py-5.5 lg:border-b-0 lg:px-10">
            <BlockLabel>WRITING</BlockLabel>
            <ul className="grid gap-4">
              {articles.map((article) => (
                <li key={article.url} className="grid gap-1 lg:grid-cols-[120px_minmax(0,1fr)] lg:gap-3">
                  <p className="label-mono text-muted">{formatMonthYear(article.published)}</p>
                  <div className="min-w-0">
                    <a href={article.url} className="text-[17px] leading-snug font-semibold break-words hover:text-accent">
                      {article.title}
                    </a>
                    <p className="mt-1 label-mono text-muted">
                      {article.publication.toUpperCase()}
                      {article.topStory ? ' · TOP STORY' : ''}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div>
          <div className="border-b border-rule px-4 py-5.5 lg:px-10 lg:pt-8">
            <BlockLabel>EDUCATION</BlockLabel>
            <ul>
              {about.education.map((item) => (
                <li key={item.school} className="grid gap-0.5 border-t border-rule py-2.5 last:border-b lg:grid-cols-[112px_minmax(0,1fr)_minmax(0,1fr)] lg:gap-3">
                  <span className="font-mono text-[11.5px] text-muted">{item.years}</span>
                  <span className="font-semibold">{item.school}</span>
                  <span>
                    {item.award}
                    {item.highlight && (
                      <>
                        {' — '}
                        <span className="font-medium text-accent">{item.highlight}</span>
                      </>
                    )}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-3 label-mono text-muted">+ {about.certificate}</p>
          </div>
          <div className="px-4 py-5.5 lg:px-10 lg:py-7">
            <BlockLabel>TOOLS</BlockLabel>
            <dl className="grid gap-x-3 gap-y-2.5 font-mono text-[11px] leading-[1.5] tracking-[0.03em] lg:grid-cols-[112px_minmax(0,1fr)] lg:text-[12px]">
              {about.tools.map((group) => (
                <div key={group.group} className="contents">
                  <dt className="text-muted">{group.group}</dt>
                  <dd className="break-words">{group.items.join(' · ')}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </Sheet>
  );
}

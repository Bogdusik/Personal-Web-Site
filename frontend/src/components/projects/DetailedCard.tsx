import { MetaLine } from '@/components/ui/MetaLine';
import { ProjectLinks } from '@/components/ui/ProjectLinks';
import { metaRight } from '@/content/format';
import type { Project } from '@/content/types';

export function DetailedCard({ project }: { project: Project }) {
  return (
    <article id={project.id} className="flex h-full min-w-0 flex-col px-4 py-6 lg:px-10 lg:py-8">
      <MetaLine code={project.code} right={metaRight(project)} link={project.ci?.link} />
      <h3 className="mt-2.5 text-2xl font-semibold tracking-[-0.025em] lg:mt-3.5 lg:text-[32px]">{project.title}</h3>
      <p className="mt-2 text-[15px] leading-normal text-ink-2 lg:text-base">{project.summary}</p>
      <p className="mt-3 label-mono tracking-[0.04em] break-words">{project.stack.join(' · ')}</p>
      {project.hardPart && (
        <div className="mt-4 grid gap-1.5 border-t border-dashed border-rule pt-3.5 lg:grid-cols-[96px_minmax(0,1fr)] lg:gap-3">
          <p className="label-mono text-accent">HARD PART</p>
          <p className="text-sm leading-[1.55] text-ink-3 lg:text-[14.5px]">{project.hardPart}</p>
        </div>
      )}
      <ProjectLinks title={project.title} links={project.links} className="mt-auto pt-3" />
    </article>
  );
}

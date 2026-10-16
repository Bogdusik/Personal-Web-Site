import { MetaLine } from '@/components/ui/MetaLine';
import { ProjectLinks } from '@/components/ui/ProjectLinks';
import { metaRight } from '@/content/format';
import type { Project } from '@/content/types';

export function FeaturedCard({ project }: { project: Project }) {
  return (
    <article id={project.id} className="flex h-full min-w-0 flex-col px-7 py-6">
      <MetaLine code={project.code} right={metaRight(project)} link={project.ci?.link} />
      <h3 className="mt-3.5 text-[26px] font-semibold tracking-[-0.02em]">{project.title}</h3>
      <p className="mt-2 text-sm leading-normal text-ink-3">{project.summary}</p>
      <p className="mt-auto pt-2.5 label-mono tracking-[0.04em] break-words">{project.stack.join(' · ')}</p>
      <ProjectLinks title={project.title} links={project.links} className="mt-1" />
    </article>
  );
}

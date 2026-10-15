import { ProjectLinks } from '@/components/ui/ProjectLinks';
import { metaRight } from '@/content/format';
import type { Project } from '@/content/types';

export function FeaturedRow({ project }: { project: Project }) {
  return (
    <details className="group border-b border-rule">
      <summary className="grid min-h-16 cursor-pointer list-none grid-cols-[44px_minmax(0,1fr)_16px] items-center px-3.5 py-3 [&::-webkit-details-marker]:hidden">
        <span className="label-mono text-[10.5px] text-accent">{project.code}</span>
        <span className="min-w-0">
          <span className="block text-lg font-semibold tracking-[-0.01em]">{project.title}</span>
          <span className="mt-0.5 block font-mono text-[10px] tracking-[0.04em] break-words text-muted">
            {project.stack.join(' · ')}
          </span>
        </span>
        <span aria-hidden="true" className="text-accent group-open:rotate-90">→</span>
      </summary>
      <div className="pr-3.5 pb-4 pl-[58px]">
        <p className="label-mono text-[10.5px] text-muted">
          {metaRight(project)}
          {project.ci?.link && (
            <>
              {' · '}
              <a href={project.ci.link.href} className="text-accent hover:underline">
                {project.ci.link.text}
                <span aria-hidden="true">&nbsp;↗</span>
              </a>
            </>
          )}
        </p>
        <p className="mt-1.5 text-[15px] leading-normal text-ink-3">{project.summary}</p>
        <ProjectLinks title={project.title} links={project.links} className="mt-1" />
      </div>
    </details>
  );
}

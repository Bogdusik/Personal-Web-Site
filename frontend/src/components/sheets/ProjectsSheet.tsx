import { DetailedCard } from '@/components/projects/DetailedCard';
import { Sheet } from '@/components/ui/Sheet';
import { otherProjects } from '@/content/projects';
import { profile } from '@/content/profile';
import { SheetBand } from './SheetBand';

export function ProjectsSheet() {
  return (
    <Sheet id="projects" labelledBy="projects-title">
      <SheetBand
        number="02"
        title="Projects"
        headingId="projects-title"
        aside={<span>FOUR MORE BUILDS. EACH CARD NAMES ONE PROBLEM I HAD TO SOLVE.</span>}
      />
      <div className="grid lg:grid-cols-2">
        {otherProjects.map((project, index) => (
          <div
            key={project.id}
            className={`border-b border-rule ${index % 2 === 0 ? 'lg:border-r' : ''} ${index >= 2 ? 'lg:border-b-0' : ''}`}
          >
            <DetailedCard project={project} />
          </div>
        ))}
      </div>
      <a href={profile.github} className="flex min-h-12 items-center border-t border-rule px-4 label-mono font-medium text-accent lg:px-10">
        ALL REPOSITORIES ON GITHUB <span aria-hidden="true">&nbsp;↗</span>
      </a>
    </Sheet>
  );
}

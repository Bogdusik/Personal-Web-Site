import { SystemDiagram } from '@/components/diagram/SystemDiagram';
import { FeaturedCard } from '@/components/projects/FeaturedCard';
import { FeaturedRow } from '@/components/projects/FeaturedRow';
import { Sheet } from '@/components/ui/Sheet';
import { featuredProjects } from '@/content/projects';
import { profile } from '@/content/profile';
import { Hero } from './Hero';
import { SpecTable } from './SpecTable';

export function IndexSheet() {
  return (
    <Sheet id="index" className="border-t-0">
      <div className="grid lg:grid-cols-[repeat(3,minmax(0,1fr))_minmax(0,440px)]">
        <div className="order-1 lg:order-none lg:col-span-2">
          <Hero />
        </div>
        <div className="order-6 border-t border-rule lg:order-none lg:col-span-2 lg:border-t-0 lg:border-l">
          <SystemDiagram />
        </div>
        <h2 id="selected-work" className="sr-only">Selected work</h2>
        {featuredProjects.map((project, index) => (
          <div key={project.id} className={`hidden border-t border-rule lg:block ${index > 0 ? 'lg:border-l' : ''}`}>
            <FeaturedCard project={project} />
          </div>
        ))}
        <div className="order-2 px-4 pt-4 lg:order-none lg:border-t lg:border-l lg:border-rule lg:px-7 lg:py-6">
          <SpecTable rows={profile.spec} />
        </div>
        <div className="order-3 mt-5 border-t border-rule lg:hidden">
          <p aria-hidden="true" className="border-b border-rule px-3.5 py-2.5 label-mono text-[10.5px] text-muted">SELECTED WORK — 03</p>
          {featuredProjects.map((project) => (
            <FeaturedRow key={project.id} project={project} />
          ))}
        </div>
      </div>
    </Sheet>
  );
}

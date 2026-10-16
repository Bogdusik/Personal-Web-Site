import { SiteHeader } from '@/components/header/SiteHeader';
import { AboutSheet } from '@/components/sheets/AboutSheet';
import { ContactSheet } from '@/components/sheets/ContactSheet';
import { IndexSheet } from '@/components/sheets/IndexSheet';
import { ProjectsSheet } from '@/components/sheets/ProjectsSheet';

export default function Home() {
  return (
    <>
      <div className="mx-2 mt-2 border-x border-t border-rule">
        <SiteHeader />
      </div>
      <main id="main" tabIndex={-1} className="outline-none">
        <IndexSheet />
        <ProjectsSheet />
        <AboutSheet />
        <ContactSheet />
      </main>
    </>
  );
}

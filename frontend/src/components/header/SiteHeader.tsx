import { Dot } from '@/components/ui/Dot';
import { profile } from '@/content/profile';
import { MobileMenu, type MenuLink } from './MobileMenu';

const menuLinks: MenuLink[] = [
  { href: '#projects', label: '02 PROJECTS' },
  { href: '#about', label: '03 ABOUT' },
  { href: '#contact', label: '04 CONTACT' },
  { href: profile.cvPath, label: 'DOWNLOAD CV', download: profile.cvDownloadName },
  { href: profile.github, label: 'GITHUB' },
  { href: profile.linkedin, label: 'LINKEDIN' },
];

export function SiteHeader() {
  return (
    <header>
      <div className="grid h-12 grid-cols-[minmax(0,1fr)_96px] border-b border-rule lg:h-14 lg:grid-cols-[minmax(0,1fr)_220px_320px_160px]">
        <a href="#index" className="flex items-center px-3.5 label-mono font-medium lg:px-6">
          <span className="lg:hidden">B. BOZHENKO — SHEET 01</span>
          <span className="hidden lg:inline">BOHDAN BOZHENKO — PORTFOLIO</span>
        </a>
        <p className="hidden items-center border-l border-rule px-5 label-mono text-muted lg:flex">SHEET 01 / 04 — INDEX</p>
        <p className="hidden items-center gap-2.5 border-l border-rule px-5 label-mono font-medium lg:flex">
          <Dot />
          {profile.status}
        </p>
        <a href="#contact" className="hidden items-center justify-between border-l border-rule px-5 label-mono font-medium text-accent lg:flex">
          CONTACT <span aria-hidden="true">→</span>
        </a>
        <div className="border-l border-rule lg:hidden">
          <MobileMenu links={menuLinks} />
        </div>
      </div>
      <p className="flex h-8.5 items-center gap-2.5 border-b border-rule px-3.5 label-mono text-[10.5px] font-medium lg:hidden">
        <Dot className="size-[7px]" />
        {profile.status}
      </p>
    </header>
  );
}

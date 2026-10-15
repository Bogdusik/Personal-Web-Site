import { ButtonLink } from '@/components/ui/ButtonLink';
import { Dot } from '@/components/ui/Dot';
import { Sheet } from '@/components/ui/Sheet';
import { profile } from '@/content/profile';
import { SheetBand } from './SheetBand';

const rowClass = 'border-t border-rule py-3.5 lg:py-3';

export function ContactSheet() {
  const mailto = `mailto:${profile.email}`;
  return (
    <Sheet id="contact" labelledBy="contact-title">
      <SheetBand
        number="04"
        title="Contact"
        headingId="contact-title"
        aside={
          <span className="flex items-center gap-2.5 font-medium text-ink">
            <Dot />
            {profile.status}
          </span>
        }
      />
      <div className="grid lg:grid-cols-[minmax(0,1fr)_560px]">
        <div className="flex flex-col justify-center border-b border-rule px-4 py-6 lg:border-b-0 lg:p-10">
          <p className="max-w-[680px] text-[32px] leading-[1.08] font-semibold tracking-[-0.035em] lg:text-[52px] lg:leading-[1.04] lg:tracking-[-0.04em]">
            Hiring for a backend or AI role in Scotland? <span className="text-accent">Let’s talk.</span>
          </p>
          <div className="mt-5 grid grid-cols-2 gap-2 lg:mt-8 lg:flex lg:gap-2.5">
            <ButtonLink href={mailto} variant="solid">
              EMAIL ME <span aria-hidden="true">&nbsp;↗</span>
            </ButtonLink>
            <ButtonLink href={profile.cvPath} download={profile.cvDownloadName}>
              DOWNLOAD CV <span aria-hidden="true">&nbsp;↓</span>
            </ButtonLink>
          </div>
        </div>
        <div className="px-4 pt-2 pb-5 font-mono text-[11px] tracking-[0.03em] lg:border-l lg:border-rule lg:p-10 lg:text-[12.5px]">
          <h3 className="mb-3.5 hidden label-mono text-accent lg:block">DIRECT LINES</h3>
          <dl className="grid grid-cols-[minmax(0,110px)_minmax(0,1fr)] lg:grid-cols-[130px_minmax(0,1fr)]">
            <dt className={`${rowClass} text-muted`}>EMAIL</dt>
            <dd className={rowClass}>
              <a href={mailto} className="font-medium break-all hover:text-accent">{profile.email}</a>
            </dd>
            <dt className={`${rowClass} text-muted`}>LINKEDIN</dt>
            <dd className={rowClass}>
              <a href={profile.linkedin} className="font-medium hover:text-accent">in/bohdan-bozhenko <span aria-hidden="true">↗</span></a>
            </dd>
            <dt className={`${rowClass} text-muted`}>GITHUB</dt>
            <dd className={rowClass}>
              <a href={profile.github} className="font-medium hover:text-accent">Bogdusik <span aria-hidden="true">↗</span></a>
            </dd>
            <dt className={`${rowClass} text-muted`}>LOCATION</dt>
            <dd className={`${rowClass} break-words`}>{profile.location}</dd>
            <dt className={`${rowClass} border-b text-muted`}>RIGHT TO WORK</dt>
            <dd className={`${rowClass} border-b`}>{profile.rightToWork}</dd>
          </dl>
        </div>
      </div>
      <footer className="grid border-t border-rule font-mono text-[10px] tracking-[0.06em] text-muted lg:h-14 lg:grid-cols-[minmax(0,1fr)_320px_220px_180px] lg:text-[11px]">
        <span className="flex items-center px-4 py-3 lg:px-6 lg:py-0">© 2026 BOHDAN BOZHENKO</span>
        <span className="hidden items-center border-l border-rule px-5 lg:flex">BUILT WITH NEXT.JS + TYPESCRIPT</span>
        <span className="hidden items-center border-l border-rule px-5 lg:flex">END OF DRAWING SET</span>
        <a href="#index" className="flex min-h-12 items-center justify-between border-t border-rule px-4 font-medium text-accent lg:border-t-0 lg:border-l lg:px-5">
          BACK TO TOP <span aria-hidden="true">↑</span>
        </a>
      </footer>
    </Sheet>
  );
}

import { ButtonLink } from '@/components/ui/ButtonLink';
import { profile } from '@/content/profile';

export function Hero() {
  const [first, last] = profile.name.split(' ');
  return (
    <div className="px-4 pt-5 lg:px-12 lg:pt-9 lg:pb-10">
      <p className="label-mono text-[10.5px] text-muted lg:text-[12px]">
        WELCOME <span aria-hidden="true" className="lg:hidden">----------</span>
        <span aria-hidden="true" className="hidden lg:inline">------------------------------</span> BACKEND / AI ENGINEERING
      </p>
      <h1 className="mt-3.5 text-[52px] leading-[0.94] font-semibold tracking-[-0.045em] lg:mt-5 lg:text-[104px] lg:leading-[0.92]">
        <span className="block">{first}</span> <span className="block">{last}</span>
      </h1>
      <p className="mt-3.5 flex items-center gap-2.5 text-[22px] font-medium tracking-[-0.01em] text-accent lg:mt-4.5 lg:gap-3.5 lg:text-[34px] lg:tracking-[-0.02em]">
        <span aria-hidden="true" className="size-2.5 bg-accent lg:size-3" />
        {profile.role}
      </p>
      <p className="mt-2 text-[15px] font-medium text-ink-2 lg:mt-3 lg:text-xl">{profile.stackLine}</p>
      <div className="mt-5 grid grid-cols-2 gap-2 lg:mt-7 lg:flex lg:gap-2.5">
        <ButtonLink href={profile.cvPath} download={profile.cvDownloadName} variant="solid" className="col-span-2">
          DOWNLOAD CV <span aria-hidden="true">&nbsp;↓</span>
        </ButtonLink>
        <ButtonLink href={profile.github}>
          GITHUB <span aria-hidden="true">&nbsp;↗</span>
        </ButtonLink>
        <ButtonLink href={profile.linkedin}>
          LINKEDIN <span aria-hidden="true">&nbsp;↗</span>
        </ButtonLink>
      </div>
    </div>
  );
}

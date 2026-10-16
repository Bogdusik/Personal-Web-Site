import type { ReactNode } from 'react';

type Props = { number: '02' | '03' | '04'; title: string; headingId: string; aside?: ReactNode };

export function SheetBand({ number, title, headingId, aside }: Props) {
  return (
    <div className="grid grid-cols-[72px_minmax(0,1fr)] border-b border-rule lg:min-h-[150px] lg:grid-cols-[220px_minmax(0,1fr)_400px]">
      <div className="flex flex-col justify-between border-r border-rule p-3.5 lg:px-6 lg:py-5.5">
        <span className="hidden label-mono text-muted lg:block">SHEET {number} / 04</span>
        <span aria-hidden="true" className="font-mono text-[30px] leading-none text-accent lg:text-[56px] lg:tracking-[-0.02em]">{number}</span>
      </div>
      <div className="flex flex-col justify-end px-4 py-3.5 lg:px-10 lg:py-5.5">
        <p className="label-mono text-[10px] text-muted lg:hidden">SHEET {number} / 04</p>
        <h2 id={headingId} className="mt-1.5 text-[40px] leading-none font-semibold tracking-[-0.04em] lg:mt-0 lg:text-[72px] lg:leading-[0.95] lg:tracking-[-0.045em]">
          {title}
        </h2>
      </div>
      {aside && (
        <div className="hidden flex-col justify-end gap-2.5 border-l border-rule px-7 py-5.5 font-mono text-[11.5px] leading-[1.6] tracking-[0.04em] text-ink-3 lg:flex">
          {aside}
        </div>
      )}
    </div>
  );
}

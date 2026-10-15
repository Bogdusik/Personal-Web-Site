import type { SpecRow } from '@/content/types';

export function SpecTable({ rows }: { rows: SpecRow[] }) {
  return (
    <div className="font-mono text-[10.5px] leading-[1.7] tracking-[0.03em] lg:text-[11.5px] lg:leading-[1.75]">
      <p aria-hidden="true" className="mb-2.5 hidden tracking-[0.06em] text-muted lg:block">SPEC --------------------------------------</p>
      <dl className="grid grid-cols-[84px_minmax(0,1fr)] lg:grid-cols-[116px_minmax(0,1fr)]">
        {rows.map((row) => (
          <div key={row.label} className={row.mobile ? 'contents' : 'hidden lg:contents'}>
            <dt className="text-muted">{row.label}</dt>
            <dd className="break-words">: {row.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

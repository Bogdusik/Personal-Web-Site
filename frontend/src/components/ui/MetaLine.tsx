type MetaLink = { text: string; href: string };

export function MetaLine({ code, right, link }: { code: string; right: string; link?: MetaLink }) {
  return (
    <p className="flex justify-between gap-3 label-mono text-muted">
      <span className="shrink-0 whitespace-nowrap text-accent">{code}</span>
      <span className="text-right">
        <span>{right}</span>
        {link && (
          <>
            {' · '}
            <a href={link.href} className="inline-flex min-h-11 items-center text-accent hover:underline">
              {link.text}
              <span aria-hidden="true">&nbsp;↗</span>
            </a>
          </>
        )}
      </span>
    </p>
  );
}

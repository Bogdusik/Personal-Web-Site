import Link from 'next/link';

export default function NotFound() {
  return (
    <main id="main" className="m-2 border border-rule px-4 py-16 lg:px-12">
      <p className="label-mono text-muted">SHEET 404 — NOT IN THIS DRAWING SET</p>
      <h1 className="mt-4 text-[52px] leading-none font-semibold tracking-[-0.045em] lg:text-[96px]">Page not found</h1>
      <Link href="/" className="mt-8 inline-flex min-h-12 items-center border border-ink px-5.5 label-mono font-medium hover:bg-ink hover:text-paper">
        BACK TO SHEET 01 <span aria-hidden="true">&nbsp;→</span>
      </Link>
    </main>
  );
}

export function Dot({ className = '' }: { className?: string }) {
  return <span aria-hidden="true" className={`inline-block size-2 shrink-0 rounded-full bg-accent ${className}`} />;
}

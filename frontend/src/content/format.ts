import type { CiBadge, Project } from './types';

const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

export function formatCi(ci: CiBadge): string {
  return `CI ✓ · ${ci.tests} TESTS${ci.note ? ` · ${ci.note}` : ''}`;
}

export function metaRight(p: Project): string {
  return p.ci ? formatCi(p.ci) : p.tag;
}

export function formatMonthYear(iso: string): string {
  const [year, month] = iso.split('-');
  return `${MONTHS[Number(month) - 1]} ${year}`;
}

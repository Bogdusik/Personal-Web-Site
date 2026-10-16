import { expect, it } from 'vitest';
import { formatCi, formatMonthYear, metaRight } from '@/content/format';
import type { Project } from '@/content/types';

const base: Project = {
  id: 'x', code: 'P-09', title: 'X', tag: 'TAG', summary: 's', stack: [], links: { repo: 'https://github.com/Bogdusik/x' }, placement: 'projects',
};

it('formats a CI badge with and without a note', () => {
  expect(formatCi({ testsRunInCi: true, tests: 49 })).toBe('CI ✓ · 49 TESTS');
  expect(formatCi({ testsRunInCi: true, tests: 23, note: 'TESTCONTAINERS' })).toBe('CI ✓ · 23 TESTS · TESTCONTAINERS');
});

it('uses the CI badge for the meta line when there is one, else the tag', () => {
  expect(metaRight(base)).toBe('TAG');
  expect(metaRight({ ...base, ci: { testsRunInCi: true, tests: 483 } })).toBe('CI ✓ · 483 TESTS');
});

it('formats ISO dates as MON YYYY', () => {
  expect(formatMonthYear('2026-10-06')).toBe('OCT 2026');
  expect(formatMonthYear('2026-09-02')).toBe('SEP 2026');
});

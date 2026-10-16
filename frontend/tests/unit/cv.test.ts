import { readFileSync } from 'node:fs';
import path from 'node:path';
import { expect, it } from 'vitest';

it('ships the CV that every CV link points at', () => {
  const pdf = readFileSync(path.join(process.cwd(), 'public', 'cv.pdf'));
  expect(pdf.subarray(0, 5).toString('latin1')).toBe('%PDF-');
});

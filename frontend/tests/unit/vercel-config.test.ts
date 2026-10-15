import { readFileSync } from 'node:fs';
import path from 'node:path';
import { expect, it } from 'vitest';

it('permanently redirects the old CV URL to /cv.pdf', () => {
  const config = JSON.parse(readFileSync(path.join(process.cwd(), 'vercel.json'), 'utf8'));
  expect(config.redirects).toContainEqual({ source: '/CV%20Bohdan%20Bozhenko.pdf', destination: '/cv.pdf', permanent: true });
});

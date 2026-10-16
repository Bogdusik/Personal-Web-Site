import { readFileSync } from 'node:fs';
import path from 'node:path';
import { expect, it } from 'vitest';

it('ships a grain tile that is a PNG under 8 KB', () => {
  const png = readFileSync(path.join(process.cwd(), 'public', 'grain.png'));
  expect(png.subarray(0, 8)).toEqual(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
  expect(png.length).toBeLessThan(8 * 1024);
});

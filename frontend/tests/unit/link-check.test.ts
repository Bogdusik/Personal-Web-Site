import { expect, it } from 'vitest';
import { landedOnSamePage } from '../smoke/link-check';

it('accepts the same page, a trailing slash and a changed query', () => {
  expect(landedOnSamePage('https://searchwork-bogdusik.vercel.app', 'https://searchwork-bogdusik.vercel.app/')).toBe(true);
  expect(landedOnSamePage('https://hackernoon.com/some-article', 'https://hackernoon.com/some-article?ref=x')).toBe(true);
});

it('rejects a moved article that redirects to the home page', () => {
  expect(landedOnSamePage('https://hackernoon.com/this-slug-does-not-exist', 'https://hackernoon.com/')).toBe(false);
});

it('rejects a deployment that redirects to a login page', () => {
  expect(landedOnSamePage('https://checkers-x.vercel.app', 'https://vercel.com/login?next=%2Fsso-api')).toBe(false);
});

const path = (url: URL) => url.pathname.replace(/\/+$/, '') || '/';

/**
 * True when a fetched link ended on the page it names: same host and path (trailing slash and query aside).
 * A moved article that redirects to the home page, or a private deployment that redirects to a login page, is false.
 */
export function landedOnSamePage(original: string, final: string): boolean {
  const from = new URL(original);
  const to = new URL(final);
  return from.host === to.host && path(from) === path(to);
}

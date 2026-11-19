/** Public URL of the site, used for absolute links in metadata, sitemap and robots. */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : 'http://localhost:3000');

export const SITE_NAME = 'Türkiye İdeolojik';

/** Date the political content (questions, parties, leaders) was last reviewed. */
export const CONTENT_DATE = 'Kasım 2026';

/** Query parameter that carries a shareable result (read by the server for link previews). */
export const SHARE_PARAM = 's';

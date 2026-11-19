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

/** Data controller (veri sorumlusu) shown in the privacy notice, as required by KVKK art. 10. */
export const DATA_CONTROLLER = {
  name: 'Ahmet Yılmaz',
  email: 'ahmetylmzkho@gmail.com',
};

/** Date the privacy notice was last updated. */
export const PRIVACY_UPDATED = 'Kasım 2026';

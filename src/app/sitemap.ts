import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
    return [
        { url: SITE_URL, changeFrequency: 'monthly', priority: 1 },
        { url: `${SITE_URL}/yontem`, changeFrequency: 'monthly', priority: 0.5 },
        { url: `${SITE_URL}/istatistik`, changeFrequency: 'daily', priority: 0.6 },
        { url: `${SITE_URL}/gizlilik`, changeFrequency: 'yearly', priority: 0.3 },
    ];
}

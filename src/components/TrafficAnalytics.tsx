'use client';

import { Analytics } from '@vercel/analytics/next';

/**
 * Cookieless page-view counting (Vercel Web Analytics).
 * Query strings and fragments are removed before anything is sent, because
 * shared result links carry the visitor's answer code in `?s=`.
 */
export default function TrafficAnalytics() {
    return (
        <Analytics
            beforeSend={event => {
                const url = new URL(event.url);
                url.search = '';
                url.hash = '';
                return { ...event, url: url.toString() };
            }}
        />
    );
}

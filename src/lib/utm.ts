/**
 * Append UTM params to own-property URLs for attribution.
 */

import { UTM_MEDIUM, UTM_CAMPAIGN } from '$lib/config';

const OWN_PROPERTY_HOSTS = ['mifi.ventures', 'cal.mifi.ventures', 'mifi.dev', 'mifi.bio'];

/**
 * Returns href with UTM params appended if the URL's host is an own property.
 * Respects existing query params.
 */
export function appendUtmParams(href: string, sourceHost: string, utmContent?: string): string {
    try {
        const url = new URL(href, 'https://mifi.dev');
        const hostname = url.hostname.toLowerCase();
        if (!OWN_PROPERTY_HOSTS.includes(hostname)) return href;
        const params = new URLSearchParams(url.search);
        params.set('utm_source', sourceHost);
        params.set('utm_medium', UTM_MEDIUM);
        params.set('utm_campaign', UTM_CAMPAIGN);
        if (utmContent) params.set('utm_content', utmContent);
        url.search = params.toString();
        return url.toString();
    } catch {
        return href;
    }
}

/**
 * App config: own-property hostnames for UTM attribution, variant hostnames, GA IDs.
 */

export const OWN_PROPERTY_HOSTS = [
    'mifi.ventures',
    'cal.mifi.ventures',
    'mifi.dev',
    'mifi.bio',
] as const;

export const VARIANT_HOSTS: Record<'dev' | 'bio', string> = {
    dev: 'mifi.dev',
    bio: 'mifi.bio',
};

export const GA_MEASUREMENT_IDS: Record<'dev' | 'bio', string> = {
    dev: 'G-P8V832WDM8',
    bio: 'G-885B0KYWZ1',
};

export const UTM_MEDIUM = 'link';
export const UTM_CAMPAIGN = 'landing';

/**
 * Returns href with UTM params appended if the URL's host is an own property.
 */
export function appendUtmParams(href: string, sourceHost: string, utmContent?: string): string {
    try {
        const url = new URL(href, 'https://mifi.dev');
        const hostname = url.hostname.toLowerCase();
        if (!OWN_PROPERTY_HOSTS.some((h) => hostname === h)) return href;
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

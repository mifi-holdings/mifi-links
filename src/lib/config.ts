/**
 * App config: own-property hostnames for UTM attribution, variant hostnames, GA IDs.
 */

import { ContentVariant } from './data/constants';

export const OWN_PROPERTY_HOSTS = [
    'mifi.ventures',
    'cal.mifi.ventures',
    'mifi.dev',
    'mifi.bio',
] as const;

export const VARIANT_HOSTS: Record<ContentVariant, string> = {
    [ContentVariant.DEV]: 'mifi.dev',
    [ContentVariant.BIO]: 'mifi.bio',
};

export const GA_MEASUREMENT_IDS: Record<ContentVariant, string> = {
    [ContentVariant.DEV]: 'G-P8V832WDM8',
    [ContentVariant.BIO]: 'G-885B0KYWZ1',
};

export const UMAMI_MEASUREMENT_IDS: Record<ContentVariant, string> = {
    [ContentVariant.DEV]: 'ac7e751b-4ce3-49f2-80e0-f430b292b72a',
    [ContentVariant.BIO]: 'cf44669d-10c1-4982-ad79-282aed4237e5',
};

/** theme-color meta values per variant (match tokens-{variant}.css --color-bg) */
export const THEME_COLORS: Record<ContentVariant, { light: string; dark: string }> = {
    [ContentVariant.DEV]: { light: '#f5f4f8', dark: '#131118' }, // hsl(260 20% 98%) / hsl(260 18% 8%)
    [ContentVariant.BIO]: { light: '#f4f6f9', dark: '#111318' }, // hsl(220 22% 98%) / hsl(220 18% 8%)
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

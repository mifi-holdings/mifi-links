import { describe, it, expect } from 'vitest';
import {
    OWN_PROPERTY_HOSTS,
    VARIANT_HOSTS,
    GA_MEASUREMENT_IDS,
    UTM_MEDIUM,
    UTM_CAMPAIGN,
    appendUtmParams,
} from './config';

describe('config', () => {
    describe('constants', () => {
        it('OWN_PROPERTY_HOSTS includes expected hostnames', () => {
            expect(OWN_PROPERTY_HOSTS).toContain('mifi.dev');
            expect(OWN_PROPERTY_HOSTS).toContain('mifi.bio');
            expect(OWN_PROPERTY_HOSTS).toContain('mifi.ventures');
            expect(OWN_PROPERTY_HOSTS).toContain('cal.mifi.ventures');
        });

        it('VARIANT_HOSTS maps dev and bio', () => {
            expect(VARIANT_HOSTS.dev).toBe('mifi.dev');
            expect(VARIANT_HOSTS.bio).toBe('mifi.bio');
        });

        it('GA_MEASUREMENT_IDS has dev and bio', () => {
            expect(GA_MEASUREMENT_IDS.dev).toMatch(/^G-[A-Z0-9]+$/);
            expect(GA_MEASUREMENT_IDS.bio).toMatch(/^G-[A-Z0-9]+$/);
        });

        it('UTM_MEDIUM and UTM_CAMPAIGN are set', () => {
            expect(UTM_MEDIUM).toBe('link');
            expect(UTM_CAMPAIGN).toBe('landing');
        });
    });

    describe('appendUtmParams', () => {
        it('appends utm params to own-property URL', () => {
            const href = 'https://mifi.dev/page';
            const result = appendUtmParams(href, 'mifi.dev');
            const url = new URL(result);
            expect(url.searchParams.get('utm_source')).toBe('mifi.dev');
            expect(url.searchParams.get('utm_medium')).toBe('link');
            expect(url.searchParams.get('utm_campaign')).toBe('landing');
            expect(url.origin).toBe('https://mifi.dev');
        });

        it('appends utm_content when provided', () => {
            const href = 'https://mifi.bio/';
            const result = appendUtmParams(href, 'mifi.bio', 'hero');
            const url = new URL(result);
            expect(url.searchParams.get('utm_content')).toBe('hero');
        });

        it('preserves existing query params and adds UTM', () => {
            const href = 'https://mifi.dev/page?foo=bar';
            const result = appendUtmParams(href, 'mifi.dev');
            const url = new URL(result);
            expect(url.searchParams.get('foo')).toBe('bar');
            expect(url.searchParams.get('utm_source')).toBe('mifi.dev');
        });

        it('returns href unchanged for non-own-property host', () => {
            const href = 'https://example.com/page';
            expect(appendUtmParams(href, 'mifi.dev')).toBe(href);
            expect(appendUtmParams('https://github.com/the-mifi', 'mifi.dev')).toBe(
                'https://github.com/the-mifi',
            );
        });

        it('matches hostname case-insensitively', () => {
            const result = appendUtmParams('https://MIFI.DEV/path', 'mifi.dev');
            const url = new URL(result);
            expect(url.searchParams.get('utm_source')).toBe('mifi.dev');
        });

        it('uses base for relative href', () => {
            const result = appendUtmParams('/about', 'mifi.dev');
            const url = new URL(result);
            expect(url.hostname).toBe('mifi.dev');
            expect(url.pathname).toBe('/about');
            expect(url.searchParams.get('utm_source')).toBe('mifi.dev');
        });
    });
});

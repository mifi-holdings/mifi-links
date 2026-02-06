import { describe, it, expect } from 'vitest';
import { appendUtmParams } from './utm';

describe('utm', () => {
    describe('appendUtmParams', () => {
        it('appends utm params to own-property URL', () => {
            const href = 'https://mifi.dev/page';
            const result = appendUtmParams(href, 'mifi.dev');
            const url = new URL(result);
            expect(url.searchParams.get('utm_source')).toBe('mifi.dev');
            expect(url.searchParams.get('utm_medium')).toBe('link');
            expect(url.searchParams.get('utm_campaign')).toBe('landing');
        });

        it('appends utm_content when provided', () => {
            const href = 'https://mifi.bio/';
            const result = appendUtmParams(href, 'mifi.bio', 'hero');
            const url = new URL(result);
            expect(url.searchParams.get('utm_content')).toBe('hero');
        });

        it('returns href unchanged for non-own-property host', () => {
            const href = 'https://example.com/page';
            expect(appendUtmParams(href, 'mifi.dev')).toBe(href);
        });
    });
});

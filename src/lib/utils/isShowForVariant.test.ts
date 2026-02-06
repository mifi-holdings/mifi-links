import { describe, it, expect } from 'vitest';
import { isShowForVariant } from './isShowForVariant';
import type { ContentVariant, Link } from '$lib/data/types';

function link(overrides: Partial<Link> & { variants: ContentVariant[] }): Link {
    return {
        href: 'https://example.com',
        label: 'Example',
        variants: overrides.variants,
        ...overrides,
    };
}

describe('isShowForVariant', () => {
    it('returns a predicate function', () => {
        const predicate = isShowForVariant('dev');
        expect(typeof predicate).toBe('function');
        expect(predicate.length).toBe(1);
    });

    it('returns true when link.variants includes the variant', () => {
        const forDev = isShowForVariant('dev');
        expect(forDev(link({ variants: ['dev'] }))).toBe(true);
        expect(forDev(link({ variants: ['dev', 'bio'] }))).toBe(true);
        expect(forDev(link({ variants: ['bio', 'dev'] }))).toBe(true);

        const forBio = isShowForVariant('bio');
        expect(forBio(link({ variants: ['bio'] }))).toBe(true);
        expect(forBio(link({ variants: ['dev', 'bio'] }))).toBe(true);
    });

    it('returns false when link.variants does not include the variant', () => {
        const forDev = isShowForVariant('dev');
        expect(forDev(link({ variants: ['bio'] }))).toBe(false);
        expect(forDev(link({ variants: [] }))).toBe(false);

        const forBio = isShowForVariant('bio');
        expect(forBio(link({ variants: ['dev'] }))).toBe(false);
        expect(forBio(link({ variants: [] }))).toBe(false);
    });

    it('works when used with Array.prototype.filter', () => {
        const links: Link[] = [
            link({ label: 'A', variants: ['dev'] }),
            link({ label: 'B', variants: ['bio'] }),
            link({ label: 'C', variants: ['dev', 'bio'] }),
        ];
        expect(links.filter(isShowForVariant('dev'))).toHaveLength(2);
        expect(links.filter(isShowForVariant('bio'))).toHaveLength(2);
        expect(links.filter(isShowForVariant('dev')).map((l) => l.label)).toEqual(['A', 'C']);
    });
});

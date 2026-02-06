import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getProcessedLinks } from './getProcessedLinks';
import type { ContentVariant, Link } from '$lib/data/types';

vi.mock('$lib/config', () => ({
    appendUtmParams: vi.fn((href: string, _sourceHost: string, utmContent?: string) => {
        const url = new URL(href, 'https://mifi.dev');
        if (utmContent) url.searchParams.set('utm_content', utmContent);
        return url.toString();
    }),
    VARIANT_HOSTS: { dev: 'mifi.dev', bio: 'mifi.bio' },
}));

function link(overrides: Partial<Link> & { variants: ContentVariant[] }): Link {
    return {
        href: 'https://example.com',
        label: 'Example',
        variants: ['dev', 'bio'],
        ...overrides,
    };
}

describe('getProcessedLinks', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('returns empty array when links is empty', () => {
        expect(getProcessedLinks([], 'dev')).toEqual([]);
        expect(getProcessedLinks([], 'bio')).toEqual([]);
    });

    it('filters out links that do not include the variant', () => {
        const links: Link[] = [
            link({ label: 'Dev only', variants: ['dev'] }),
            link({ label: 'Bio only', variants: ['bio'] }),
        ];
        expect(getProcessedLinks(links, 'dev')).toHaveLength(1);
        expect(getProcessedLinks(links, 'dev')[0].label).toBe('Dev only');
        expect(getProcessedLinks(links, 'bio')).toHaveLength(1);
        expect(getProcessedLinks(links, 'bio')[0].label).toBe('Bio only');
    });

    it('maps each link to ProcessedLink (href, icon, label, description) without variants or utmContent', () => {
        const links: Link[] = [
            link({
                href: 'https://mifi.dev/blog',
                label: 'Blog',
                description: 'My blog',
                icon: 'Mifi',
                variants: ['dev'],
                utmContent: 'nav',
            }),
        ];
        const result = getProcessedLinks(links, 'dev');
        expect(result).toHaveLength(1);
        expect(result[0]).toMatchObject({
            label: 'Blog',
            description: 'My blog',
            icon: 'Mifi',
        });
        expect(result[0]).not.toHaveProperty('variants');
        expect(result[0]).not.toHaveProperty('utmContent');
        expect(result[0].href).toContain('https://');
        expect(result[0].href).toContain('utm_content=nav');
    });

    it('uses getValueForVariant for icon, label, and description (per-variant values)', () => {
        const links: Link[] = [
            link({
                label: { dev: 'Dev label', bio: 'Bio label' } as unknown as string,
                description: { dev: 'Dev desc', bio: 'Bio desc' } as unknown as string,
                icon: { dev: 'GitHub', bio: 'LinkedIn' } as unknown as Link['icon'],
                variants: ['dev', 'bio'],
            }),
        ];
        const devResult = getProcessedLinks(links, 'dev');
        const bioResult = getProcessedLinks(links, 'bio');
        expect(devResult[0].label).toBe('Dev label');
        expect(devResult[0].description).toBe('Dev desc');
        expect(devResult[0].icon).toBe('GitHub');
        expect(bioResult[0].label).toBe('Bio label');
        expect(bioResult[0].description).toBe('Bio desc');
        expect(bioResult[0].icon).toBe('LinkedIn');
    });

    it('passes sourceHost from VARIANT_HOSTS to appendUtmParams', async () => {
        const { appendUtmParams } = await import('$lib/config');
        const links: Link[] = [link({ href: 'https://mifi.dev/x', variants: ['dev', 'bio'] })];
        getProcessedLinks(links, 'dev');
        expect(appendUtmParams).toHaveBeenCalledWith('https://mifi.dev/x', 'mifi.dev', undefined);
        vi.clearAllMocks();
        getProcessedLinks(links, 'bio');
        expect(appendUtmParams).toHaveBeenCalledWith('https://mifi.dev/x', 'mifi.bio', undefined);
    });

    it('passes utmContent to appendUtmParams when present', async () => {
        const { appendUtmParams } = await import('$lib/config');
        const links: Link[] = [link({ utmContent: 'hero', variants: ['dev'] })];
        getProcessedLinks(links, 'dev');
        expect(appendUtmParams).toHaveBeenCalledWith(expect.any(String), 'mifi.dev', 'hero');
    });
});

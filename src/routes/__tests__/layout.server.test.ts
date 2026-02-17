import { describe, it, expect, vi, afterEach } from 'vitest';
import { load } from '../+layout.server';
import { UMAMI_MEASUREMENT_IDS } from '$lib/config';
import { ContentVariant } from '$lib/data/constants';
import type { ContentData } from '$lib/data/types';

const { mockContentData } = vi.hoisted(() => {
    const data: ContentData = {
        siteByVariant: {
            dev: {
                title: 'Dev Site',
                metaDescription: 'Dev desc',
                url: 'https://mifi.dev',
                heroLayout: 'side-by-side',
            },
            bio: {
                title: 'Bio Site',
                metaDescription: 'Bio desc',
                url: 'https://mifi.bio',
                heroLayout: 'side-by-side',
            },
        },
        contactLinks: [
            {
                href: 'https://mifi.dev/contact',
                label: 'Contact',
                variants: ['dev', 'bio'],
            },
        ],
        sections: [
            {
                id: 'main',
                title: 'Links',
                order: { dev: 0, bio: 0 },
                links: [
                    {
                        href: 'https://mifi.dev/x',
                        label: 'Link',
                        variants: ['dev', 'bio'],
                    },
                ],
            },
        ],
    };
    return { mockContentData: data };
});

vi.mock('$lib/data/links.json', () => ({
    default: mockContentData,
}));

describe('+layout.server', () => {
    const originalEnv = process.env.CONTENT_VARIANT;

    afterEach(() => {
        process.env.CONTENT_VARIANT = originalEnv;
    });

    it('returns layout data with site, contactLinks, links, variant, gaMeasurementId', () => {
        process.env.CONTENT_VARIANT = ContentVariant.DEV;
        const result = load();
        expect(result).toHaveProperty('site');
        expect(result).toHaveProperty('contactLinks');
        expect(result).toHaveProperty('links');
        expect(result).toHaveProperty('variant');
        expect(result).toHaveProperty('gaMeasurementId');
        expect(result.variant).toBe('dev');
        expect(result.site.title).toBe('Dev Site');
        expect(result.links.sections).toHaveLength(1);
        expect(result.links.sections[0].links).toHaveLength(1);
        expect(result.links.sections[0].links[0].label).toBe('Link');
    });

    it('uses bio variant when CONTENT_VARIANT is bio', () => {
        process.env.CONTENT_VARIANT = ContentVariant.BIO;
        const result = load();
        expect(result.variant).toBe('bio');
        expect(result.site.title).toBe('Bio Site');
    });

    it('defaults to dev when CONTENT_VARIANT is not bio', () => {
        process.env.CONTENT_VARIANT = 'other';
        const result = load();
        expect(result.variant).toBe('dev');
    });

    it('site.url is https + VARIANT_HOSTS[variant]', () => {
        process.env.CONTENT_VARIANT = ContentVariant.DEV;
        const result = load();
        expect(result.site.url).toBe('https://mifi.dev');
        process.env.CONTENT_VARIANT = ContentVariant.BIO;
        const resultBio = load();
        expect(resultBio.site.url).toBe('https://mifi.bio');
    });

    it('gaMeasurementId matches variant', () => {
        process.env.CONTENT_VARIANT = ContentVariant.DEV;
        expect(load().gaMeasurementId).toMatch(/^G-/);
        expect(load().umamiMeasurementId).toBe(UMAMI_MEASUREMENT_IDS[ContentVariant.DEV]);
        process.env.CONTENT_VARIANT = ContentVariant.BIO;
        expect(load().gaMeasurementId).toMatch(/^G-/);
        expect(load().umamiMeasurementId).toBe(UMAMI_MEASUREMENT_IDS[ContentVariant.BIO]);
    });
});

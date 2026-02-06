import { describe, it, expect } from 'vitest';
import type { ContentVariant, Link, ProcessedLink, Site, Section, ContentData } from './types';
import { ContentVariant as ContentVariantEnum } from './constants';

/**
 * Runtime shape checks for types. TypeScript types are erased at runtime;
 * these tests ensure our fixtures and expected structures match the documented shape.
 */
describe('types (runtime shape)', () => {
    it('ContentVariant type aligns with constants', () => {
        const variants: ContentVariant[] = [ContentVariantEnum.DEV, ContentVariantEnum.BIO];
        expect(variants).toEqual(['dev', 'bio']);
    });

    it('Link has required fields and variants array', () => {
        const link: Link = {
            href: 'https://example.com',
            label: 'Example',
            variants: ['dev'],
        };
        expect(link).toHaveProperty('href');
        expect(link).toHaveProperty('label');
        expect(link).toHaveProperty('variants');
        expect(Array.isArray(link.variants)).toBe(true);
    });

    it('ProcessedLink omits variants and utmContent', () => {
        const processed: ProcessedLink = {
            href: 'https://example.com',
            label: 'Example',
        };
        expect(processed).toHaveProperty('href');
        expect(processed).toHaveProperty('label');
        expect(processed).not.toHaveProperty('variants');
        expect(processed).not.toHaveProperty('utmContent');
    });

    it('Site has required fields', () => {
        const site: Site = {
            title: 'Test',
            metaDescription: 'Desc',
            url: 'https://mifi.dev',
        };
        expect(site).toHaveProperty('title');
        expect(site).toHaveProperty('metaDescription');
        expect(site).toHaveProperty('url');
    });

    it('Section has id, title, order, links', () => {
        const section: Section = {
            id: 'test',
            title: 'Test Section',
            order: { dev: 0, bio: 1 },
            links: [],
        };
        expect(section).toHaveProperty('id');
        expect(section).toHaveProperty('title');
        expect(section).toHaveProperty('order');
        expect(section).toHaveProperty('links');
        expect(section.order).toHaveProperty('dev');
        expect(section.order).toHaveProperty('bio');
    });

    it('ContentData has siteByVariant, contactLinks, sections', () => {
        const data: ContentData = {
            siteByVariant: { dev: {} as Site, bio: {} as Site },
            contactLinks: [],
            sections: [],
        };
        expect(data).toHaveProperty('siteByVariant');
        expect(data).toHaveProperty('contactLinks');
        expect(data).toHaveProperty('sections');
        expect(data.siteByVariant).toHaveProperty('dev');
        expect(data.siteByVariant).toHaveProperty('bio');
    });
});

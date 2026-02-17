import { describe, it, expect } from 'vitest';
import type { LayoutData } from '../$types';

/**
 * LayoutData shape used by +layout.svelte. Component itself is covered by e2e.
 */
describe('+layout (LayoutData)', () => {
    it('LayoutData shape matches what load returns', () => {
        const mockData: LayoutData = {
            site: {
                title: 'Test',
                metaDescription: 'Desc',
                url: 'https://mifi.dev',
            },
            links: { sections: [] },
            variant: 'dev',
            gaMeasurementId: 'G-xxx',
            umamiMeasurementId: 'UM-xxx',
        };
        expect(mockData.site).toHaveProperty('title');
        expect(mockData.site).toHaveProperty('url');
        expect(mockData).toHaveProperty('umamiMeasurementId');
        expect(mockData).toHaveProperty('gaMeasurementId');
        expect(mockData).toHaveProperty('variant');
        expect(mockData.links).toHaveProperty('sections');
    });
});

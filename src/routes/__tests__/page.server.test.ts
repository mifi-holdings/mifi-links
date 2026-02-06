import { describe, it, expect, vi, beforeEach } from 'vitest';
import { load } from '../+page.server';

describe('+page.server', () => {
    beforeEach(() => {
        vi.restoreAllMocks();
    });

    it('load returns parent() result', async () => {
        const mockParent = vi.fn().mockResolvedValue({
            site: { title: 'Parent' },
            variant: 'dev',
        });
        const event = { parent: mockParent } as Parameters<typeof load>[0];
        const result = await load(event);
        expect(mockParent).toHaveBeenCalledOnce();
        expect(result).toEqual({ site: { title: 'Parent' }, variant: 'dev' });
    });
});

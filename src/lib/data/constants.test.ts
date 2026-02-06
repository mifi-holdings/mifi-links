import { describe, it, expect } from 'vitest';
import { ContentVariant, HeroLayout, AvatarVariant } from './constants';

describe('constants', () => {
    describe('ContentVariant', () => {
        it('has bio and dev', () => {
            expect(ContentVariant.BIO).toBe('bio');
            expect(ContentVariant.DEV).toBe('dev');
        });

        it('values are string literals usable as variant keys', () => {
            const variants: ContentVariant[] = [ContentVariant.DEV, ContentVariant.BIO];
            expect(variants).toContain('dev');
            expect(variants).toContain('bio');
        });
    });

    describe('HeroLayout', () => {
        it('has stack and side-by-side', () => {
            expect(HeroLayout.STACK).toBe('stack');
            expect(HeroLayout.SIDE_BY_SIDE).toBe('side-by-side');
        });
    });

    describe('AvatarVariant', () => {
        it('has classic and tropical', () => {
            expect(AvatarVariant.CLASSIC).toBe('classic-mifi');
            expect(AvatarVariant.TROPICAL).toBe('tropical-mifi');
        });
    });
});

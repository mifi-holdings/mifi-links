import { describe, it, expect } from 'vitest';
import { getValueForVariant } from './getValueForVariant';
import type { ContentVariant } from '$lib/data/types';

describe('getValueForVariant', () => {
    it('returns the value when it is a plain string (not a record)', () => {
        expect(getValueForVariant('Same for all', 'dev')).toBe('Same for all');
        expect(getValueForVariant('Same for all', 'bio')).toBe('Same for all');
    });

    it('returns the value when it is a plain number (not a record)', () => {
        expect(getValueForVariant(42, 'dev')).toBe(42);
        expect(getValueForVariant(42, 'bio')).toBe(42);
    });

    it('returns the variant key when value is a Record<ContentVariant, T>', () => {
        const perVariant = { dev: 'Dev label', bio: 'Bio label' };
        expect(getValueForVariant(perVariant, 'dev')).toBe('Dev label');
        expect(getValueForVariant(perVariant, 'bio')).toBe('Bio label');
    });

    it('returns undefined when record has no key for variant', () => {
        const partial = { dev: 'Only dev' } as Record<ContentVariant, string>;
        expect(getValueForVariant(partial, 'dev')).toBe('Only dev');
        expect(getValueForVariant(partial, 'bio')).toBeUndefined();
    });

    it('returns undefined when record value for variant is undefined', () => {
        const withUndefined = { dev: 'Dev', bio: undefined };
        expect(getValueForVariant(withUndefined, 'dev')).toBe('Dev');
        expect(getValueForVariant(withUndefined, 'bio')).toBeUndefined();
    });

    it('returns undefined for object without variant key (e.g. array)', () => {
        const arr = ['a', 'b'];
        expect(
            getValueForVariant(arr as unknown as Record<ContentVariant, string>, 'dev'),
        ).toBeUndefined();
    });

    it('handles null by returning it as T (no indexing)', () => {
        expect(getValueForVariant(null as unknown as string, 'dev')).toBeNull();
    });
});

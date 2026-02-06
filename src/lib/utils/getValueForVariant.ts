import type { ContentVariant } from '$lib/data/constants';

export function getValueForVariant<T = string>(
    value: T | Record<ContentVariant, T>,
    variant: ContentVariant,
): T | undefined {
    if (typeof value === 'object' && value !== null && variant in value) {
        return (value as Record<ContentVariant, T>)[variant] ?? undefined;
    }
    if (typeof value === 'object' && value !== null) {
        return undefined;
    }
    return value as T;
}

import type { ContentVariant, Link } from '$lib/data/types';

export const isShowForVariant =
    (variant: ContentVariant) =>
    (link: Link): boolean => {
        return link.variants.includes(variant);
    };

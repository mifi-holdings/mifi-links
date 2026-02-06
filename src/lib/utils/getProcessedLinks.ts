import { appendUtmParams, VARIANT_HOSTS } from '$lib/config';
import type { ContentVariant } from '$lib/data/constants';
import type { Link, ProcessedLink } from '$lib/data/types';
import { getValueForVariant } from './getValueForVariant';

import { isShowForVariant } from './isShowForVariant';

export const getProcessedLinks = (links: Link[], variant: ContentVariant): ProcessedLink[] => {
    const sourceHost = VARIANT_HOSTS[variant];

    return links.filter(isShowForVariant(variant)).map((link) => ({
        href: appendUtmParams(link.href, sourceHost, link.utmContent),
        icon: getValueForVariant(link.icon, variant),
        label: getValueForVariant(link.label, variant) as string,
        description: getValueForVariant(link.description, variant),
    }));
};

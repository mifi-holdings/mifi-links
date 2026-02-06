import {
    ContentVariant as ContentVariantEnum,
    HeroLayout as HeroLayoutEnum,
    AvatarVariant as AvatarVariantEnum,
} from './constants';

import type { IconName } from '$lib/components/LinkIcon.svelte';

/**
 * Content types for links.json. Used at build time in +layout.server.ts.
 */

export type ContentVariant = `${ContentVariantEnum}`;

export type HeroLayout = `${HeroLayoutEnum}`;
export type ProfileImageName = `${AvatarVariantEnum}`;

export interface Site {
    title: string;
    metaDescription: string;
    url: string;
    heroLayout?: HeroLayout;
    profileImage?: ProfileImageName;
    pronunciation?: string;
    pronouns?: string;
    location?: string;
    person?: {
        name: string;
        sameAs: string[];
    };
    linksHeading?: string;
    /** If false, hide Contact button and panel for this variant. Default true. */
    showContact?: boolean;
    /** Contact panel links; if omitted, first section links are used. */
    contactLinks?: ContactLink[];
    /** Optional QR code image path (e.g. /assets/images/qr-mifi-dev.png) for Share panel. */
    qrCodeImage?: string | null;
}

export interface Link {
    href: string;
    icon?: IconName;
    label: string;
    description?: string;
    variants: ContentVariant[];
    utmContent?: string;
}

export type ContactLink = Link;

export type ProcessedLink = Omit<Link, 'variants' | 'utmContent'>;

export interface Section {
    id: string;
    title: string;
    /** The zero-based order of the links in the section. If null, the section is not shown for that variant. */
    order: Record<ContentVariant, number | null>;
    links: Link[];
}

export interface ContentData {
    siteByVariant: Record<ContentVariant, Site>;
    contactLinks: ContactLink[];
    sections: Section[];
}

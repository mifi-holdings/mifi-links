import contentData from '$lib/data/links.json';
import {
    VARIANT_HOSTS,
    GA_MEASUREMENT_IDS,
    THEME_COLORS,
    UMAMI_MEASUREMENT_IDS,
} from '$lib/config';
import type { Site, ContentData, ProcessedLink } from '$lib/data/types';
import type { LayoutServerLoad } from './$types';
import { ContentVariant, HeroLayout } from '$lib/data/constants';
import { getProcessedLinks } from '$lib/utils/getProcessedLinks';

export type LayoutServerDataOut = {
    site: Site;
    contactLinks?: ProcessedLink[];
    links: {
        sections: {
            id: string;
            title: string;
            order: number;
            links: ProcessedLink[];
        }[];
    };
    variant: string;
    gaMeasurementId: string;
    umamiMeasurementId: string;
    /** theme-color meta values for current variant */
    themeColorLight: string;
    themeColorDark: string;
};

export const load: LayoutServerLoad<LayoutServerDataOut> = (): LayoutServerDataOut => {
    const variant =
        process.env.CONTENT_VARIANT === ContentVariant.BIO
            ? ContentVariant.BIO
            : ContentVariant.DEV;
    const sourceHost = VARIANT_HOSTS[variant];
    const siteUrl = 'https://' + sourceHost;
    const data = contentData as ContentData;
    const contactLinks = getProcessedLinks(data.contactLinks, variant);
    const sections = data.sections
        .map((section) => {
            const links: ProcessedLink[] = getProcessedLinks(section.links, variant);
            return {
                id: section.id,
                title: section.title,
                links,
                order: section.order[variant] ?? null,
            };
        })
        .filter(
            (s) => s.links.length > 0 && s.order !== null,
        ) as LayoutServerDataOut['links']['sections'];
    const siteDef = data.siteByVariant[variant];
    const site: LayoutServerDataOut['site'] = {
        title: siteDef?.title ?? (variant === ContentVariant.DEV ? 'mifi.dev' : 'mifi.bio'),
        metaDescription: siteDef?.metaDescription ?? '',
        url: siteUrl,
        heroLayout: siteDef?.heroLayout ?? HeroLayout.SIDE_BY_SIDE,
        profileImage: siteDef?.profileImage,
        pronunciation: siteDef?.pronunciation,
        pronouns: siteDef?.pronouns,
        location: siteDef?.location,
        person: siteDef?.person,
        linksHeading: siteDef?.linksHeading,
        contactLinks: siteDef?.contactLinks,
        qrCodeImage: siteDef?.qrCodeImage ?? undefined,
    };
    const themeColors = THEME_COLORS[variant];
    return {
        site,
        contactLinks,
        links: { sections },
        variant,
        gaMeasurementId: GA_MEASUREMENT_IDS[variant],
        umamiMeasurementId: UMAMI_MEASUREMENT_IDS[variant],
        themeColorLight: themeColors.light,
        themeColorDark: themeColors.dark,
    };
};

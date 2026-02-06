<script lang="ts" module>
    export type IconName =
        | 'GitHub'
        | 'LinkedIn'
        | 'Instagram'
        | 'Facebook'
        | 'YouTube'
        | 'TikTok'
        | 'Snapchat'
        | 'Discord'
        | 'Strava'
        | 'Flickr'
        | 'Calendar'
        | 'Resume'
        | 'Mifi';
</script>

<script lang="ts">
    import IconLink from './icons/IconLink.svelte';
    import IconGitHub from './icons/IconGitHub.svelte';
    import IconLinkedIn from './icons/IconLinkedIn.svelte';
    import IconInstagram from './icons/IconInstagram.svelte';
    import IconFacebook from './icons/IconFacebook.svelte';
    import IconYouTube from './icons/IconYouTube.svelte';
    import IconTikTok from './icons/IconTikTok.svelte';
    import IconSnapchat from './icons/IconSnapchat.svelte';
    import IconDiscord from './icons/IconDiscord.svelte';
    import IconStrava from './icons/IconStrava.svelte';
    import IconFlickr from './icons/IconFlickr.svelte';
    import IconCal from './icons/IconCal.svelte';
    import IconResume from './icons/IconResume.svelte';
    import IconMi from './icons/IconMi.svelte';
    import type { Link } from '$lib/data/types';

    let {
        icon,
        label,
        size = 24,
    } = $props<Pick<Link, 'href' | 'icon' | 'label'> & { size?: number }>();

    const iconMap: Record<IconName, typeof IconLink> = {
        GitHub: IconGitHub,
        LinkedIn: IconLinkedIn,
        Instagram: IconInstagram,
        Facebook: IconFacebook,
        YouTube: IconYouTube,
        TikTok: IconTikTok,
        Snapchat: IconSnapchat,
        Discord: IconDiscord,
        Strava: IconStrava,
        Flickr: IconFlickr,
        Calendar: IconCal,
        Resume: IconResume,
        Mifi: IconMi,
    };

    const IconComponent = $derived(iconMap[(icon || label) as IconName] ?? IconLink);
</script>

<IconComponent {size} />

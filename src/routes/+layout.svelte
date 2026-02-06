<script lang="ts">
    import type { Snippet } from 'svelte';

    import ThemeToggle from '$lib/components/ThemeToggle.svelte';
    import type { LayoutData } from './$types';

    import '../app.css';

    let { children, data }: { children: Snippet; data: LayoutData } = $props();

    const jsonLd = $derived({
        '@context': 'https://schema.org',
        '@type': 'WebSite' as const,
        name: data.site.title,
        url: data.site.url,
        description: data.site.metaDescription,
    });

    const personLd = $derived(
        data.site.person
            ? {
                  '@context': 'https://schema.org' as const,
                  '@type': 'Person' as const,
                  name: data.site.person.name,
                  url: data.site.url,
                  sameAs: data.site.person.sameAs,
              }
            : null
    );

    // Inject as HTML to avoid Prettier parsing ld+json script body as JS (Babel syntax error)
    const ldJsonTag = (payload: string) =>
        '<' + 'script type="application/ld+json">' + payload + '<' + '/script>';
    const jsonLdHtml = $derived(ldJsonTag(JSON.stringify(jsonLd)));
    const personLdHtml = $derived(
        personLd != null ? ldJsonTag(JSON.stringify(personLd)) : ''
    );
</script>

<svelte:head>
    <link rel="stylesheet" href="/assets/tokens-{data.variant}.css" />

    <link
        rel="preload"
        href="/assets/fonts/fraunces-variable-opsz-wght.woff2"
        as="font"
        type="font/woff2"
        crossorigin="anonymous"
    />
    <link
        rel="preload"
        href="/assets/fonts/plus-jakarta-sans-v12-latin-700.woff2"
        as="font"
        type="font/woff2"
        crossorigin="anonymous"
    />
    <link
        rel="preload"
        href="/assets/fonts/plus-jakarta-sans-v12-latin-regular.woff2"
        as="font"
        type="font/woff2"
        crossorigin="anonymous"
    />
    <link
        rel="preload"
        href="/assets/fonts/inter-v20-latin-regular.woff2"
        as="font"
        type="font/woff2"
        crossorigin="anonymous"
    />

    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="icon" type="image/x-icon" href="/favicon.ico" />
    <link rel="apple-touch-icon" sizes="180x180" href="/assets/images/apple-touch-icon.png" />

    <meta name="color-scheme" content="light dark" />
    <meta name="theme-color" content={data.themeColorLight} media="(prefers-color-scheme: light)" />
    <meta name="theme-color" content={data.themeColorDark} media="(prefers-color-scheme: dark)" />

    <!-- eslint-disable-next-line svelte/no-at-html-tags -- safe: our own JSON.stringify, no user input -->
    {@html jsonLdHtml}
    {#if personLdHtml}
        <!-- eslint-disable-next-line svelte/no-at-html-tags -- safe: our own JSON.stringify, no user input -->
        {@html personLdHtml}
    {/if}
</svelte:head>

<a href="#main-content" class="skip-link">Skip to main content</a>
<header class="site-header">
    <ThemeToggle />
</header>
{@render children()}

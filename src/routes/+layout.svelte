<script lang="ts">
    import '../app.css';
    import ThemeToggle from '$lib/components/ThemeToggle.svelte';
    import type { LayoutData } from './$types';

    export let data: LayoutData;

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'WebSite' as const,
        name: data.site.title,
        url: data.site.url,
        description: data.site.metaDescription,
    };

    $: personLd = data.site.person
        ? {
              '@context': 'https://schema.org' as const,
              '@type': 'Person' as const,
              name: data.site.person.name,
              url: data.site.url,
              sameAs: data.site.person.sameAs,
          }
        : null;

    // Inject as HTML to avoid Prettier parsing ld+json script body as JS (Babel syntax error)
    const ldJsonTag = (payload: string) =>
        '<' + 'script type="application/ld+json">' + payload + '<' + '/script>';
    $: jsonLdHtml = ldJsonTag(JSON.stringify(jsonLd));
    $: personLdHtml = personLd != null ? ldJsonTag(JSON.stringify(personLd)) : '';
</script>

<svelte:head>
    <link rel="stylesheet" href="/assets/tokens-{data.variant}.css" />
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
<slot />

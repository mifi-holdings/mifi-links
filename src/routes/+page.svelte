<script lang="ts">
    import ContactPanel from '$lib/components/ContactPanel.svelte';
    import Footer from '$lib/components/Footer.svelte';
    import Hero from '$lib/components/Hero.svelte';
    import LinkGroup from '$lib/components/LinkGroup.svelte';
    import SharePanel from '$lib/components/SharePanel.svelte';

    import type { PageData } from './$types';

    let { data }: { data: PageData } = $props();

    let shareOpen = $state(false);
    let contactOpen = $state(false);

    const showContactButton = $derived((data?.contactLinks?.length ?? 0) > 0);

    const shareUrl = $derived(data.site.url);
    const shareEmailSubject = $derived(`Link from ${data.site.title}`);
    const shareEmailBody = $derived(`Check out Mike Fitzpatrick's links at: ${shareUrl}`);
</script>

<svelte:head>
    <title>{data.site.title}</title>
    <meta name="description" content={data.site.metaDescription} />
    <link rel="canonical" href={data.site.url} />
    <meta name="robots" content="index, follow" />
    {#if data.site.person?.name}
        <meta name="author" content={data.site.person.name} />
    {/if}

    <!-- Open Graph -->
    <meta property="og:type" content="website" />
    <meta property="og:title" content={data.site.title} />
    <meta property="og:description" content={data.site.metaDescription} />
    <meta property="og:url" content={data.site.url} />
    <meta property="og:site_name" content={data.site.title} />
    <meta property="og:locale" content="en_US" />
    <meta
        property="og:image"
        content="{data.site.url}/assets/images/mifi-{data.variant}-og-image.webp"
    />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />

    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={data.site.title} />
    <meta name="twitter:description" content={data.site.metaDescription} />
    <meta
        name="twitter:image"
        content="{data.site.url}/assets/images/mifi-{data.variant}-twitter-image.webp"
    />
    <meta name="twitter:image:width" content="1200" />
    <meta name="twitter:image:height" content="1200" />
</svelte:head>

<main id="main-content">
    <Hero bind:contactOpen bind:shareOpen {showContactButton} {...data.site} {...data.links} />
    <div class="page">
        {#each data.links.sections as section}
            <LinkGroup
                id={section.id}
                links={section.links}
                order={section.order}
                showHeading={data.links.sections.length > 1}
                title={section.title}
            />
        {/each}
    </div>
    <Footer />
    <SharePanel
        open={shareOpen}
        url={shareUrl}
        qrCodeImage={data.site.qrCodeImage}
        emailSubject={shareEmailSubject}
        emailBody={shareEmailBody}
        onclose={() => (shareOpen = false)}
    />
    <ContactPanel
        open={contactOpen}
        links={data.contactLinks}
        onclose={() => (contactOpen = false)}
    />
</main>

<style>
    .page {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        margin: 0 auto;
        max-width: 50ch;
        padding: 4rem 1.5rem 3rem;
    }
</style>

<script lang="ts">
    import type { ProcessedLink, Section } from '$lib/data/types';

    import Link from './Link.svelte';

    let {
        id,
        links,
        order,
        showHeading = false,
        title,
    } = $props<
        Omit<Section, 'links' | 'order'> & {
            links: ProcessedLink[];
            order: number;
            showHeading?: boolean;
        }
    >();
</script>

<section class="card" aria-labelledby={`section-${id}`} style="order:{order}">
    {#if showHeading}<h3 id={`section-${id}`} class="link-section-heading heading">
            {title}
        </h3>{/if}
    <ul class="link-list">
        {#each links as link (link.label)}
            <li class="link-row">
                <Link {...link} />
            </li>
        {/each}
    </ul>
</section>

<style>
    .link-section-heading {
        color: var(--color-primary);
        font-family: var(--font-heading, var(--font-sans));
        font-size: 1.125rem;
        font-weight: 500;
        font-variation-settings: 'opsz' var(--font-heading-opsz, 36);
        letter-spacing: 0.045em;
        margin: 0 0 1rem;
    }

    .link-list {
        list-style: none;
        margin: 0;
        padding: 0;
    }

    .link-row {
        margin-bottom: 0.75rem;

        &:last-child {
            margin-bottom: 0;
        }
    }
</style>

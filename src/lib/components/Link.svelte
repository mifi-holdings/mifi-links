<script lang="ts">
    import type { ProcessedLink } from '$lib/data/types';
    import LinkIcon from './LinkIcon.svelte';

    let { href, icon, label, description }: ProcessedLink = $props();
</script>

<a
    {href}
    rel="noopener noreferrer"
    target="_blank"
    class="link"
    data-umami-event={`link click`}
    data-umami-event-label={label}
>
    <span class="icon" aria-hidden="true">
        <LinkIcon {href} {icon} {label} />
    </span>
    <div class="link-row-content">
        <span class="title">{label}</span>
        {#if description}
            <span class="description">{description}</span>
        {/if}
    </div>
</a>

<style>
    .link {
        display: flex;
        align-items: center;
        gap: 1rem;
        text-decoration: none;

        &:hover {
            & .title {
                color: var(--color-link-hover);
                text-decoration: underline;
            }

            & .description {
                color: var(--color-secondary);
                text-decoration: none;
            }

            & .icon {
                color: var(--color-link-hover);
            }
        }

        &:focus-visible {
            outline: 2px solid var(--color-focus-ring);
        }
    }

    .title,
    .description,
    .icon {
        transition:
            color 0.2s ease-in-out,
            text-decoration 0.2s ease-in-out;
    }

    .icon {
        color: var(--color-link);
        flex-shrink: 0;
        height: 1.5rem;
        width: 1.5rem;
    }

    .link-row-content {
        flex: 1;
        min-width: 0;
    }

    .title {
        color: var(--color-link);
        text-decoration: none;
    }

    .description {
        color: var(--color-secondary-muted);
        display: block;
        font-size: 0.875rem;
        margin-top: 0.15rem;
        text-decoration: none;
    }
</style>

<script lang="ts">
    import type { ProcessedLink } from '$lib/data/types';

    import LinkIcon from './LinkIcon.svelte';
    import Panel from './Panel.svelte';
    import IconContact from './icons/IconContact.svelte';

    let {
        open = false,
        links = [],
        onclose = () => {},
    }: {
        open: boolean;
        links?: ProcessedLink[];
        onclose: () => void;
    } = $props();

    const componentId = $props.id();
</script>

<Panel {open} icon={IconContact} title="Contact" {onclose}>
    {#snippet children()}
        <ul class="contact-panel-list">
            {#each links as link (link.label)}
                {@const descriptionId = `${componentId}-description-${link.label}`}
                <li>
                    {#if link.description}
                        <div id={descriptionId} class="description">{link.description}</div>
                    {/if}
                    <a
                        href={link.href}
                        class="panel-btn"
                        onclick={onclose}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-describedby={link.description ? descriptionId : undefined}
                    >
                        {#if link.icon}
                            <LinkIcon href={link.href} icon={link.icon} label={link.label} />
                        {/if}
                        {link.label}
                    </a>
                </li>
            {/each}
        </ul>
    {/snippet}
</Panel>

<style>
    .contact-panel-list {
        list-style: none;
        margin: 0;
        padding: 0;
    }

    .contact-panel-list li {
        margin-bottom: 0.5rem;

        &:last-child {
            margin-bottom: 0;
        }
    }

    .description {
        color: var(--color-secondary-muted);
        display: block;
        font-size: 0.875rem;
        margin-bottom: 0.5rem;
        text-align: center;
    }
</style>

<script lang="ts">
    import { HeroLayout } from '$lib/data/constants';
    import type { Site } from '$lib/data/types';
    import IconContact from './icons/IconContact.svelte';
    import IconShare from './icons/IconShare.svelte';

    let {
        contactOpen = $bindable(),
        heroLayout,
        location,
        person,
        profileImage,
        pronouns,
        pronunciation,
        shareOpen = $bindable(),
        showContactButton,
    } = $props<Site & { contactOpen: boolean; shareOpen: boolean; showContactButton: boolean }>();
</script>

<div class="hero-backdrop" aria-label="Header background">
    {#if profileImage}
        <div
            class="hero-bg"
            style="background-image: url('/assets/images/{profileImage}.webp')"
            aria-hidden="true"
        ></div>
    {/if}
    <div class="hero-actions">
        {#if showContactButton}
            <button
                type="button"
                class="action"
                aria-label="Contact"
                onclick={() => {
                    contactOpen = true;
                    shareOpen = false;
                }}
            >
                <IconContact size={20} />
            </button>
        {/if}
        <button
            type="button"
            class="action"
            aria-label="Share"
            onclick={() => {
                shareOpen = true;
                contactOpen = false;
            }}
        >
            <IconShare size={20} />
        </button>
    </div>
</div>

<div class="card hero-header-wrapper">
    <header class="hero-header" data-layout={heroLayout ?? 'side-by-side'}>
        {#if profileImage}
            <div class="hero-avatar">
                <img
                    src="/assets/images/{profileImage}.webp"
                    alt="{person?.name ?? 'mifi'} profile"
                    width="160"
                    height="160"
                    fetchpriority="high"
                />
            </div>
        {/if}
        <div class="hero-content">
            <h1 class="wordmark">mifi</h1>
            <h2 class="wordmark-explainer">
                <strong>Mi</strong>ke <strong>Fi</strong>tzpatrick
            </h2>
            {#if pronunciation || pronouns || location}
                <p class="hero-meta">
                    {#if pronunciation}<span>{pronunciation}</span>{/if}
                    {#if pronunciation && pronouns}
                        <span class="hero-meta-sep" aria-hidden="true"> · </span>{/if}
                    {#if pronouns}<span>{pronouns}</span>{/if}
                    {#if pronouns && location}
                        {#if (heroLayout ?? HeroLayout.SIDE_BY_SIDE) === HeroLayout.SIDE_BY_SIDE}
                            <br />
                        {:else}
                            <span class="hero-meta-sep" aria-hidden="true"> · </span>
                        {/if}
                    {/if}
                    {#if location}<span>{location}</span>{/if}
                </p>
            {/if}
        </div>
        <div class="button-group">
            {#if showContactButton}
                <button
                    type="button"
                    class="button"
                    aria-label="Contact"
                    onclick={() => {
                        contactOpen = true;
                        shareOpen = false;
                    }}
                >
                    <IconContact size={20} />
                    <span>Contact</span>
                </button>
            {/if}
            <button
                type="button"
                class="button"
                aria-label="Share"
                onclick={() => {
                    shareOpen = true;
                    contactOpen = false;
                }}
            >
                <IconShare size={20} />
                <span>Share</span>
            </button>
        </div>
    </header>
</div>

<style>
    .hero-backdrop {
        position: relative;
        height: 24vh;
        min-height: 12rem;
        overflow: hidden;
        margin-bottom: 0;
    }

    .hero-bg {
        position: absolute;
        inset: 0;
        background-size: 220%;
        background-position: center;
        background-repeat: no-repeat;
        filter: blur(40px);
        transform: scale(1.1);
        z-index: 0;

        &::after {
            content: '';
            position: absolute;
            inset: 0;
            background: linear-gradient(
                to bottom,
                var(--color-bg) 0%,
                transparent 50%,
                var(--color-bg) 100%
            );
            opacity: 0.85;
        }
    }

    .hero-actions {
        position: absolute;
        top: 1rem;
        right: 1rem;
        display: flex;
        gap: 0.5rem;
        z-index: 2;
    }

    .hero-header-wrapper {
        border-radius: 1rem;
        box-shadow: 0 4px 1.5rem rgba(0, 0, 0, 0.08);
        margin: -6rem auto 0;
        max-width: 50ch;
        overflow: visible;
        padding: 1rem 1.5rem 1.5rem;
        position: relative;
        z-index: 1;
    }

    /* Hero content (avatar + wordmark) inside card */
    .hero-header {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1.25rem;
        text-align: center;

        &[data-layout='side-by-side'] {
            display: grid;
            grid-template-areas:
                'avatar content'
                'buttons buttons';
            grid-template-columns: auto 1fr;
            grid-template-rows: auto auto;
            gap: 1.5rem;
            text-align: left;
        }
    }

    /* Avatar: extends outside card top (half in card, half above) */
    .hero-avatar {
        background: var(--color-surface-elevated);
        border: 3px solid var(--color-surface);
        border-radius: 50%;
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.12);
        grid-area: avatar;
        flex-shrink: 0;
        height: 8rem;
        overflow: hidden;
        transform: translateY(-50%);
        width: 8rem;

        & img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            object-position: center;
            display: block;
        }
    }

    .hero-content {
        grid-area: content;
        min-width: 0;
    }

    .wordmark {
        font-family: var(--font-wordmark, var(--font-sans));
        font-weight: 700;
        font-size: clamp(2.5rem, 5vw, 3.5rem);
        letter-spacing: unset;
        line-height: 1.1;
        margin: 0 0 0.25rem;
        font-variant-ligatures: common-ligatures discretionary-ligatures;
    }

    .wordmark-explainer {
        font-family: var(--font-wordmark, var(--font-sans));
        font-weight: 400;
        font-size: 1rem;
        color: var(--color-primary-muted);
        margin: 0 0 0.5rem;

        & strong {
            font-weight: 700;
        }
    }

    .hero-meta {
        font-family: var(--font-body, var(--font-sans));
        font-size: 0.875rem;
        color: var(--color-secondary-muted);
        margin: 0;
    }

    .hero-meta-sep {
        white-space: pre;
    }

    .button-group {
        grid-area: buttons;
        display: flex;
        gap: 0.5rem;
        justify-content: center;
        width: 100%;
    }

    .button {
        align-items: center;
        background: var(--color-surface-elevated);
        border: 1px solid var(--color-secondary-muted);
        border-radius: 0.25rem;
        color: var(--color-fg);
        cursor: pointer;
        display: flex;
        flex: 1 1 auto;
        font-size: 1rem;
        gap: 0.5rem;
        justify-content: center;
        max-width: 50%;
        padding: 0.5rem 1rem;
        text-align: center;
        text-decoration: none;
        transition: background 0.2s ease-in-out;

        &:hover,
        &:focus-visible {
            background: var(--color-secondary-muted);
            color: var(--color-surface-elevated);
        }

        &:focus-visible {
            outline: 2px solid var(--color-focus-ring);
            outline-offset: 2px;
        }
    }
</style>

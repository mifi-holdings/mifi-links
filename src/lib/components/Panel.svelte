<script lang="ts">
    import type { Component } from 'svelte';
    import { tick } from 'svelte';

    let {
        children,
        icon: IconComponent,
        onclose = () => {},
        open = false,
        title = '',
    }: {
        children: import('svelte').Snippet;
        icon?: Component<{ size?: number }>;
        onclose: () => void;
        open: boolean;
        title: string;
    } = $props();

    let dialogEl: HTMLDialogElement | undefined;
    let closeBtnEl: HTMLButtonElement | undefined;

    function handleDialogClose() {
        onclose();
    }

    $effect(() => {
        if (!dialogEl) return;
        if (open) {
            dialogEl.showModal();
            void tick().then(() => closeBtnEl?.focus());
        } else {
            dialogEl.close();
        }
    });
</script>

<dialog
    bind:this={dialogEl}
    class="panel-dialog"
    closedby="any"
    aria-labelledby="panel-title"
    aria-modal="true"
    onclose={handleDialogClose}
    oncancel={(e) => {
        e.preventDefault();
        onclose();
    }}
>
    <div class="panel">
        <header class="header">
            <h2 id="panel-title" class="title heading">
                {#if IconComponent}
                    <IconComponent size={24} />
                {/if}
                {title}
            </h2>
            <button
                type="button"
                class="close-button"
                aria-label="Close"
                bind:this={closeBtnEl}
                onclick={onclose}
            >
                <span aria-hidden="true">×</span>
            </button>
        </header>
        <div class="body">
            {@render children?.()}
        </div>
    </div>
</dialog>

<style>
    .panel-dialog {
        background-color: transparent;
        margin: 0;
        padding: 0;
        border: none;
        max-height: 80vh;
        max-width: 100%;
        width: 100%;
        inset: auto;
        position: fixed;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);

        &::backdrop {
            background: rgba(0, 0, 0, 0.4);
        }

        @media (min-width: 769px) {
            bottom: auto;
            max-width: min(28rem, calc(100vw - 2rem));
            top: 50%;
            transform: translate(-50%, -50%);
        }
    }

    .panel {
        background: var(--color-surface);
        border: 1px solid var(--color-border);
        border-radius: 1rem 1rem 0 0;
        box-shadow: 0 -4px 1rem rgb(0 0 0 / 15%);
        flex-direction: column;
        display: flex;
        max-height: 70vh;
        padding-bottom: 2rem;
        overflow: hidden;
        width: 100%;

        @media (min-width: 769px) {
            max-height: 80vh;
            border-radius: 1rem;
        }
    }

    .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 1rem 1.25rem;
        border-bottom: 1px solid var(--color-border-subtle);
        flex-shrink: 0;
    }

    .title {
        align-items: center;
        color: var(--color-fg);
        display: flex;
        flex: 1 1 auto;
        font-family: var(--font-heading, var(--font-sans));
        font-weight: 600;
        font-size: 1.125rem;
        gap: 0.5rem;
        justify-content: center;
        margin: 0;
    }

    .close-button {
        flex: 0 0 auto;
        font: inherit;
        font-size: 1.5rem;
        line-height: 1;
        padding: 0.25rem;
        background: none;
        border: none;
        color: var(--color-fg);
        cursor: pointer;
        border-radius: 0.25rem;

        &:hover,
        &:focus-visible {
            background: var(--color-border-subtle);
        }

        &:focus-visible {
            outline: 2px solid var(--color-focus-ring);
            outline-offset: 2px;
        }
    }

    .body {
        padding: 1.25rem;
        overflow-y: auto;
        flex: 1;
        min-height: 0;
    }
</style>

<script lang="ts">
    import { Moon, SunMoon, Sun } from '@lucide/svelte';
    import { getStoredTheme, setTheme } from '$lib/theme';
    import type { ThemeMode } from '$lib/theme';

    const SLOT_WIDTH = 48;
    const GAP = 8;
    /** When collapsed, track translateX so the active option is in the 48px viewport (left=Light, middle=Dark, right=Auto). */
    const OFFSETS: Record<ThemeMode, number> = {
        light: 0,
        dark: -(SLOT_WIDTH + GAP),
        auto: -(SLOT_WIDTH + GAP) * 2,
    };

    let current = $state<ThemeMode>('auto');
    let expanded = $state(false);

    const themeOffset = $derived(OFFSETS[current]);

    $effect(() => {
        if (typeof document === 'undefined') return;
        current = getStoredTheme();
    });

    function choose(mode: ThemeMode) {
        setTheme(mode);
        current = mode;
    }

    function handleClick(mode: ThemeMode) {
        if (expanded) {
            choose(mode);
            expanded = false;
        } else {
            expanded = true;
        }
    }
</script>

{#if expanded}
    <!-- Click outside to collapse -->
    <button
        type="button"
        class="theme-toggle-backdrop"
        aria-label="Close theme menu"
        tabindex="-1"
        onclick={() => (expanded = false)}
        data-umami-event="theme toggle close"
    ></button>
{/if}

<div
    class="theme-toggle"
    class:expanded
    role="group"
    aria-label="Color theme"
    style="--theme-offset: {themeOffset}px;"
>
    <div class="theme-toggle-track">
        <button
            type="button"
            class="action theme-option"
            class:active={expanded && current === 'light'}
            aria-label="Light"
            aria-current={current === 'light' ? 'true' : undefined}
            title="Light"
            onclick={() => handleClick('light')}
            data-umami-event="theme toggle light"
        >
            <Sun size={24} />
        </button>
        <button
            type="button"
            class="action theme-option"
            class:active={expanded && current === 'dark'}
            aria-label="Dark"
            aria-current={current === 'dark' ? 'true' : undefined}
            title="Dark"
            onclick={() => handleClick('dark')}
            data-umami-event="theme toggle dark"
        >
            <Moon size={24} />
        </button>
        <button
            type="button"
            class="action theme-option"
            class:active={expanded && current === 'auto'}
            aria-label="Auto (system)"
            aria-current={current === 'auto' ? 'true' : undefined}
            title="Auto (system)"
            onclick={() => handleClick('auto')}
            data-umami-event="theme toggle auto"
        >
            <SunMoon size={24} />
        </button>
    </div>
</div>

<style>
    .theme-toggle-backdrop {
        position: fixed;
        inset: 0;
        z-index: 99;
        padding: 0;
        border: none;
        background: transparent;
        cursor: default;
    }

    /* Collapsed: match hero-action (other header buttons); expanded: glass panel */
    .theme-toggle {
        position: relative;
        z-index: 100;
        display: inline-block;
        width: 48px;
        padding: 0;
        overflow: hidden;
        border-radius: 50%;
        border: none;
        transition:
            width 0.22s ease-out,
            padding 0.22s ease-out,
            border-radius 0.22s ease-out,
            background 0.22s ease-out,
            box-shadow 0.22s ease-out,
            backdrop-filter 0.22s ease-out;
        background: var(--color-surface-elevated);
        box-shadow: 0 2px 8px rgb(0 0 0 / 15%);
    }

    .theme-toggle.expanded {
        width: 176px;
        padding: 0.5rem;
        border-radius: 1rem;
        border: 1px solid color-mix(in srgb, var(--color-border) 60%, transparent);
        background: color-mix(in srgb, var(--color-surface-elevated) 52%, transparent);
        backdrop-filter: blur(20px) saturate(1.2);
        -webkit-backdrop-filter: blur(20px) saturate(1.2);
        box-shadow:
            0 0 0 1px color-mix(in srgb, white 12%, transparent) inset,
            0 4px 24px rgba(0, 0, 0, 0.12),
            0 2px 8px rgba(0, 0, 0, 0.08);
    }

    .theme-toggle-track {
        display: flex;
        gap: 0.5rem;
        width: 160px;
        transform: translateX(var(--theme-offset));
        transition: transform 0.22s ease-out;
    }

    .theme-toggle.expanded .theme-toggle-track {
        transform: translateX(0);
    }

    .theme-option.active {
        background: var(--color-primary);
        color: var(--color-bg);
    }
</style>

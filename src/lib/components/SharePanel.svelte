<script lang="ts">
    import Panel from './Panel.svelte';
    import IconCopy from './icons/IconCopy.svelte';
    import IconEmail from './icons/IconEmail.svelte';
    import IconShare from './icons/IconShare.svelte';

    let {
        open = false,
        url = '',
        qrCodeImage = '',
        emailSubject = 'Link from mifi',
        emailBody = '',
        onclose = () => {},
    }: {
        open: boolean;
        url: string;
        qrCodeImage?: string | null;
        emailSubject?: string;
        emailBody?: string;
        onclose: () => void;
    } = $props();

    let copied = $state(false);

    function copyLink() {
        if (typeof navigator === 'undefined' || !navigator.clipboard) return;
        navigator.clipboard.writeText(url).then(() => {
            copied = true;
            setTimeout(() => (copied = false), 2000);
        });
    }

    function share() {
        if (typeof navigator === 'undefined' || !navigator.share) return;
        navigator
            .share({ title: 'mifi', url })
            .then(() => onclose())
            .catch(() => {});
    }

    const canShare = $derived(typeof navigator !== 'undefined' && !!navigator.share);
    const mailtoHref = $derived(
        `mailto:?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody || url)}`,
    );
</script>

<Panel {open} icon={IconShare} title="Share" {onclose}>
    {#snippet children()}
        <div class="share-panel">
            {#if qrCodeImage}
                <div class="share-qr">
                    <img
                        src="/assets/images/{qrCodeImage}.png"
                        alt="QR code for this page"
                        width="160"
                        height="160"
                    />
                </div>
            {/if}
            <button type="button" class="panel-btn" onclick={copyLink}>
                <IconCopy size={20} />
                {copied ? 'Copied!' : 'Copy link'}
            </button>
            <a
                href={mailtoHref}
                class="panel-btn"
                onclick={onclose}
                target="_blank"
                rel="noopener noreferrer"
            >
                <IconEmail size={20} />
                Email link
            </a>
            {#if canShare}
                <button type="button" class="panel-btn" onclick={share}>
                    <IconShare size={20} />
                    Share…
                </button>
            {/if}
        </div>
    {/snippet}
</Panel>

<style>
    .share-panel {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
    }

    .share-qr {
        display: flex;
        justify-content: center;
        margin-bottom: 0.5rem;

        & img {
            display: block;
        }
    }
</style>

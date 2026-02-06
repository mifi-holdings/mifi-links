/**
 * Theme: light | dark | auto. Stored in localStorage as 'mifi-theme'.
 * Default is auto (no attribute; CSS uses prefers-color-scheme).
 */

export type ThemeMode = 'light' | 'dark' | 'auto';

const STORAGE_KEY = 'mifi-theme';

export function getStoredTheme(): ThemeMode {
    if (typeof window === 'undefined') return 'auto';
    const t = localStorage.getItem(STORAGE_KEY);
    if (t === 'light' || t === 'dark' || t === 'auto') return t;
    return 'auto';
}

export function setTheme(mode: ThemeMode): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, mode);
    if (mode === 'light' || mode === 'dark') {
        document.documentElement.setAttribute('data-theme', mode);
    } else {
        document.documentElement.removeAttribute('data-theme');
    }
}

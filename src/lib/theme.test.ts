import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getStoredTheme, setTheme } from './theme';

describe('theme', () => {
    const STORAGE_KEY = 'mifi-theme';
    let localStorageMock: Record<string, string>;

    beforeEach(() => {
        localStorageMock = {};
        vi.stubGlobal('localStorage', {
            getItem: (key: string) => localStorageMock[key] ?? null,
            setItem: (key: string, value: string) => {
                localStorageMock[key] = value;
            },
            removeItem: () => {},
            clear: () => {},
            length: 0,
            key: () => null,
        });
        vi.stubGlobal('document', {
            documentElement: {
                setAttribute: vi.fn(),
                removeAttribute: vi.fn(),
            },
        });
    });

    afterEach(() => {
        vi.unstubAllGlobals();
    });

    describe('getStoredTheme', () => {
        it('returns "auto" when window is undefined', () => {
            const originalWindow = globalThis.window;
            // @ts-expect-error unsetting for test
            delete globalThis.window;
            expect(getStoredTheme()).toBe('auto');
            globalThis.window = originalWindow;
        });

        it('returns stored value when it is light, dark, or auto', () => {
            vi.stubGlobal('window', {});
            localStorageMock[STORAGE_KEY] = 'light';
            expect(getStoredTheme()).toBe('light');
            localStorageMock[STORAGE_KEY] = 'dark';
            expect(getStoredTheme()).toBe('dark');
            localStorageMock[STORAGE_KEY] = 'auto';
            expect(getStoredTheme()).toBe('auto');
        });

        it('returns "auto" when stored value is invalid', () => {
            vi.stubGlobal('window', {});
            localStorageMock[STORAGE_KEY] = 'invalid';
            expect(getStoredTheme()).toBe('auto');
            localStorageMock[STORAGE_KEY] = '';
            expect(getStoredTheme()).toBe('auto');
        });

        it('returns "auto" when nothing is stored', () => {
            vi.stubGlobal('window', {});
            expect(getStoredTheme()).toBe('auto');
        });
    });

    describe('setTheme', () => {
        it('does nothing when window is undefined', () => {
            const originalWindow = globalThis.window;
            // @ts-expect-error unsetting for test
            delete globalThis.window;
            expect(() => setTheme('light')).not.toThrow();
            globalThis.window = originalWindow;
        });

        it('sets localStorage and data-theme for light and dark', () => {
            vi.stubGlobal('window', {});
            setTheme('light');
            expect(localStorageMock[STORAGE_KEY]).toBe('light');
            expect(document.documentElement.setAttribute).toHaveBeenCalledWith(
                'data-theme',
                'light',
            );
            setTheme('dark');
            expect(localStorageMock[STORAGE_KEY]).toBe('dark');
            expect(document.documentElement.setAttribute).toHaveBeenCalledWith(
                'data-theme',
                'dark',
            );
        });

        it('removes data-theme for auto', () => {
            vi.stubGlobal('window', {});
            setTheme('auto');
            expect(localStorageMock[STORAGE_KEY]).toBe('auto');
            expect(document.documentElement.removeAttribute).toHaveBeenCalledWith('data-theme');
        });
    });
});

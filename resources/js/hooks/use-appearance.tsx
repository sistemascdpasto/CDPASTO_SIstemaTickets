// The system is locked to the light theme. Dark and "system" are disabled.
export type Appearance = 'light';

export function initializeTheme() {
    document.documentElement.classList.remove('dark');
    try {
        localStorage.setItem('appearance', 'light');
    } catch {
        // ignore storage errors (private mode, etc.)
    }
}

export function useAppearance() {
    return {
        appearance: 'light' as Appearance,
        updateAppearance: (_mode: Appearance) => {
            // no-op: the theme is fixed to light
        },
    };
}

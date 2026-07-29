/**
 * @fileoverview Browser helpers for CAE public light/dark theme persistence.
 * Separate from Admin (`cae-admin-theme`); public default is dark-first.
 */

/** localStorage key for the public site theme preference. */
export const PUBLIC_THEME_STORAGE_KEY = "cae-public-theme";

/** Allowed public theme values. */
export type PublicTheme = "light" | "dark";

/**
 * Narrows an unknown value to a valid public theme.
 *
 * @param value - Candidate theme string.
 * @returns Theme when valid; otherwise `null`.
 */
export function parsePublicTheme(value: unknown): PublicTheme | null {
  if (value === "light" || value === "dark") {
    return value;
  }
  return null;
}

/**
 * Reads the stored public theme, defaulting to dark (marketing dark-first).
 *
 * @returns Resolved theme.
 */
export function readStoredPublicTheme(): PublicTheme {
  try {
    const stored = window.localStorage.getItem(PUBLIC_THEME_STORAGE_KEY);
    const parsed = parsePublicTheme(stored);
    if (parsed !== null) {
      return parsed;
    }
  } catch {
    /* ignore storage errors */
  }
  return "dark";
}

/**
 * Applies a theme to `document.documentElement` and persists it.
 *
 * @param theme - Theme to apply.
 */
export function applyPublicTheme(theme: PublicTheme): void {
  document.documentElement.setAttribute("data-theme", theme);
  try {
    window.localStorage.setItem(PUBLIC_THEME_STORAGE_KEY, theme);
  } catch {
    /* ignore storage errors */
  }
}

/**
 * Toggles between light and dark public themes.
 *
 * @returns The theme after toggling.
 */
export function togglePublicTheme(): PublicTheme {
  const current = parsePublicTheme(
    document.documentElement.getAttribute("data-theme"),
  );
  const next: PublicTheme = current === "light" ? "dark" : "light";
  applyPublicTheme(next);
  return next;
}

/**
 * Returns the accessible label for the theme toggle given the current theme.
 *
 * @param theme - Currently active theme.
 * @returns Button aria-label.
 */
export function publicThemeToggleLabel(theme: PublicTheme): string {
  return theme === "dark" ? "Switch to light mode" : "Switch to dark mode";
}

/**
 * Returns short visible text for the theme toggle button.
 *
 * @param theme - Currently active theme.
 * @returns Button label text.
 */
export function publicThemeToggleText(theme: PublicTheme): string {
  return theme === "dark" ? "Light" : "Dark";
}

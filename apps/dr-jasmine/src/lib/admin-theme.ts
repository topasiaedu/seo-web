/**
 * @fileoverview Browser helpers for Dr Jasmine Admin light/dark theme persistence.
 */

/** localStorage key for the Admin theme preference. */
export const ADMIN_THEME_STORAGE_KEY = "dr-jasmine-admin-theme";

/** Allowed Admin theme values. */
export type AdminTheme = "light" | "dark";

/**
 * Narrows an unknown value to a valid Admin theme.
 *
 * @param value - Candidate theme string.
 * @returns Theme when valid; otherwise `null`.
 */
export function parseAdminTheme(value: unknown): AdminTheme | null {
  if (value === "light" || value === "dark") {
    return value;
  }
  return null;
}

/**
 * Reads the stored Admin theme, defaulting to light.
 *
 * @returns Resolved theme.
 */
export function readStoredAdminTheme(): AdminTheme {
  try {
    const stored = window.localStorage.getItem(ADMIN_THEME_STORAGE_KEY);
    const parsed = parseAdminTheme(stored);
    if (parsed !== null) {
      return parsed;
    }
  } catch {
    /* ignore storage errors */
  }
  return "light";
}

/**
 * Applies a theme to `document.documentElement` and persists it.
 *
 * @param theme - Theme to apply.
 */
export function applyAdminTheme(theme: AdminTheme): void {
  document.documentElement.setAttribute("data-theme", theme);
  try {
    window.localStorage.setItem(ADMIN_THEME_STORAGE_KEY, theme);
  } catch {
    /* ignore storage errors */
  }
}

/**
 * Toggles between light and dark Admin themes.
 *
 * @returns The theme after toggling.
 */
export function toggleAdminTheme(): AdminTheme {
  const current = parseAdminTheme(
    document.documentElement.getAttribute("data-theme"),
  );
  const next: AdminTheme = current === "dark" ? "light" : "dark";
  applyAdminTheme(next);
  return next;
}

/**
 * Returns the accessible label for the theme toggle given the current theme.
 *
 * @param theme - Currently active theme.
 * @returns Button aria-label / visible hint.
 */
export function adminThemeToggleLabel(theme: AdminTheme): string {
  return theme === "dark" ? "Switch to light mode" : "Switch to dark mode";
}

/**
 * Returns short visible text for the theme toggle button.
 *
 * @param theme - Currently active theme.
 * @returns Button label text.
 */
export function adminThemeToggleText(theme: AdminTheme): string {
  return theme === "dark" ? "Light" : "Dark";
}

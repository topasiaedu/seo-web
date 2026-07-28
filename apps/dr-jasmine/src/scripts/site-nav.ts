/**
 * @fileoverview Client script for the public site navigation mobile menu.
 * Handles hamburger toggle, aria state, escape-to-close, and link-click close.
 */

/** Root element attribute that marks the site nav shell. */
export const SITE_NAV_ROOT_SELECTOR = "[data-site-nav]";

/** Toggle button inside the nav root. */
const TOGGLE_SELECTOR = "[data-site-nav-toggle]";

/** Mobile menu panel controlled by the toggle. */
const PANEL_SELECTOR = "[data-site-nav-panel]";

/**
 * Joins Astro `BASE_URL` with a public site-relative path.
 *
 * @param baseUrl - Astro base (e.g. `/dr-jasmine/`).
 * @param path - Site path such as `blog` or `/`.
 * @returns Absolute-from-origin path including base.
 */
export function joinPublicPath(baseUrl: string, path: string): string {
  if (typeof baseUrl !== "string") {
    throw new Error("joinPublicPath requires a string baseUrl.");
  }
  if (typeof path !== "string" || path.trim().length === 0) {
    throw new Error("joinPublicPath requires a non-empty path.");
  }
  const base = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
  const trimmedPath = path.trim();
  if (trimmedPath === "" || trimmedPath === "/") {
    return base;
  }
  const relative = trimmedPath.startsWith("/") ? trimmedPath.slice(1) : trimmedPath;
  return `${base}${relative}`;
}

/**
 * Whether a nav href matches the current pathname (prefix-aware for nested routes).
 * Hash fragments are ignored for matching so in-page anchors do not break active state.
 *
 * @param pathname - Current request pathname.
 * @param href - Nav link href including base.
 * @param exact - When true, only exact match (home).
 * @returns Whether the link represents the active route.
 */
export function isPublicNavActive(
  pathname: string,
  href: string,
  exact: boolean,
): boolean {
  const hashIndex = href.indexOf("#");
  const hrefPath = hashIndex >= 0 ? href.slice(0, hashIndex) : href;

  /** In-page anchors (same path + hash) are never marked as the current page. */
  if (hashIndex >= 0) {
    return false;
  }

  const normalizedPath =
    pathname.endsWith("/") && pathname.length > 1
      ? pathname.slice(0, -1)
      : pathname;
  const normalizedHref =
    hrefPath.endsWith("/") && hrefPath.length > 1
      ? hrefPath.slice(0, -1)
      : hrefPath;

  if (exact) {
    return normalizedPath === normalizedHref;
  }
  return (
    normalizedPath === normalizedHref ||
    normalizedPath.startsWith(`${normalizedHref}/`)
  );
}

/**
 * Sets mobile menu open state and syncs aria attributes on toggle and panel.
 *
 * @param root - Site nav root element.
 * @param open - Whether the mobile panel should be visible.
 */
function setMobileMenuOpen(root: HTMLElement, open: boolean): void {
  const toggle = root.querySelector<HTMLButtonElement>(TOGGLE_SELECTOR);
  const panel = root.querySelector<HTMLElement>(PANEL_SELECTOR);

  if (toggle === null || panel === null) {
    return;
  }

  root.dataset.menuOpen = open ? "true" : "false";
  toggle.setAttribute("aria-expanded", open ? "true" : "false");
  toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  panel.hidden = !open;
}

/**
 * Initializes mobile menu interactions for every `[data-site-nav]` on the page.
 */
export function initSiteNavMobileMenu(): void {
  const roots = document.querySelectorAll<HTMLElement>(SITE_NAV_ROOT_SELECTOR);

  for (const root of roots) {
    const toggle = root.querySelector<HTMLButtonElement>(TOGGLE_SELECTOR);
    const panel = root.querySelector<HTMLElement>(PANEL_SELECTOR);

    if (toggle === null || panel === null) {
      continue;
    }

    setMobileMenuOpen(root, false);

    toggle.addEventListener("click", () => {
      const isOpen = root.dataset.menuOpen === "true";
      setMobileMenuOpen(root, !isOpen);
    });

    panel.addEventListener("click", (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) {
        return;
      }
      const link = target.closest("a");
      if (link !== null) {
        setMobileMenuOpen(root, false);
      }
    });

    document.addEventListener("keydown", (event: KeyboardEvent) => {
      if (event.key === "Escape" && root.dataset.menuOpen === "true") {
        setMobileMenuOpen(root, false);
        toggle.focus();
      }
    });

    window.matchMedia("(min-width: 768px)").addEventListener("change", (mq) => {
      if (mq.matches) {
        setMobileMenuOpen(root, false);
      }
    });
  }
}

if (typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", () => {
    initSiteNavMobileMenu();
  });
}

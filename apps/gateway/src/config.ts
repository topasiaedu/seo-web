/**
 * Gateway listen port and upstream targets for path-based proxying.
 */

/** Default HTTP port when `PORT` is unset. */
export const DEFAULT_PORT = 4321;

/**
 * Parses `PORT` from the environment, falling back to {@link DEFAULT_PORT}.
 *
 * @returns A valid TCP port in the range 1–65535.
 */
export function resolveListenPort(): number {
  const raw = process.env["PORT"];
  if (raw === undefined || raw.trim() === "") {
    return DEFAULT_PORT;
  }

  const parsed = Number.parseInt(raw, 10);
  if (!Number.isInteger(parsed) || parsed < 1 || parsed > 65535) {
    throw new Error(
      `Invalid PORT "${raw}": expected an integer between 1 and 65535.`,
    );
  }

  return parsed;
}

/**
 * Upstream origin for the CAE Astro app (`@seo/cae` on port 4322).
 */
export const CAE_UPSTREAM = "http://127.0.0.1:4322";

/**
 * Upstream origin for the Dr Jasmine Astro app (`@seo/dr-jasmine` on port 4323).
 */
export const DR_JASMINE_UPSTREAM = "http://127.0.0.1:4323";

/**
 * Path prefixes that are deferred (not migrated to independent apps yet).
 */
export const DEFERRED_PATH_PREFIXES = ["/cms"] as const;

export type DeferredPathPrefix = (typeof DEFERRED_PATH_PREFIXES)[number];

/**
 * Plain-text HTTP responses for non-proxied gateway routes.
 */

import type { ServerResponse } from "node:http";
import type { DeferredPathPrefix } from "./config.js";

/**
 * Writes a UTF-8 plain-text response with the given status code.
 *
 * @param res - Outgoing response.
 * @param statusCode - HTTP status code.
 * @param body - Response body text.
 */
export function sendPlainText(
  res: ServerResponse,
  statusCode: number,
  body: string,
): void {
  res.writeHead(statusCode, {
    "Content-Type": "text/plain; charset=utf-8",
  });
  res.end(body);
}

/**
 * 404 for brands/platforms not yet migrated to independent apps.
 *
 * @param res - Outgoing response.
 * @param prefix - Deferred path prefix that was requested.
 */
export function sendNotMigratedYet(
  res: ServerResponse,
  prefix: DeferredPathPrefix,
): void {
  const body = [
    "404 Not Found",
    "",
    prefix + " is not migrated yet.",
    "See docs/future-enhancements/independent-apps-dr-jasmine-and-cms.md",
  ].join("\n");

  sendPlainText(res, 404, body);
}

/**
 * Simple index for the gateway root.
 *
 * @param res - Outgoing response.
 * @param port - Listen port (for self-describing URLs in the message).
 */
export function sendGatewayIndex(res: ServerResponse, port: number): void {
  const body = [
    "SEO website gateway",
    "",
    "Listening on port " + String(port) + ".",
    "",
    "Available:",
    "  /cae  →  http://127.0.0.1:4322  (@seo/cae)",
    "",
    "Deferred (not migrated yet):",
    "  /dr-jasmine",
    "  /cms",
  ].join("\n");

  sendPlainText(res, 200, body);
}

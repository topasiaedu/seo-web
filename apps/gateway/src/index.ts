/**
 * Path-based HTTP gateway for local multi-app development.
 *
 * Listens on `PORT` (default 4321) and proxies `/cae` to the CAE Astro app.
 */

import http from "node:http";
import {
  DEFERRED_PATH_PREFIXES,
  resolveListenPort,
  type DeferredPathPrefix,
} from "./config.js";
import { isCaePath, proxyCaeUpgrade, proxyToCae } from "./proxy.js";
import {
  sendGatewayIndex,
  sendNotMigratedYet,
  sendPlainText,
} from "./responses.js";

/**
 * Extracts the pathname from a request URL, defaulting to `/`.
 *
 * @param url - Raw `req.url` value (path + optional query).
 */
function getPathname(url: string | undefined): string {
  if (url === undefined || url === "") {
    return "/";
  }

  try {
    return new URL(url, "http://127.0.0.1").pathname;
  } catch {
    return "/";
  }
}

/**
 * Returns the deferred path prefix if `pathname` matches one, else `null`.
 *
 * @param pathname - Request pathname.
 */
function matchDeferredPrefix(
  pathname: string,
): DeferredPathPrefix | null {
  for (const prefix of DEFERRED_PATH_PREFIXES) {
    if (pathname === prefix || pathname.startsWith(prefix + "/")) {
      return prefix;
    }
  }

  return null;
}

const port = resolveListenPort();

const server = http.createServer((req, res) => {
  const pathname = getPathname(req.url);

  if (pathname === "/" || pathname === "") {
    sendGatewayIndex(res, port);
    return;
  }

  if (isCaePath(pathname)) {
    proxyToCae(req, res);
    return;
  }

  const deferred = matchDeferredPrefix(pathname);
  if (deferred !== null) {
    sendNotMigratedYet(res, deferred);
    return;
  }

  sendPlainText(
    res,
    404,
    [
      "404 Not Found",
      "",
      "No route for " + pathname + ".",
      "Try /cae (requires @seo/cae on port 4322).",
    ].join("\n"),
  );
});

server.on("upgrade", (req, socket, head) => {
  const pathname = getPathname(req.url);

  if (isCaePath(pathname)) {
    proxyCaeUpgrade(req, socket, head);
    return;
  }

  socket.destroy();
});

server.listen(port, "0.0.0.0", () => {
  process.stdout.write(
    [
      "[@seo/gateway] listening on http://127.0.0.1:" + String(port),
      "  /cae → http://127.0.0.1:4322",
      "  /dr-jasmine, /cms → 404 (not migrated yet)",
      "",
    ].join("\n"),
  );
});

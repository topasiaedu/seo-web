/**
 * HTTP(S) and WebSocket proxy helpers for path-based routing.
 */

import type { IncomingMessage, ServerResponse } from "node:http";
import type { Duplex } from "node:stream";
import httpProxy from "http-proxy";
import { CAE_UPSTREAM, DR_JASMINE_UPSTREAM } from "./config.js";

/**
 * Shared proxy instance used for CAE (supports HTTP and WebSocket for Vite HMR).
 */
export const caeProxy = httpProxy.createProxyServer({
  target: CAE_UPSTREAM,
  changeOrigin: true,
  ws: true,
  xfwd: true,
});

/**
 * Returns true when the request path is `/cae` or under `/cae/`.
 *
 * @param pathname - URL pathname (no query string).
 */
export function isCaePath(pathname: string): boolean {
  return pathname === "/cae" || pathname.startsWith("/cae/");
}

/**
 * Proxies an HTTP request to the CAE upstream.
 * Responds with 502 when the upstream is unreachable.
 *
 * @param req - Incoming client request.
 * @param res - Outgoing client response.
 */
export function proxyToCae(
  req: IncomingMessage,
  res: ServerResponse,
): void {
  caeProxy.web(req, res, {}, (error: Error) => {
    if (res.headersSent) {
      res.end();
      return;
    }

    const message = [
      "502 Bad Gateway",
      "",
      "CAE upstream is not reachable at " + CAE_UPSTREAM + ".",
      "Start @seo/cae on port 4322 (e.g. pnpm --filter @seo/cae dev), then retry.",
      "",
      "Detail: " + error.message,
    ].join("\n");

    res.writeHead(502, {
      "Content-Type": "text/plain; charset=utf-8",
    });
    res.end(message);
  });
}

/**
 * Proxies a WebSocket upgrade to the CAE upstream (Astro/Vite HMR).
 *
 * @param req - Upgrade request.
 * @param socket - Client duplex socket.
 * @param head - First packet of the upgraded stream.
 */
export function proxyCaeUpgrade(
  req: IncomingMessage,
  socket: Duplex,
  head: Buffer,
): void {
  caeProxy.ws(req, socket, head, {}, (error: Error) => {
    socket.destroy(error);
  });
}

/**
 * Shared proxy instance used for Dr Jasmine (supports HTTP and WebSocket for Vite HMR).
 */
export const drJasmineProxy = httpProxy.createProxyServer({
  target: DR_JASMINE_UPSTREAM,
  changeOrigin: true,
  ws: true,
  xfwd: true,
});

/**
 * Returns true when the request path is `/dr-jasmine` or under `/dr-jasmine/`.
 *
 * @param pathname - URL pathname (no query string).
 */
export function isDrJasminePath(pathname: string): boolean {
  return pathname === "/dr-jasmine" || pathname.startsWith("/dr-jasmine/");
}

/**
 * Proxies an HTTP request to the Dr Jasmine upstream.
 * Responds with 502 when the upstream is unreachable.
 *
 * @param req - Incoming client request.
 * @param res - Outgoing client response.
 */
export function proxyToDrJasmine(
  req: IncomingMessage,
  res: ServerResponse,
): void {
  drJasmineProxy.web(req, res, {}, (error: Error) => {
    if (res.headersSent) {
      res.end();
      return;
    }

    const message = [
      "502 Bad Gateway",
      "",
      "Dr Jasmine upstream is not reachable at " + DR_JASMINE_UPSTREAM + ".",
      "Start @seo/dr-jasmine on port 4323 (e.g. pnpm --filter @seo/dr-jasmine dev), then retry.",
      "",
      "Detail: " + error.message,
    ].join("\n");

    res.writeHead(502, {
      "Content-Type": "text/plain; charset=utf-8",
    });
    res.end(message);
  });
}

/**
 * Proxies a WebSocket upgrade to the Dr Jasmine upstream (Astro/Vite HMR).
 *
 * @param req - Upgrade request.
 * @param socket - Client duplex socket.
 * @param head - First packet of the upgraded stream.
 */
export function proxyDrJasmineUpgrade(
  req: IncomingMessage,
  socket: Duplex,
  head: Buffer,
): void {
  drJasmineProxy.ws(req, socket, head, {}, (error: Error) => {
    socket.destroy(error);
  });
}

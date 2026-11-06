import handler from "vinext/server/app-router-entry";

interface Env {
  ASSETS: Fetcher;
}

const IMMUTABLE_EXTENSIONS_REGEX = /\.(svg|webp|png|ico|jpg|jpeg|woff2?|css|js|map)$/i;

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const method = request.method;

    if (method !== "GET" && method !== "HEAD") {
      return handler.fetch(request, env, ctx);
    }

    const url = new URL(request.url);
    const cache = (caches as unknown as { default?: Cache }).default;
    if (!cache) {
      return handler.fetch(request, env, ctx);
    }

    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    const response = await handler.fetch(request, env, ctx);

    if (response.status === 200 || response.status === 204) {
      const isStaticAsset =
        url.pathname.startsWith("/assets/") ||
        url.pathname.startsWith("/_next/static/") ||
        IMMUTABLE_EXTENSIONS_REGEX.test(url.pathname);

      if (isStaticAsset) {
        const headers = new Headers(response.headers);
        if (!headers.has("Cache-Control") || headers.get("Cache-Control")?.includes("max-age=0")) {
          headers.set("Cache-Control", "public, max-age=31536000, immutable");
        }
        const staticResponse = new Response(response.body, {
          status: response.status,
          statusText: response.statusText,
          headers,
        });
        ctx.waitUntil(cache.put(request, staticResponse.clone()));
        return staticResponse;
      }

      const cacheControl = response.headers.get("Cache-Control");
      if (
        cacheControl &&
        !cacheControl.includes("no-store") &&
        !cacheControl.includes("no-cache") &&
        !cacheControl.includes("private")
      ) {
        ctx.waitUntil(cache.put(request, response.clone()));
      }
    }

    return response;
  },
};

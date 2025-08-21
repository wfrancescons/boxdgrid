import { FreshContext } from "$fresh/server.ts";

const ALLOWED_ORIGIN = Deno.env.get("ALLOWED_ORIGIN");

export async function handler(req: Request, ctx: FreshContext) {
  const origin = req.headers.get("Origin") || "";
  const isAllowed = origin === ALLOWED_ORIGIN;

  if (req.method === "OPTIONS") {
    const resp = new Response(null, { status: 204 });
    if (isAllowed) {
      const headers = resp.headers;
      headers.set("Access-Control-Allow-Origin", origin);
      headers.set("Access-Control-Allow-Methods", "GET, OPTIONS");
      headers.set("Access-Control-Allow-Headers", "Content-Type");
    }
    return resp;
  }

  const resp = await ctx.next();
  if (isAllowed) {
    const headers = resp.headers;
    headers.set("Access-Control-Allow-Origin", origin);
    headers.set("Access-Control-Allow-Methods", "GET, OPTIONS");
    headers.set("Access-Control-Allow-Headers", "Content-Type");
  }
  return resp;
}

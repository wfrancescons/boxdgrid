import { FreshContext } from "$fresh/server.ts";

const ALLOWED_ORIGIN = Deno.env.get("ALLOWED_ORIGIN");

export async function handler(req: Request, ctx: FreshContext) {
  const origin = req.headers.get("Origin") || "";
  const isAllowed = origin === ALLOWED_ORIGIN;

  if (req.method === "OPTIONS") {
    if (!isAllowed) {
      return new Response("CORS not allowed", { status: 403 });
    }

    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": origin,
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }

  if (!isAllowed) {
    return new Response("CORS not allowed", { status: 403 });
  }

  const resp = await ctx.next();
  resp.headers.set("Access-Control-Allow-Origin", origin);
  resp.headers.set("Access-Control-Allow-Methods", "GET, OPTIONS");
  resp.headers.set("Access-Control-Allow-Headers", "Content-Type");
  return resp;
}

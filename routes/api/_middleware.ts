import { FreshContext } from "$fresh/server.ts";

const ALLOWED_ORIGIN = Deno.env.get("ALLOWED_ORIGIN");

export async function handler(req: Request, ctx: FreshContext) {
  const origin = req.headers.get("Origin") || "";

  if (req.method === "OPTIONS") {
    const headers: Record<string, string> = {
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    if (origin === ALLOWED_ORIGIN) {
      headers["Access-Control-Allow-Origin"] = origin;
    }

    return new Response(null, {
      status: 204,
      headers,
    });
  }

  const resp = await ctx.next();

  if (origin === ALLOWED_ORIGIN) {
    resp.headers.set("Access-Control-Allow-Origin", origin);
    resp.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    resp.headers.set("Access-Control-Allow-Headers", "Content-Type");
  }

  return resp;
}

import { Handler } from "$fresh/server.ts";

export const handler: Handler = (req) => {
  const url = new URL(req.url);
  url.pathname = "/";
  return Response.redirect(url.toString(), 307);
};

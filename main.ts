import { App, staticFiles } from "fresh";
import { type State } from "./utils.ts";

export const app = new App<State>();

// Add static file serving middleware
app.use(staticFiles());
// Enable file-system based routing
app.fsRoutes();

app.notFound((ctx) => {
  return Response.redirect(ctx.url.origin, 307);
});

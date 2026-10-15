import { serve } from "bun";
import index from "./index.html";

const API_URL = process.env.API_URL ?? "http://localhost:3333";

const server = serve({
  port: Number(process.env.PORT ?? 3000),
  routes: {
    // Forward API calls to the Express server so the browser sees a single origin
    // (keeps session cookies first-party, no CORS).
    "/api/*": req => {
      const url = new URL(req.url);
      return fetch(new Request(API_URL + url.pathname + url.search, req)).catch(
        () => Response.json({ error: "API unavailable" }, { status: 502 }),
      );
    },

    // Serve index.html for all unmatched routes.
    "/*": index,
  },

  development: process.env.NODE_ENV !== "production" && {
    // Enable browser hot reloading in development
    hmr: true,

    // Echo console logs from the browser to the server
    console: true,
  },
});

console.log(`🚀 Web running at ${server.url}`);

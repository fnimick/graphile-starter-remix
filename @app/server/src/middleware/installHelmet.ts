import { Express } from "express";
import type { HelmetOptions } from "helmet" assert { "resolution-mode": "import" };

const tmpRootUrl = process.env.ROOT_URL;

if (!tmpRootUrl || typeof tmpRootUrl !== "string") {
  throw new Error("Envvar ROOT_URL is required.");
}
const ROOT_URL = tmpRootUrl;

const isDevOrTest =
  process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test";

export default async function installHelmet(app: Express) {
  const { default: helmet, contentSecurityPolicy } = await import("helmet");
  const options = {
    contentSecurityPolicy: {
      directives: {
        ...contentSecurityPolicy.getDefaultDirectives(),
        "connect-src": [
          "'self'",
          // Safari doesn't allow using wss:// origins as 'self' from
          // an https:// page, so we have to translate explicitly for
          // it.
          ROOT_URL.replace(/^http/, "ws"),
        ],
        "script-src": ["'self'"],
      },
    },
    // Enables prettier script and SVG icon in GraphiQL
    crossOriginEmbedderPolicy: !(isDevOrTest || !!process.env.ENABLE_GRAPHIQL),
  } satisfies HelmetOptions;
  app.use(helmet(options));
}

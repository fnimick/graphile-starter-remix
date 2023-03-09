import crypto from "crypto";
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
  app.use((req, res, next) => {
    res.locals.cspNonce = crypto.randomBytes(16).toString("hex");
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
            // Remix serves websockets on port 8002 for hot reloading
            ...(isDevOrTest
              ? [ROOT_URL.replace(/^http/, "ws").replace("5678", "8002")]
              : []),
          ],
          "script-src": ["'self'", `'nonce-${res.locals.cspNonce}'`],
        },
      },
      // Enables prettier script and SVG icon in GraphiQL
      crossOriginEmbedderPolicy: !(
        isDevOrTest || !!process.env.ENABLE_GRAPHIQL
      ),
    } satisfies HelmetOptions;
    if (isDevOrTest) {
      // Dev needs 'unsafe-eval' due to
      // https://github.com/vercel/next.js/issues/14221
      options.contentSecurityPolicy.directives["script-src"] = [
        ...options.contentSecurityPolicy.directives["script-src"],
        "'unsafe-eval'",
      ];
    }
    helmet(options)(req, res, next);
  });
}

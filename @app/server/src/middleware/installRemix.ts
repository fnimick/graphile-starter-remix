import { createRequestHandler } from "@remix-run/express";
import { Express, static as staticMiddleware } from "express";
import postgraphile from "postgraphile";

if (!process.env.NODE_ENV) {
  throw new Error("No NODE_ENV envvar! Try `export NODE_ENV=development`");
}

// const isDev = process.env.NODE_ENV === "development";

export default async function installRemix(app: Express) {
  // Remix fingerprints its assets so we can cache forever.
  app.use(
    "/build",
    staticMiddleware(`${__dirname}/../../../client/public/build`, {
      immutable: true,
      maxAge: "1y",
    })
  );

  const remixApp = createRequestHandler({
    build: require(`${__dirname}/../../../client/build`),
    mode: process.env.NODE_ENV,
    getLoadContext(req) {
      return {
        postgraphileSchema: (
          req.app.get("postgraphileMiddleware") as ReturnType<
            typeof postgraphile
          >
        ).getGraphQLSchema(),
      };
    },
  });

  app.all("*", remixApp);
}

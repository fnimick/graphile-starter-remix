import { createRequestHandler } from "@remix-run/express";
import { Express, static as staticMiddleware } from "express";
import { DocumentNode, execute } from "graphql";
import { HeadersInit } from "node-fetch";
import postgraphile from "postgraphile";

import { LoaderContext } from "@app/lib";

import { getSdk } from "../../../graphql/remix-types";

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
    getLoadContext(req, res): LoaderContext {
      const csrfToken = req.csrfToken();
      const cspNonce: string = res.locals.cspNonce;
      const postgraphileInstance = app.get(
        "postgraphileMiddleware"
      ) as ReturnType<typeof postgraphile>;
      async function graphqlSdk() {
        const schema = await postgraphileInstance.getGraphQLSchema();
        const client = {
          async request<T = any, V = Record<string, any>>(
            document: DocumentNode,
            variables?: V,
            requestHeaders?: HeadersInit
          ): Promise<T> {
            return await postgraphileInstance.withPostGraphileContextFromReqRes(
              req,
              res,
              {},
              (context) =>
                execute(
                  schema,
                  document,
                  null,
                  { ...(context as any as object), ...requestHeaders },
                  variables
                )
            );
          },
        };
        return getSdk(client as any);
      }
      return { cspNonce, csrfToken, graphqlSdk: graphqlSdk() };
    },
  });

  app.all("*", remixApp);
}

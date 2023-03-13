import { Express } from "express";
import { postgraphile } from "postgraphile";

export default async function installPostGraphile(app: Express) {
  const middleware: ReturnType<typeof postgraphile> = app.get(
    "postgraphileMiddleware"
  );

  const sleep = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const healthCheck = () =>
    Promise.race([
      sleep(1000).then(() => false),
      middleware
        // note: this does not perform a schema lookup right now, if one is
        // cached, it is returned. This indicates whether the server is healthy to
        // serve requests
        .getGraphQLSchema()
        // query the underlying PGPool to make sure it's reachable
        .then(() => middleware.pgPool.query("SELECT 1").then(() => true))
        .catch((err: unknown) => err),
    ]);

  app.get("/healthz", async (_req, res) => {
    const healthy = await healthCheck();
    if (healthy === true) {
      res.status(200).send({
        uptime: process.uptime(),
        message: "Ok",
        date: new Date(),
      });
      return;
    }
    res.status(503).send({
      error: JSON.stringify(healthy),
    });
  });
}

import csrf from "csurf";
import { Express } from "express";

export default (app: Express) => {
  const csrfProtection = csrf({
    // Store to the session rather than a Cookie
    cookie: false,
  });

  app.use((req, res, next) => {
    if (
      req.method === "POST" &&
      req.path === "/graphql" &&
      (req.headers.referer === `${process.env.ROOT_URL}/graphiql` ||
        req.headers.origin === process.env.ROOT_URL)
    ) {
      // Bypass CSRF for GraphiQL
      next();
    } else if (req.headers.origin === process.env.WEB_URL) {
      // Bypass CSRF for sveltekit, handled internally https://github.com/sveltejs/kit/issues/72
      // TODO: confirm
      next();
    } else {
      csrfProtection(req, res, next);
    }
  });
};

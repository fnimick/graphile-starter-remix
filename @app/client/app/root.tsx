import nprogressStyles from "nprogress/nprogress.css";
import {
  Links,
  LiveReload,
  Meta,
  MetaFunction,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "remix";

import { User } from "../../graphql/remix-types";
import compiledStyles from "./css/main.css";
import {
  jsonTyped,
  TypedDataFunctionArgs,
  useLoaderDataTyped,
} from "./utils/remix-typed";

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "New Remix App",
  viewport: "width=device-width,initial-scale=1",
});

export interface RootLoader {
  user?: User;
  ENV: {
    ROOT_URL?: string;
    T_AND_C_URL?: string;
  };
  cspNonce: string;
  csrfToken: string;
}

export const loader = async ({ context }: TypedDataFunctionArgs) => {
  const { cspNonce, graphqlSdk, csrfToken } = context;
  const sdk = await graphqlSdk;
  const data = await sdk.Shared();
  const user = data.currentUser;
  return jsonTyped({
    user,
    cspNonce,
    csrfToken: csrfToken(),
    ENV: {
      ROOT_URL: process.env.ROOT_URL,
      T_AND_C_URL: process.env.T_AND_C_URL,
    },
  });
};

export function links() {
  return [
    {
      rel: "stylesheet",
      href: compiledStyles,
    },
    {
      rel: "stylesheet",
      href: nprogressStyles,
    },
  ];
}

export default function App() {
  const { cspNonce } = useLoaderDataTyped<typeof loader>();
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration nonce={cspNonce} />
        <Scripts nonce={cspNonce} />
        <LiveReload nonce={cspNonce} />
      </body>
    </html>
  );
}

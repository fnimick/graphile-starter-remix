import compiledStyles from "./css/main.css";
import nprogressStyles from "nprogress/nprogress.css";
import {
  json,
  Links,
  LiveReload,
  LoaderFunction,
  Meta,
  MetaFunction,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "remix";

import { User } from "../../graphql/remix-types";
import { LoaderContext } from "@app/lib";

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
}

export const loader: LoaderFunction = async ({
  context,
}: {
  context: LoaderContext;
}) => {
  const { cspNonce, graphqlSdk } = context;
  const sdk = await graphqlSdk;
  const data = await sdk.Shared();
  const user = data.currentUser;
  return json({
    user,
    cspNonce,
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
  const { cspNonce } = useLoaderData();
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

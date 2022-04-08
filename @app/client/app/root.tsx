// import { companyName, projectName } from "@app/config";
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
} from "remix";

import { User } from "../../graphql/remix-types";
import { LoaderContext } from "./types/context";

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
}

export const loader: LoaderFunction = async ({
  context,
}: {
  context: LoaderContext;
}) => {
  const sdk = await context.graphqlSdk;
  const data = await sdk.Shared();
  const user = data.currentUser;
  return json({
    user,
    ENV: {
      ROOT_URL: process.env.ROOT_URL,
      T_AND_C_URL: process.env.T_AND_C_URL,
    },
  });
};

export default function App() {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

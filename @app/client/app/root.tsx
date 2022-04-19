import nprogressStyles from "nprogress/nprogress.css";
import {
  Links,
  LiveReload,
  Meta,
  MetaFunction,
  Outlet,
  Scripts,
  ScrollRestoration,
  useCatch,
} from "remix";
import { AuthenticityTokenProvider } from "remix-utils";

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
    csrfToken,
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
  const { cspNonce, csrfToken } = useLoaderDataTyped<typeof loader>();
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <AuthenticityTokenProvider token={csrfToken}>
          <Outlet />
        </AuthenticityTokenProvider>
        <ScrollRestoration nonce={cspNonce} />
        <Scripts nonce={cspNonce} />
        <LiveReload nonce={cspNonce} />
      </body>
    </html>
  );
}

export function ErrorBoundary({ error }: any) {
  // const { cspNonce } = useLoaderDataTyped<typeof loader>();
  console.error(error);
  return (
    <html>
      <head>
        <title>Oh no!</title>
        <Meta />
        <Links />
      </head>
      <body>
        <div>An error occurred</div>
        {/* <Scripts nonce={cspNonce} /> */}
      </body>
    </html>
  );
}

export function CatchBoundary() {
  const caught = useCatch();
  // const { cspNonce } = useLoaderDataTyped<typeof loader>();
  return (
    <html>
      <head>
        <title>Oh no!</title>
        <Meta />
        <Links />
      </head>
      <body>
        <div>
          ERROR: {caught.statusText} {caught.status}
        </div>
        <div>{caught.data?.message}</div>
        {/* <Scripts nonce={cspNonce} /> */}
      </body>
    </html>
  );
}

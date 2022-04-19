import { getSdk } from "../../graphql/remix-types";

export interface LoaderContext {
  cspNonce: string;
  csrfToken: string;
  graphqlSdk: Promise<ReturnType<typeof getSdk>>;
  validateCsrfToken: (token: string) => boolean;
}

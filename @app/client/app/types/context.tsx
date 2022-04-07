import { getSdk } from "../../../graphql/remix-types";

export interface LoaderContext {
  graphqlSdk: Promise<ReturnType<typeof getSdk>>;
}

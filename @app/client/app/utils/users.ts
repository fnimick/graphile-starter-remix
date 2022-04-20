import { LoaderContext } from "@app/lib";
import { redirectTyped } from "~/utils/remix-typed";

export async function requireNoUser(context: LoaderContext) {
  const sdk = await context.graphqlSdk;
  const { currentUser } = await sdk.Shared();
  if (currentUser != null) {
    throw redirectTyped("/");
  }
  return null;
}

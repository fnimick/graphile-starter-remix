import { redirectTyped, TypedDataFunctionArgs } from "~/utils/remix-typed";

export const action = async ({ context }: TypedDataFunctionArgs) => {
  const sdk = await context.graphqlSdk;
  await sdk.Logout();
  return redirectTyped("/");
};

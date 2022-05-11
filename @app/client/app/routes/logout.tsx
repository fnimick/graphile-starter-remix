import { validateCsrfToken } from "~/utils/csrf";
import { redirectTyped, TypedDataFunctionArgs } from "~/utils/remix-typed";

export const action = async ({ request, context }: TypedDataFunctionArgs) => {
  await validateCsrfToken(request, context);
  const sdk = await context.graphqlSdk;
  await sdk.Logout();
  return redirectTyped("/");
};

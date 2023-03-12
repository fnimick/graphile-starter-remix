import { VerifyEmailStore } from "$houdini";
import { getCodeFromError, isPostgraphileError } from "$lib/utils/errors";

import type { PageServerLoadEvent } from "./$types";

const CONST_DATA = {
  pageTitle: "Verify",
  verifyEmailError: undefined,
  verifyEmailSuccess: false,
};

export async function load(event: PageServerLoadEvent) {
  const id = event.url.searchParams.get("id");
  const token = event.url.searchParams.get("token");
  if (!id || !token) {
    return {
      ...CONST_DATA,
      verifyEmailError: "Token invalid or missing",
    };
  }
  const verifyEmailStore = new VerifyEmailStore();
  try {
    const result = await verifyEmailStore.mutate({ id, token }, { event });
    if (!result.data?.verifyEmail?.success) {
      return {
        ...CONST_DATA,
        verifyEmailError: "Incorrect or expired token.",
      };
    }
  } catch (err: unknown) {
    if (!isPostgraphileError(err)) {
      throw err;
    }
    return {
      ...CONST_DATA,
      verifyEmailError: `${err.message} ${getCodeFromError(err)}`,
    };
  }
  return {
    ...CONST_DATA,
    verifyEmailSuccess: true,
  };
}

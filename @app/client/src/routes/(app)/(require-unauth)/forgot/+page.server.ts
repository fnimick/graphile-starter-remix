import { redirect } from "@sveltejs/kit";

import { ForgotPasswordStore } from "$houdini";
import { getCodeFromError, isPostgraphileError } from "$lib/utils/errors";
import { validate } from "$lib/utils/validate";

import type { Actions } from "./$types";
import { forgotSchema } from "./schema";

export const actions: Actions = {
  default: validate(
    forgotSchema,
    async ({ data: { email }, fail, ...event }) => {
      const forgotMutation = new ForgotPasswordStore();

      try {
        await forgotMutation.mutate({ email }, { event });
      } catch (e: unknown) {
        if (!isPostgraphileError(e)) {
          throw e;
        }
        const errorCode = getCodeFromError(e);
        return fail({
          formError: { message: e.message, code: errorCode },
        });
      }
      throw redirect(302, `/forgot/success?email=${encodeURIComponent(email)}`);
    }
  ),
};

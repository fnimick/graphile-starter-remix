import { fail, redirect } from "@sveltejs/kit";
import { validatedAction } from "felte-sveltekit/server";

import { ForgotPasswordStore } from "$houdini";
import { getCodeFromError, isPostgraphileError } from "$lib/utils/errors";

import type { Actions } from "./$types";
import { forgotSchema } from "./schema";

export const actions: Actions = {
  default: validatedAction(
    "forgot",
    forgotSchema,
    async ({ data: { email }, wrapResult }, event) => {
      const forgotMutation = new ForgotPasswordStore();

      try {
        await forgotMutation.mutate({ email }, { event });
      } catch (e: unknown) {
        if (!isPostgraphileError(e)) {
          throw e;
        }
        const errorCode = getCodeFromError(e);
        return fail(
          400,
          wrapResult({
            formMessage: { message: e.message, code: errorCode, type: "error" },
          })
        );
      }
      throw redirect(302, `/forgot/success?email=${encodeURIComponent(email)}`);
    }
  ),
};

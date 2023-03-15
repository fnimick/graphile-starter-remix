import { fail, redirect } from "@sveltejs/kit";
import { validatedAction } from "felte-sveltekit/server";

import { ResetPasswordStore } from "$houdini";
import { getCodeFromError, isPostgraphileError } from "$lib/utils/errors";

import type { Actions } from "./$types";
import { resetServerSchema } from "./schema";

export const actions: Actions = {
  default: validatedAction(
    "reset",
    resetServerSchema,
    async ({ data: { password, token, userId }, wrapResult }, event) => {
      const resetMutation = new ResetPasswordStore();

      try {
        const result = await resetMutation.mutate(
          { password, token, userId },
          { event }
        );
        if (!result.data?.resetPassword?.success) {
          return fail(
            400,
            wrapResult({
              formMessage: {
                message:
                  "Invalid user id or token; please request another password reset.",
                type: "error",
              },
            })
          );
        }
      } catch (e: unknown) {
        if (!isPostgraphileError(e)) {
          throw e;
        }
        const errorCode = getCodeFromError(e);
        if (errorCode === "WEAKP") {
          return fail(
            400,
            wrapResult({
              fieldErrors: {
                password:
                  "The server believes this passphrase is too weak, please make it stronger.",
              },
            })
          );
        }
        return fail(
          400,
          wrapResult({
            formMessage: { message: e.message, code: errorCode, type: "error" },
          })
        );
      }
      throw redirect(302, "/reset/success");
    },
    { valueExcludeFields: new Set(["password", "confirm"]) }
  ),
};

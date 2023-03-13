import { redirect } from "@sveltejs/kit";

import { ResetPasswordStore } from "$houdini";
import { getCodeFromError, isPostgraphileError } from "$lib/utils/errors";
import { validate } from "$lib/utils/validate";

import type { Actions } from "./$types";
import { resetServerSchema } from "./schema";

export const actions: Actions = {
  default: validate(
    resetServerSchema,
    async ({ data: { password, token, userId }, fail, ...event }) => {
      const resetMutation = new ResetPasswordStore();

      try {
        const result = await resetMutation.mutate(
          { password, token, userId },
          { event }
        );
        if (!result.data?.resetPassword?.success) {
          return fail({
            formError: {
              message:
                "Invalid user id or token; please request another password reset.",
            },
          });
        }
      } catch (e: unknown) {
        if (!isPostgraphileError(e)) {
          throw e;
        }
        const errorCode = getCodeFromError(e);
        if (errorCode === "WEAKP") {
          return fail({
            fieldErrors: {
              password:
                "The server believes this passphrase is too weak, please make it stronger.",
            },
          });
        }
        return fail({
          formError: { message: e.message, code: errorCode },
        });
      }
      throw redirect(302, "/reset/success");
    },
    { valueExcludeFields: new Set(["password", "confirm"]) }
  ),
};

import { redirect } from "@sveltejs/kit";

import { RegisterStore } from "$houdini";
import { getCodeFromError } from "$lib/utils/errors";
import { isSafe } from "$lib/utils/uri";
import { validate } from "$lib/utils/validate";

import type { Actions } from "./$types";
import { registerSchema } from "./schema";

export const actions: Actions = {
  default: validate(
    registerSchema,
    async ({
      data: { name, username, email, password, next },
      fail,
      ...event
    }) => {
      const registerMutation = new RegisterStore();

      const redirectTarget = isSafe(next) ? next : "/";

      try {
        await registerMutation.mutate(
          { name, username, email, password },
          { event }
        );
      } catch (e: any) {
        const errorCode = getCodeFromError(e);
        if (errorCode === "WEAKP") {
          return fail({
            fieldErrors: {
              password:
                "The server believes this passphrase is too weak, please make it stronger.",
            },
          });
        }
        if (errorCode === "EMTKN") {
          return fail({
            fieldErrors: {
              email:
                "An account with this email address has already been registered, consider using the 'Forgot passphrase' function.",
            },
          });
        }
        return fail({
          formError: { message: e.message, code: errorCode },
        });
      }
      throw redirect(302, redirectTarget);
    },
    { valueExcludeFields: new Set(["password", "confirm"]) }
  ),
};

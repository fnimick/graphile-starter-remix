import { redirect } from "@sveltejs/kit";

import { LoginStore } from "$houdini";
import { getCodeFromError, isPostgraphileError } from "$lib/utils/errors";
import { isSafe } from "$lib/utils/uri";
import { validate } from "$lib/utils/validate";

import type { Actions } from "./$types";
import { loginSchema } from "./schema";

export const actions: Actions = {
  default: validate(
    loginSchema,
    async ({ data: { username, password, next }, fail, ...event }) => {
      const loginMutation = new LoginStore();
      const redirectTarget = isSafe(next) ? next : "/";

      try {
        await loginMutation.mutate({ username, password }, { event });
      } catch (e: unknown) {
        if (!isPostgraphileError(e)) {
          throw e;
        }
        const errorCode = getCodeFromError(e);
        if (errorCode === "CREDS") {
          return fail({
            fieldErrors: { password: "Incorrect email or passphrase" },
          });
        }
        if (errorCode === "LOCKD") {
          return fail({
            formError: {
              message:
                "Too many login attempts. Please try again in five minutes.",
              code: "LOCKD",
            },
          });
        }
        return fail({
          formError: { message: e.message, code: errorCode },
        });
      }
      throw redirect(302, redirectTarget);
    },
    { valueExcludeFields: new Set(["password"]) }
  ),
};

import { fail, redirect } from "@sveltejs/kit";
import { validatedAction } from "felte-sveltekit/server";

import { LoginStore } from "$houdini";
import { getCodeFromError, isPostgraphileError } from "$lib/utils/errors";
import { isSafe } from "$lib/utils/uri";

import type { Actions } from "./$types";
import { loginSchema } from "./schema";

export const actions: Actions = {
  default: validatedAction(
    "login",
    loginSchema,
    async ({ data: { username, password, next }, wrapResult }, event) => {
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
          return fail(
            400,
            wrapResult({
              fieldErrors: { password: "Incorrect username or passphrase" },
            })
          );
        }
        if (errorCode === "LOCKD") {
          return fail(
            400,
            wrapResult({
              formMessage: {
                message:
                  "Too many login attempts. Please try again in five minutes.",
                code: "LOCKD",
                type: "error",
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
      throw redirect(302, redirectTarget);
    },
    {
      valueExcludeFields: new Set(["password"]),
    }
  ),
};

import { fail, redirect } from "@sveltejs/kit";
import { validatedAction } from "felte-sveltekit/server";

import { RegisterStore } from "$houdini";
import { getCodeFromError, isPostgraphileError } from "$lib/utils/errors";
import { isSafe } from "$lib/utils/uri";

import type { Actions } from "./$types";
import { registerSchema } from "./schema";

export const actions: Actions = {
  default: validatedAction(
    "register",
    registerSchema,
    async (
      { data: { name, username, email, password, next }, wrapResult },
      event
    ) => {
      const registerMutation = new RegisterStore();

      const redirectTarget = isSafe(next) ? next : "/";

      try {
        await registerMutation.mutate(
          { name, username, email, password },
          { event }
        );
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
        if (errorCode === "EMTKN") {
          return fail(
            400,
            wrapResult({
              fieldErrors: {
                email:
                  "An account with this email address has already been registered, consider using the 'Forgot passphrase' function.",
              },
            })
          );
        }
        if (errorCode === "NUNIQ") {
          return fail(
            400,
            wrapResult({
              fieldErrors: {
                username:
                  "An account with this username has already been registered, please try a different username.",
              },
            })
          );
        }
        if (errorCode === "23514") {
          return fail(
            400,
            wrapResult({
              fieldErrors: {
                username:
                  "This username is not allowed; usernames must be between 2 and 24 characters long (inclusive), must start with a letter, and must contain only alphanumeric characters and underscores.",
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
      valueExcludeFields: new Set(["password", "confirm"]),
    }
  ),
};

import { fail, redirect } from "@sveltejs/kit";
import { validatedAction } from "felte-sveltekit/server";

import { ChangePasswordStore } from "$houdini";
import { getCodeFromError, isPostgraphileError } from "$lib/utils/errors";

import type { Actions } from "./$types";
import { securitySchema } from "./schema";

export const actions: Actions = {
  default: validatedAction(
    "security",
    securitySchema,
    async ({ data: { oldPassword, newPassword }, wrapResult }, event) => {
      const securityMutation = new ChangePasswordStore();

      try {
        await securityMutation.mutate({ oldPassword, newPassword }, { event });
      } catch (e: unknown) {
        if (!isPostgraphileError(e)) {
          throw e;
        }
        const errorCode = getCodeFromError(e);
        if (errorCode === "LOGIN") {
          throw redirect(
            302,
            `/login?next=${encodeURIComponent(
              new URL(event.request.url).pathname
            )}`
          );
        }
        if (errorCode === "CREDS") {
          return fail(
            400,
            wrapResult({
              fieldErrors: {
                oldPassword: "Incorrect old passphrase.",
              },
            })
          );
        }
        if (errorCode === "WEAKP") {
          return fail(
            400,
            wrapResult({
              fieldErrors: {
                newPassword:
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
      return wrapResult({
        formMessage: { title: "Passphrase changed", type: "success" },
      });
    },
    { valueExcludeFields: new Set(["oldPassword", "newPassword", "confirm"]) }
  ),
};

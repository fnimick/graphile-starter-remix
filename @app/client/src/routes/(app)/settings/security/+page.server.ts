import { redirect } from "@sveltejs/kit";

import { ChangePasswordStore } from "$houdini";
import { getCodeFromError, isPostgraphileError } from "$lib/utils/errors";
import { validate } from "$lib/utils/validate";

import type { Actions } from "./$types";
import { securitySchema } from "./schema";

export const actions: Actions = {
  default: validate(
    securitySchema,
    async ({ data: { oldPassword, newPassword }, fail, ...event }) => {
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
          return fail({
            fieldErrors: {
              oldPassword: "Incorrect old passphrase.",
            },
          });
        }
        if (errorCode === "WEAKP") {
          return fail({
            fieldErrors: {
              newPassword:
                "The server believes this passphrase is too weak, please make it stronger.",
            },
          });
        }
        return fail({
          formError: { message: e.message, code: errorCode },
        });
      }
      return { success: true };
    },
    { valueExcludeFields: new Set(["oldPassword", "newPassword", "confirm"]) }
  ),
};

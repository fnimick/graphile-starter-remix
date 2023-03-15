import { fail } from "@sveltejs/kit";
import { validatedAction } from "felte-sveltekit/server";

import { SettingsProfileStore, UpdateUserStore } from "$houdini";
import { getCodeFromError, isPostgraphileError } from "$lib/utils/errors";

import type { Actions } from "./$types";
import { profileSchema } from "./schema";

export const actions: Actions = {
  default: validatedAction(
    "profile",
    profileSchema,
    async ({ data: { name, username }, wrapResult }, event) => {
      const settingsProfileStore = new SettingsProfileStore();
      const id = (await settingsProfileStore.fetch({ event })).data?.currentUser
        ?.id;
      if (id == null) {
        return fail(
          400,
          wrapResult({
            formMessage: {
              message: "Could not calculate current user id",
              code: "NOID",
              type: "error",
            },
          })
        );
      }

      const userMutation = new UpdateUserStore();

      try {
        await userMutation.mutate({ id, patch: { name, username } }, { event });
      } catch (e: unknown) {
        if (!isPostgraphileError(e)) {
          throw e;
        }
        const errorCode = getCodeFromError(e);
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
      return wrapResult({ result: { success: true } });
    }
  ),
};

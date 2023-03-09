import { SettingsProfileStore, UpdateUserStore } from "$houdini";
import { getCodeFromError } from "$lib/utils/errors";
import { validate } from "$lib/utils/validate";

import type { Actions } from "./$types";
import { profileSchema } from "./schema";

export const actions: Actions = {
  default: validate(
    profileSchema,
    async ({ data: { name, username }, fail, ...event }) => {
      const settingsProfileStore = new SettingsProfileStore();
      const id = (await settingsProfileStore.fetch({ event })).data?.currentUser
        ?.id;
      if (id == null) {
        return fail({
          formError: {
            message: "Could not calculate current user id",
            code: "NOID",
          },
        });
      }

      const userMutation = new UpdateUserStore();

      try {
        await userMutation.mutate({ id, patch: { name, username } }, { event });
      } catch (e: any) {
        const errorCode = getCodeFromError(e);
        if (errorCode === "NUNIQ") {
          return fail({
            fieldErrors: {
              username:
                "An account with this username has already been registered, please try a different username.",
            },
          });
        }
        if (errorCode === "23514") {
          return fail({
            fieldErrors: {
              username:
                "This username is not allowed; usernames must be between 2 and 24 characters long (inclusive), must start with a letter, and must contain only alphanumeric characters and underscores.",
            },
          });
        }
        return fail({
          formError: { message: e.message, code: errorCode },
        });
      }
      return { success: true };
    }
  ),
};

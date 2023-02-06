import { LoginStore } from "$houdini";
import { getCodeFromError } from "$lib/utils/errors";
import { validate } from "$lib/utils/validate";

import type { Actions } from "./$types";
import { loginSchema } from "./schema";

export const actions: Actions = {
  default: validate(
    loginSchema,
    async ({ data: { username, password }, fail, ...event }) => {
      const loginMutation = new LoginStore();

      try {
        const result = await loginMutation.mutate(
          { username, password },
          event
        );
      } catch (e: any) {
        console.log(e);
        const errorCode = getCodeFromError(e);
        if (errorCode === "CREDS") {
          return fail({
            fieldErrors: { password: "Incorrect email or passphrase" },
          });
        }
        return fail({
          formError: { message: e.message, code: errorCode },
        });
      }
    },
    { valueExcludeFields: new Set(["password"]) }
  ),
};

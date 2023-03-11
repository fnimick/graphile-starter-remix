import {
  AddEmailStore,
  DeleteEmailStore,
  MakeEmailPrimaryStore,
  ResendEmailVerificationStore,
} from "$houdini";
import { getCodeFromError, isPostgraphileError } from "$lib/utils/errors";
import { validate } from "$lib/utils/validate";

import type { Actions } from "./$types";
import { addEmailSchema, emaildIdSchema } from "./schema";

export const actions: Actions = {
  addEmail: validate(
    addEmailSchema,
    async ({ data: { email }, fail, ...event }) => {
      const addEmailMutation = new AddEmailStore();

      try {
        await addEmailMutation.mutate({ email }, { event });
      } catch (e: unknown) {
        if (!isPostgraphileError(e)) {
          throw e;
        }
        const errorCode = getCodeFromError(e);
        return fail({
          formError: { message: e.message, code: errorCode },
        });
      }
      return { success: true };
    }
  ),
  delete: validate(
    emaildIdSchema,
    async ({ data: { emailId }, fail, ...event }) => {
      const deleteMutation = new DeleteEmailStore();
      await deleteMutation.mutate({ emailId }, { event });
    }
  ),
  resend_verification: validate(
    emaildIdSchema,
    async ({ data: { emailId }, fail, ...event }) => {
      const resendVerificationMutation = new ResendEmailVerificationStore();
      await resendVerificationMutation.mutate({ emailId }, { event });
    }
  ),
  make_primary: validate(
    emaildIdSchema,
    async ({ data: { emailId }, fail, ...event }) => {
      const makePrimaryMutation = new MakeEmailPrimaryStore();
      await makePrimaryMutation.mutate({ emailId }, { event });
    }
  ),
};

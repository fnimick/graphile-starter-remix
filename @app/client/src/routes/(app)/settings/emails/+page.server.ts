import { fail } from "@sveltejs/kit";
import { validatedAction } from "felte-sveltekit/server";

import {
  graphql,
  MakeEmailPrimaryStore,
  ResendEmailVerificationStore,
} from "$houdini";
import { getCodeFromError, isPostgraphileError } from "$lib/utils/errors";

import type { Actions } from "./$types";
import { addEmailSchema, emaildIdSchema } from "./schema";

const addEmailMutation = graphql(`
  mutation AddEmail($email: String!) {
    createUserEmail(input: { userEmail: { email: $email } }) {
      userEmail {
        ...User_Emails_insert
      }
    }
  }
`);

const deleteEmailMutation = graphql(`
  mutation DeleteEmail($emailId: UUID!) {
    deleteUserEmail(input: { id: $emailId }) {
      userEmail {
        id @UserEmail_delete
      }
    }
  }
`);

export const actions: Actions = {
  add_email: validatedAction(
    "add_email",
    addEmailSchema,
    async ({ data: { email }, wrapResult }, event) => {
      try {
        await addEmailMutation.mutate({ email }, { event });
      } catch (e: unknown) {
        if (!isPostgraphileError(e)) {
          throw e;
        }
        const errorCode = getCodeFromError(e);
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
  delete: validatedAction(
    "delete",
    emaildIdSchema,
    async ({ data: { emailId } }, event) => {
      await deleteEmailMutation.mutate({ emailId }, { event });
    }
  ),
  resend_verification: validatedAction(
    "resend_verification",
    emaildIdSchema,
    async ({ data: { emailId } }, event) => {
      const resendVerificationMutation = new ResendEmailVerificationStore();
      await resendVerificationMutation.mutate({ emailId }, { event });
    }
  ),
  make_primary: validatedAction(
    "make_primary",
    emaildIdSchema,
    async ({ data: { emailId } }, event) => {
      const makePrimaryMutation = new MakeEmailPrimaryStore();
      await makePrimaryMutation.mutate({ emailId }, { event });
    }
  ),
};

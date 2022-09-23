import { UserOutlined } from "@ant-design/icons";
import { getCodeFromError } from "@app/lib";
import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useActionData } from "@remix-run/react";
import { redirect } from "@remix-run/server-runtime";
import { withZod } from "@remix-validated-form/with-zod";
import { AuthenticityTokenInput } from "remix-utils";
import { ValidatedForm, validationError } from "remix-validated-form";
import * as z from "zod";

import { ErrorAlert, FormInput, SubmitButton } from "~/components";
import { validateCsrfToken } from "~/utils/csrf";
import type { GraphqlQueryErrorResult } from "~/utils/errors";
import { requireNoUser } from "~/utils/users";

export const handle = { hideLogin: true, title: "Forgot Password" };

export const loader = async ({ context }: LoaderArgs) => {
  await requireNoUser(context);
  return null;
};

export const action = async ({ request, context }: ActionArgs) => {
  await validateCsrfToken(request, context);
  const sdk = await context.graphqlSdk;
  const fieldValues = await forgotPasswordFormValidator.validate(
    await request.formData()
  );
  if (fieldValues.error) {
    return validationError(fieldValues.error, {
      email: fieldValues.submittedData.email,
    });
  }
  const { email } = fieldValues.data;
  try {
    await sdk.ForgotPassword({ email });
    return redirect(`/forgot/success?email=${encodeURIComponent(email)}`);
  } catch (e: any) {
    const code = getCodeFromError(e);
    return json<GraphqlQueryErrorResult>({
      message: e.message,
      code,
      error: true,
    });
  }
};

const forgotPasswordSchema = z.object({
  email: z
    .string()
    .nonempty("Please input your E-mail.")
    .email("The input is not valid E-mail."),
});

const forgotPasswordFormValidator = withZod(forgotPasswordSchema);

export default function ForgotPassword() {
  const { message, code, error } =
    useActionData<GraphqlQueryErrorResult>() ?? {};

  return (
    <ValidatedForm
      validator={forgotPasswordFormValidator}
      method="post"
      className="flex flex-col max-w-lg w-full gap-y-5"
    >
      <AuthenticityTokenInput />
      <FormInput
        name="username"
        placeholder="Email"
        required
        type="email"
        autoComplete="email"
        inputPrefix={<UserOutlined />}
      />
      {error ? (
        <ErrorAlert title="Login failed" message={message} code={code} />
      ) : null}

      <div className="flex justify-between align-center">
        <SubmitButton data-cy="loginpage-button-submit">
          Reset password
        </SubmitButton>
        <Link className="link self-center" to="/login">
          Use a different sign in method
        </Link>
      </div>

      <Link className="link" to="/login/email">
        Remembered your password? Log in.
      </Link>
    </ValidatedForm>
  );
}

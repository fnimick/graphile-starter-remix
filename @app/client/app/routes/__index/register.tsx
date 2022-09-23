import { getCodeFromError } from "@app/lib";
import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useActionData, useSearchParams } from "@remix-run/react";
import { redirect } from "@remix-run/server-runtime";
import { withZod } from "@remix-validated-form/with-zod";
import { useState } from "react";
import { HiOutlineQuestionMarkCircle } from "react-icons/hi";
import { AuthenticityTokenInput } from "remix-utils";
import { ValidatedForm, validationError } from "remix-validated-form";
import * as z from "zod";

import { ErrorAlert, PasswordStrength } from "~/components";
import { FormInput } from "~/components/forms/FormInput";
import { SubmitButton } from "~/components/forms/SubmitButton";
import { validateCsrfToken } from "~/utils/csrf";
import type { GraphqlQueryErrorResult } from "~/utils/errors";
import { setPasswordStrengthInfo } from "~/utils/passwords";
import { isSafe } from "~/utils/uri";
import { requireNoUser } from "~/utils/users";

export const handle = { hideLogin: true, title: "Register" };

export const loader = async ({ context }: LoaderArgs) => {
  await requireNoUser(context);
  return null;
};

export const action = async ({ request, context }: ActionArgs) => {
  await validateCsrfToken(request, context);
  const sdk = await context.graphqlSdk;
  const fieldValues = await registerFormValidator.validate(
    await request.formData()
  );
  if (fieldValues.error) {
    return validationError(fieldValues.error, {
      username: fieldValues.submittedData.username,
    });
  }
  const { name, username, email, password, redirectTo } = fieldValues.data;
  try {
    await sdk.Register({ name, username, email, password });
    return redirect(redirectTo ?? "/");
  } catch (e: any) {
    const { password, confirm, ...restSubmittedValues } =
      fieldValues.submittedData;
    const code = getCodeFromError(e);
    if (code === "WEAKP") {
      return validationError(
        {
          fieldErrors: {
            password:
              "The server believes this passphrase is too weak, please make it stronger.",
          },
        },
        restSubmittedValues
      );
    }
    if (code === "EMTKN") {
      return validationError(
        {
          fieldErrors: {
            email:
              "An account with this email address has already been registered, consider using the 'Forgot passphrase' function.",
          },
        },
        restSubmittedValues
      );
    }
    if (code === "NUNIQ") {
      return validationError(
        {
          fieldErrors: {
            username:
              "An account with this username has already been registered, please try a different username.",
          },
        },
        restSubmittedValues
      );
    }
    if (code === "23514") {
      return validationError(
        {
          fieldErrors: {
            username:
              "This username is not allowed; usernames must be between 2 and 24 characters long (inclusive), must start with a letter, and must contain only alphanumeric characters and underscores.",
          },
        },
        restSubmittedValues
      );
    }
    return json<GraphqlQueryErrorResult>({
      message: e.message,
      code,
      error: true,
    });
  }
};

const registerSchema = z
  .object({
    name: z.string().nonempty("Please input your name."),
    username: z
      .string()
      .nonempty("Please input your username")
      .min(2, "Username must be at least 2 characters long.")
      .max(24, "Username must be no more than 24 characters long.")
      .regex(/^([a-zA-Z]|$)/, "Username must start with a letter.")
      .regex(
        /^([^_]|_[^_]|_$)*$/,
        "Username must not contain two underscores next to each other."
      )
      .regex(
        /^[a-zA-Z0-9_]*$/,
        "Username must contain only alphanumeric characters and underscores."
      ),
    email: z
      .string()
      .nonempty("Please input your E-mail.")
      .email("The input is not valid E-mail."),
    password: z.string().nonempty("Please input your passphrase."),
    confirm: z.string().nonempty("Please input your passphrase."),
    redirectTo: z.string().optional(),
  })
  .refine(({ password, confirm }) => password === confirm, {
    message: "Make sure your passphrase is the same in both passphrase boxes.",
    path: ["confirm"],
  });

const registerFormValidator = withZod(registerSchema);

export default function Register() {
  const [searchParams] = useSearchParams();
  const rawNext = searchParams.get("next");
  const next = isSafe(rawNext) ? rawNext : "/";

  const { message, code, error } =
    useActionData<GraphqlQueryErrorResult>() ?? {};

  const [passwordStrength, setPasswordStrength] = useState<number>(0);
  const [passwordSuggestions, setPasswordSuggestions] = useState<string[]>([]);
  const [passwordDirty, setPasswordDirty] = useState(false);

  return (
    <ValidatedForm
      validator={registerFormValidator}
      method="post"
      className="flex w-full max-w-lg flex-col gap-y-1"
      noValidate
    >
      <AuthenticityTokenInput />
      <input type="hidden" name="redirectTo" value={next} />
      <FormInput
        name="name"
        label={
          <span data-cy="registerpage-name-label" className="flex">
            Name&nbsp;
            <span
              className="tooltip flex w-5 items-center"
              data-tip="What is your name?"
            >
              <HiOutlineQuestionMarkCircle />
            </span>
          </span>
        }
        required
        type="text"
        autoComplete="name"
        data-cy="registerpage-input-name"
      />
      <FormInput
        name="username"
        label={
          <span className="flex">
            Username&nbsp;
            <span
              className="tooltip flex w-5 items-center"
              data-tip="What do you want others to call you?"
            >
              <HiOutlineQuestionMarkCircle />
            </span>
          </span>
        }
        required
        type="text"
        autoComplete="username"
        data-cy="registerpage-input-username"
      />
      <FormInput
        name="email"
        label="E-mail"
        required
        type="email"
        autoComplete="email"
        data-cy="registerpage-input-email"
      />
      <FormInput
        name="password"
        label="Passphrase"
        required
        type="password"
        onChange={(e) => {
          setPasswordStrengthInfo(
            e.target.value,
            setPasswordStrength,
            setPasswordSuggestions
          );
          setPasswordDirty(true);
        }}
        autoComplete="new-password"
        data-cy="registerpage-input-password"
      >
        <PasswordStrength
          passwordStrength={passwordStrength}
          suggestions={passwordSuggestions}
          isDirty={passwordDirty}
        />
      </FormInput>
      <FormInput
        name="confirm"
        label="Confirm passphrase"
        required
        type="password"
        autoComplete="new-password"
        data-cy="registerpage-input-password2"
      />
      {error ? (
        <ErrorAlert title="Registration failed" message={message} code={code} />
      ) : null}
      <div className="align-center flex justify-start">
        <SubmitButton data-cy="registerpage-submit-button">
          Register
        </SubmitButton>
      </div>
    </ValidatedForm>
  );
}

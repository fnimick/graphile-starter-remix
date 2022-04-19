import { Row } from "antd";
import React from "react";
import {
  ActionFunction,
  Form,
  Link,
  useActionData,
  useSearchParams,
} from "remix";
import { AuthenticityTokenInput } from "remix-utils";
import { validateCsrfToken } from "~/utils/csrf";
import { useRootMatchesData } from "~/utils/hooks";
import { TypedDataFunctionArgs } from "~/utils/remix-typed";
import { isSafe } from "~/utils/uri";

export const handle = { hideLogin: true, title: "Login" };

interface ActionData {
  errors?: {
    email?: string;
    password?: string;
  };
}

export const action: ActionFunction = async ({
  request,
  context,
}: TypedDataFunctionArgs) => {
  await validateCsrfToken(request, context);
  return null;
};

export default function Login() {
  const [searchParams] = useSearchParams();
  const rawNext = searchParams.get("next");
  const next = isSafe(rawNext) ? rawNext : "/";

  const actionData = useActionData() as ActionData;
  const emailRef = React.useRef<HTMLInputElement>(null);
  const passwordRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (actionData?.errors?.email) {
      emailRef.current?.focus();
    } else if (actionData?.errors?.password) {
      passwordRef.current?.focus();
    }
  }, [actionData]);

  return (
    <Row justify="center" style={{ marginTop: 32 }}>
      <Form method="post" className="space-y-6" noValidate>
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email address
          </label>
          <div className="mt-1">
            <input
              ref={emailRef}
              id="email"
              required
              autoFocus={true}
              name="email"
              type="email"
              autoComplete="email"
              aria-invalid={actionData?.errors?.email ? true : undefined}
              aria-describedby="email-error"
              className="w-full rounded border border-gray-500 px-2 py-1 text-lg"
            />
            {actionData?.errors?.email && (
              <div className="pt-1 text-red-700" id="email-error">
                {actionData.errors.email}
              </div>
            )}
          </div>
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <div className="mt-1">
            <input
              id="password"
              ref={passwordRef}
              name="password"
              type="password"
              autoComplete="current-password"
              aria-invalid={actionData?.errors?.password ? true : undefined}
              aria-describedby="password-error"
              className="w-full rounded border border-gray-500 px-2 py-1 text-lg"
            />
            {actionData?.errors?.password && (
              <div className="pt-1 text-red-700" id="password-error">
                {actionData.errors.password}
              </div>
            )}
          </div>
        </div>

        <input type="hidden" name="redirectTo" value={next} />
        <AuthenticityTokenInput />
        <button
          type="submit"
          className="w-full rounded bg-blue-500  py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
        >
          Log in
        </button>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember"
              name="remember"
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label
              htmlFor="remember"
              className="ml-2 block text-sm text-gray-900"
            >
              Remember me
            </label>
          </div>
          <div className="text-center text-sm text-gray-500">
            Don't have an account?{" "}
            <Link
              className="text-blue-500 underline"
              to={{
                pathname: "/register",
                search: searchParams.toString(),
              }}
            >
              Sign up
            </Link>
          </div>
        </div>
      </Form>
    </Row>
  );
}

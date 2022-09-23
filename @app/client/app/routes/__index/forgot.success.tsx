import { useSearchParams } from "@remix-run/react";
import type { LoaderArgs } from "@remix-run/server-runtime";

import { SuccessAlert } from "~/components";
import { requireNoUser } from "~/utils/users";

export const handle = { hideLogin: true, title: "Forgot Password" };

export const loader = async ({ context }: LoaderArgs) => {
  await requireNoUser(context);
  return null;
};

export default function ForgotPassword() {
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") as string;
  return (
    <SuccessAlert
      title="You've got mail!"
      message={`We've sent an email reset link to '${email}'; click the link and follow the instructions. If you don't receive the link, please ensure you entered the email address correctly, and check in your spam folder just in case.`}
    />
  );
}

import { Link } from "@remix-run/react";
import { IoLogoGithub } from "react-icons/io5";

export interface SocialLoginOptionsProps {
  next: string;
  buttonTextFromService?: (service: string) => string;
}

function defaultButtonTextFromService(service: string) {
  return `Sign in with ${service}`;
}

export function SocialLoginOptions({
  next,
  buttonTextFromService = defaultButtonTextFromService,
}: SocialLoginOptionsProps) {
  return (
    <Link
      className="btn btn-primary"
      to={`/auth/github?next=${encodeURIComponent(next)}`}
    >
      <span className="tems-center mx-1 flex text-lg">
        <IoLogoGithub />
      </span>
      {buttonTextFromService("GitHub")}
    </Link>
  );
}

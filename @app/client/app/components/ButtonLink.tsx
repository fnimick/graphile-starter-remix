import { Button } from "antd";
import { ButtonProps } from "antd/lib/button";
import { Link } from "remix";

export function ButtonLink(props: ButtonProps & { href: string; as?: string }) {
  const { href, as, ...rest } = props;
  return (
    <Link to={href}>
      <Button {...rest} />
    </Link>
  );
}

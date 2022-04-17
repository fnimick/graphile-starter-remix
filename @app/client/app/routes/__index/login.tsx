import { UserAddOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Col, Row } from "antd";
import { useSearchParams } from "remix";
import { ButtonLink, SocialLoginOptions } from "~/components";
import { isSafe } from "~/utils/uri";

export const handle = { hideLogin: true, title: "Login" };

export default function Login() {
  const [searchParams] = useSearchParams();
  const rawNext = searchParams.get("next");
  const next = isSafe(rawNext) ? rawNext : "/";
  return (
    <Row justify="center" style={{ marginTop: 32 }}>
      <Col xs={24} sm={12}>
        <Row style={{ marginBottom: 8 }}>
          <Col span={24}>
            <ButtonLink
              data-cy="loginpage-button-withusername"
              icon={<UserOutlined />}
              size="large"
              block
              type="primary"
              href={`email?next=${encodeURIComponent(next)}`}
            >
              Sign in with E-mail or Username
            </ButtonLink>
          </Col>
        </Row>
        <Row style={{ marginBottom: 8 }}>
          <Col span={24}>
            <SocialLoginOptions next={next} />
          </Col>
        </Row>
        <Row justify="center">
          <Col flex={1}>
            <ButtonLink
              icon={<UserAddOutlined />}
              size="large"
              block
              type="default"
              href={`/register?next=${encodeURIComponent(next)}`}
            >
              <a data-cy="loginpage-button-register">Create an account</a>
            </ButtonLink>
          </Col>
        </Row>
      </Col>
    </Row>
  );
}

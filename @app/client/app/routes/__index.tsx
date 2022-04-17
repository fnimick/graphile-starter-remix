import { CrownOutlined, DownOutlined } from "@ant-design/icons";
import { companyName, projectName } from "@app/config";
import { Avatar, Col, Dropdown, Layout, Menu, Row, Typography } from "antd";
import { Link, Outlet, useLocation, useMatches } from "remix";
import { useOptionalUser, useRootMatchesData } from "~/utils/hooks";

import { H3, StandardWidth, Warn } from "../components";

const { Header, Content, Footer } = Layout;
const { Text } = Typography;

export const contentMinHeight = "calc(100vh - 64px - 70px)";

export default function RootIndex() {
  const rootData = useRootMatchesData();
  const matches = useMatches();
  const currentUser = useOptionalUser();
  const { pathname, search, hash } = useLocation();

  const renderContentPadding = !(
    matches.filter((match) => match.handle?.noPad).length > 0
  );
  const hideLogin =
    matches.filter((match) => match.handle?.hideLogin).length > 0;
  const titleHandle: any | undefined = matches
    .filter((match) => match.handle?.title)
    .pop()?.handle;
  const { title, titleHref } = titleHandle ?? {};

  const currentRouteURL = `${pathname}${search}${hash}`;

  return (
    <Layout>
      <Header
        style={{
          boxShadow: "0 2px 8px #f0f1f2",
          zIndex: 1,
          overflow: "hidden",
        }}
      >
        <Row justify="space-between">
          <Col span={6}>
            <Link to="/">{projectName}</Link>
          </Col>
          <Col span={12}>
            {/* TODO - add child route titles back in */}
            <H3
              style={{
                margin: 0,
                padding: 0,
                textAlign: "center",
                lineHeight: "64px",
              }}
              data-cy="layout-header-title"
            >
              {titleHref ? (
                <Link to={titleHref}>
                  <a data-cy="layout-header-titlelink">{title}</a>
                </Link>
              ) : (
                title
              )}
            </H3>
          </Col>
          <Col span={6} style={{ textAlign: "right" }}>
            {currentUser ? (
              <Dropdown
                overlay={
                  <Menu>
                    {currentUser.organizationMemberships.nodes.map(
                      ({ organization, isOwner }) => (
                        <Menu.Item key={organization?.id}>
                          <Link to={`/o/${organization?.slug}`}>
                            {organization?.name}
                            {isOwner ? (
                              <span>
                                {" "}
                                <CrownOutlined />
                              </span>
                            ) : (
                              ""
                            )}
                          </Link>
                        </Menu.Item>
                      )
                    )}
                    <Menu.Item>
                      <Link
                        to="/create-organization"
                        data-cy="layout-link-create-organization"
                      >
                        Create organization
                      </Link>
                    </Menu.Item>
                    <Menu.Item>
                      <Link to="/settings" data-cy="layout-link-settings">
                        <Warn okay={currentUser.isVerified}>Settings</Warn>
                      </Link>
                    </Menu.Item>
                    {/* <Menu.Item>
                      <a onClick={handleLogout}>Logout</a>
                    </Menu.Item> */}
                  </Menu>
                }
              >
                <span
                  data-cy="layout-dropdown-user"
                  style={{ whiteSpace: "nowrap" }}
                >
                  <Avatar>
                    {(currentUser.name && currentUser.name[0]) || "?"}
                  </Avatar>
                  <Warn okay={currentUser.isVerified}>
                    <span style={{ marginLeft: 8, marginRight: 8 }}>
                      {currentUser.name}
                    </span>
                    <DownOutlined />
                  </Warn>
                </span>
              </Dropdown>
            ) : hideLogin ? null : (
              <Link
                to={`/login?next=${encodeURIComponent(currentRouteURL)}`}
                data-cy="header-login-button"
              >
                Sign in
              </Link>
            )}
          </Col>
        </Row>
      </Header>
      <Content style={{ minHeight: contentMinHeight }}>
        {renderContentPadding ? (
          <StandardWidth>
            <Outlet />
          </StandardWidth>
        ) : (
          <Outlet />
        )}
      </Content>
      <Footer>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
          }}
        >
          <Text>
            Copyright &copy; {new Date().getFullYear()} {companyName}. All
            rights reserved.
            {rootData?.ENV.T_AND_C_URL ? (
              <span>
                {" "}
                <a
                  style={{ textDecoration: "underline" }}
                  href={rootData.ENV.T_AND_C_URL}
                >
                  Terms and conditions
                </a>
              </span>
            ) : null}
          </Text>
          <Text>
            Powered by{" "}
            <a
              style={{ textDecoration: "underline" }}
              href="https://graphile.org/postgraphile"
            >
              PostGraphile
            </a>
          </Text>
        </div>
      </Footer>
    </Layout>
  );
}

import { FC } from "react";
import { Layout, Nav } from "@douyinfe/semi-ui-19";
import { views } from "./routes";
import { Outlet, useLocation, useNavigate } from "react-router";

const { Header, Content } = Layout;

export const App: FC = () => {
  const navigate = useNavigate();
  const defaultSelected = useLocation().pathname.split("/")[1];
  const items = views.map(x => ({
    itemKey: x.name,
    icon: x.icon,
    text: x.name,
  }));
  return (
    <Layout className={"h-full"}>
      <Header>
        <Nav
          mode={"horizontal"}
          defaultSelectedKeys={[defaultSelected]}
          items={items}
          onSelect={({ itemKey }) => navigate(itemKey as string)}
        />
      </Header>
      <Content>
        <Outlet />
      </Content>
    </Layout>
  );
};

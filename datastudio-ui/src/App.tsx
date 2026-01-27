import { FC } from "react";
import { Layout } from "@douyinfe/semi-ui-19";
import { Outlet } from "react-router";
import { TopNav } from "@components/TopNav";

const { Header, Content, Sider } = Layout;

export const App: FC = () => {
  return (
    <Layout className={"h-full semi-light-scrollbar bg-semi-color-fill-0"}>
      <Header className={""}>
        <TopNav />
      </Header>
      <Layout>
        <Sider></Sider>
        <Content>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

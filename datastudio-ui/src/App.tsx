import { FC, useState } from "react";
import { Breadcrumb, Layout, LocaleProvider } from "@douyinfe/semi-ui";
import { Outlet } from "react-router";
import { TopNav } from "@components/TopNav";
import { SideNav } from "@components/SideNav";
import { flattedViews, navs } from "@/routes";
import { GlobalProvider, useGlobal } from "@utils/context.tsx";
import { messages, semiMessages } from "@i18n/locale.ts";
import { IntlProvider } from "react-intl";

const { Header, Content, Sider } = Layout;

export const App: FC = () => {
  //todo 设置全局语言
  const language = "en-US";

  return (
    <LocaleProvider locale={semiMessages[language]}>
      <IntlProvider locale={language} messages={messages[language]}>
        <GlobalProvider>
          <AppLayout />
        </GlobalProvider>
      </IntlProvider>
    </LocaleProvider>
  );
};

const AppLayout: FC = () => {
  const { navigate } = useGlobal();
  const [open, setOpen] = useState<boolean>(true);
  return (
    <Layout className={"h-full semi-light-scrollbar bg-semi-color-fill-0"}>
      <Header>
        <TopNav onCollapse={() => setOpen(pre => !pre)} />
      </Header>
      <Layout className={"h-[calc(-48px+100vh)]"}>
        <Sider>
          <SideNav isOpen={open} items={navs} onItemClick={navigate} />
        </Sider>
        <Layout>
          <Header className={"pb-2 pl-2"}>
            <LayoutBreads />
          </Header>
          <Content className={"rounded-lg h-full overflow-auto"}>
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

const LayoutBreads: FC = () => {
  const { msg, navigate, location } = useGlobal();
  const currentView = flattedViews.findLast(
    view => view.path && location.pathname.startsWith(view.path),
  )!;
  const breads = currentView.breads?.map(x => ({ ...x, name: msg(x.name!) }));
  return (
    <Breadcrumb routes={breads} onClick={route => navigate(route.path!)} />
  );
};

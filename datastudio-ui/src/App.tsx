import { FC, useState } from "react";
import { Breadcrumb, Layout, LocaleProvider } from "@douyinfe/semi-ui";
import { Outlet, UIMatch, useMatches } from "react-router";
import { TopNav } from "@components/TopNav";
import { SideNav, SideNavItem } from "@components/SideNav";
import { Handle, views } from "@/routes";
import { GlobalProvider, useGlobal } from "@utils/context.tsx";
import { messages, semiMessages } from "@i18n/locale.ts";
import { IntlProvider } from "react-intl";
import { IconHomeStroked } from "@douyinfe/semi-icons";

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
  const items = views.map((view, index) => ({
    order: index,
    path: view.path,
    ...view.handle,
  })) as SideNavItem[];
  return (
    <Layout className={"h-full bg-semi-color-fill-0"}>
      <Header>
        <TopNav onCollapse={() => setOpen(pre => !pre)} />
      </Header>
      <Layout className={"h-[calc(-48px+100vh)]"}>
        <Sider>
          <SideNav isOpen={open} items={items} onItemClick={navigate} />
        </Sider>
        <Layout>
          <Header className={"pb-2 pl-2"}>
            <LayoutBreads />
          </Header>
          <Content className={"rounded-lg h-full overflow-auto pb-1 pr-1"}>
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

const LayoutBreads: FC = () => {
  const { navigate, msg } = useGlobal();
  const breads = (useMatches() as UIMatch<unknown, Handle>[])
    .filter(match => match.pathname !== "/")
    .map(match => ({
      path: match.pathname,
      name: msg(match.handle.name!),
      icon: match.handle.icon,
    }));
  breads.unshift({
    path: "/",
    name: msg("views.home"),
    icon: <IconHomeStroked />,
  });

  return (
    <Breadcrumb routes={breads} onClick={route => navigate(route.path!)} />
  );
};

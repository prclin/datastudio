import { FC, useState } from "react";
import { Breadcrumb, Layout, LocaleProvider } from "@douyinfe/semi-ui-19";
import { Outlet } from "react-router";
import { TopNav } from "@components/TopNav";
import { SideNav } from "@components/SideNav";
import { views } from "@/routes";
import { GlobalProvider, useGlobal } from "@utils/context.tsx";
import { messages, semiMessages } from "@i18n/locale.ts";
import { IntlProvider } from "react-intl";
import { RouteProps } from "@douyinfe/semi-ui-19/lib/es/breadcrumb";

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
  const { msg, navigate, location } = useGlobal();
  const [open, setOpen] = useState<boolean>(true);
  const items = views
    .filter(x => x.level === 1)
    .map(x => {
      const { default: _, order: _1, ...other } = x;
      other.text = msg(other.text);
      return other;
    });

  const breads: Array<RouteProps | string> = [
    { path: "/", name: msg(views.find(view => view.path === "")!.text) },
  ];
  let _views = views;
  location.pathname
    .split("/")
    .slice(1)
    .filter(path => path !== "")
    .forEach(path => {
      const view = _views?.find(view => view.path === path);
      if (!view) return;
      breads.push({ path: view.path, name: msg(view.text) });
      _views = view?.children || [];
    });

  return (
    <Layout className={"h-full semi-light-scrollbar bg-semi-color-fill-0"}>
      <Header>
        <TopNav onCollapse={() => setOpen(pre => !pre)} />
      </Header>
      <Layout className={"h-[calc(-48px+100vh)]"}>
        <Sider>
          <SideNav isOpen={open} items={items} onItemClick={navigate} />
        </Sider>
        <Layout>
          <Header className={"pb-2 pl-2"}>
            <Breadcrumb
              routes={breads}
              onClick={route => navigate(route.path!)}
            />
          </Header>
          <Content className={"rounded-lg h-full overflow-auto"}>
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

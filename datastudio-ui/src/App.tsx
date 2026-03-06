import { FC, useState } from "react";
import { Layout, LocaleProvider } from "@douyinfe/semi-ui-19";
import { Outlet } from "react-router";
import { TopNav } from "@components/TopNav";
import { SideNav } from "@components/SideNav";
import { views } from "@/routes";
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
  const { msg, navigate, location } = useGlobal();
  const [open, setOpen] = useState<boolean>(true);
  const items = views.map(x => {
    const { default: _, order: _1, ...other } = x;
    other.text = msg(other.text);
    return other;
  });
  return (
    <Layout className={"h-full semi-light-scrollbar bg-semi-color-fill-0"}>
      <Header className={""}>
        <TopNav
          onCollapse={() => {
            setOpen(pre => !pre);
          }}
        />
      </Header>
      <Layout className={"h-[calc(-48px+100vh)]"}>
        <Sider>
          <SideNav
            isOpen={open}
            items={items}
            onItemClick={navigate}
            defaultSelected={location.pathname.split("/")[1]}
          />
        </Sider>
        <Content className={"bg-semi-color-bg-0 rounded-lg"}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

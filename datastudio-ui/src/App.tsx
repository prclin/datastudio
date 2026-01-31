import { FC } from "react";
import { Layout, LocaleProvider } from "@douyinfe/semi-ui-19";
import { Outlet } from "react-router";
import { TopNav } from "@components/TopNav";
import { IntlProvider } from "react-intl";
import { messages, semiMessages } from "@i18n/locale.ts";
import { GlobalProvider } from "@utils/context.tsx";

const { Header, Content, Sider } = Layout;

export const App: FC = () => {
  //todo 设置全局语言
  const language = "en-US";

  return (
    <LocaleProvider locale={semiMessages[language]}>
      <IntlProvider locale={language} messages={messages[language]}>
        <GlobalProvider>
          <Layout
            className={"h-full semi-light-scrollbar bg-semi-color-fill-0"}
          >
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
        </GlobalProvider>
      </IntlProvider>
    </LocaleProvider>
  );
};

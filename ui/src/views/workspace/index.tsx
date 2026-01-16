import { FC } from "react";
import { IconHomeStroked } from "@douyinfe/semi-icons";
import { Layout } from "@douyinfe/semi-ui-19";
import { Todo } from "../../components/Todo";
import { Messages } from "../../components/Messages";

const { Content, Sider } = Layout;
export const Workspace: FC = () => {
  return (
    <Layout className={"h-full p-8"}>
      <Content className={"flex-[3] px-3"}>
        <div className={"bg-semi-color-bg-0 rounded-lg p-4 h-96"}>
          <Todo />
        </div>
      </Content>
      <Sider className={"flex-1 px-3"}>
        <div className={"bg-semi-color-bg-0 rounded-lg p-4 h-64"}>
          <Messages />
        </div>
      </Sider>
    </Layout>
  );
};

export const order = 1;
export const icon = <IconHomeStroked />;
export default Workspace;

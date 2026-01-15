import { FC } from "react";
import { IconHomeStroked } from "@douyinfe/semi-icons";
import { Layout } from "@douyinfe/semi-ui-19";
import { Todo } from "../../components/Todo";

const { Content, Sider } = Layout;
export const Workspace: FC = () => {
  return (
    <Layout className={"h-full"}>
      <Content className={"flex-[3]"}>
        <Todo />
      </Content>
      <Sider className={"flex-1"}>sider</Sider>
    </Layout>
  );
};

export const order = 1;
export const icon = <IconHomeStroked />;
export default Workspace;

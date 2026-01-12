import { FC } from "react";
import { IconHomeStroked } from "@douyinfe/semi-icons";
import { Layout } from "@douyinfe/semi-ui-19";
import { Todo } from "../../components/todo.tsx";

const { Content, Sider } = Layout;
export const Workspace: FC = () => {
  return (
    <Layout className={"h-full"}>
      <Content>
        <Todo />
      </Content>
      <Sider>sider</Sider>
    </Layout>
  );
};

export const order = 1;
export const icon = <IconHomeStroked />;
export default Workspace;

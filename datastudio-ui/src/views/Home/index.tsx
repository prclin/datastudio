import { FC } from "react";
import { Todo } from "@components/Todo";
import { IconHomeStroked } from "@douyinfe/semi-icons";

export const Home: FC = () => {
  return (
    <div>
      <Todo />
    </div>
  );
};
export default Home;
export const order = 1;
export const text = "views.home";
export const path = "";
export const icon = <IconHomeStroked size={"small"} />;

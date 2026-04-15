import { FC } from "react";
import { Todo } from "@components/Todo";

export const Component: FC = () => {
  return (
    <div>
      <Todo />
    </div>
  );
};
Component.displayName = "Home";

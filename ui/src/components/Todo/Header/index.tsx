import { FC } from "react";
import { Space } from "@douyinfe/semi-ui-19";
import { TaskStatus } from "./status.tsx";
import { TaskFilter } from "./filter.tsx";
import { TaskFields } from "./fields.tsx";

export const Header: FC = () => {
  return (
    <Space>
      <TaskStatus />
      <TaskFilter />
      <TaskFields />
    </Space>
  );
};

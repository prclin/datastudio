import { Button, Dropdown, Space } from "@douyinfe/semi-ui-19";
import { FC } from "react";
import {
  IconChevronDown,
  IconClear,
  IconFastForward,
  IconPlay,
} from "@douyinfe/semi-icons";
import { withDefaultProps } from "@utils/component.tsx";

const ToolButton = withDefaultProps(Button, {
  type: "tertiary",
  theme: "borderless",
  className: "hover:text-semi-color-primary",
});
export const ToolBar: FC = () => {
  return (
    <div className={"px-2 flex justify-between"}>
      <Space>
        <ToolButton icon={<IconClear />} />
        <ToolButton icon={<IconPlay />} />
        <ToolButton icon={<IconFastForward />} />
      </Space>
      <Dropdown
        trigger={"click"}
        position={"bottomRight"}
        render={
          <Dropdown.Menu>
            <Dropdown.Item>Python 3 (ipykernel)</Dropdown.Item>
            <Dropdown.Item>Spark 2.4.8</Dropdown.Item>
            <Dropdown.Item>Flink 1.18.1</Dropdown.Item>
          </Dropdown.Menu>
        }
      >
        <div>
          <Button
            theme={"borderless"}
            type={"tertiary"}
            icon={<IconChevronDown />}
            iconPosition={"right"}
          >
            No Kernel
          </Button>
        </div>
      </Dropdown>
    </div>
  );
};

import { Button, Dropdown, Space } from "@douyinfe/semi-ui-19";
import { FC, memo, useState } from "react";
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

const items = ["Python 3 (ipykernel)", "Spark 2.4.8", "Flink 1.18.1"];
export const ToolBar: FC = memo(() => {
  const [kernel, setKernel] = useState("No Kernel");
  return (
    <div className={"px-2 flex justify-between"}>
      <Space>
        <ToolButton icon={<IconClear />} />
        <ToolButton icon={<IconPlay />} />
        <ToolButton icon={<IconFastForward />} />
      </Space>
      <Dropdown
        clickToHide
        trigger={"click"}
        position={"bottomRight"}
        render={
          <Dropdown.Menu>
            {items.map(item => (
              <Dropdown.Item onClick={() => setKernel(item)}>
                {item}
              </Dropdown.Item>
            ))}
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
            {kernel}
          </Button>
        </div>
      </Dropdown>
    </div>
  );
});

import { FC, useState } from "react";
import { Button, Dropdown } from "@douyinfe/semi-ui-19";
import {
  IconCheckCircleStroked,
  IconOrderedListStroked,
} from "@douyinfe/semi-icons";

export const TaskStatus: FC = () => {
  const status = ["未完成", "已完成", "全部任务"];
  const [currentStatus, setCurrentStatus] = useState(status[0]);

  return (
    <Dropdown
      trigger={"click"}
      clickToHide={true}
      position={"bottomLeft"}
      render={
        <Dropdown.Menu className={"!px-1"}>
          {status.map(x => (
            <Dropdown.Item
              key={x}
              className={"!p-2 w-32 flex justify-between"}
              active={currentStatus == x}
              onClick={() => setCurrentStatus(x)}
            >
              {x} {currentStatus == x ? <IconCheckCircleStroked /> : ""}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      }
    >
      <div>
        <Button
          theme={"borderless"}
          type={"tertiary"}
          size={"small"}
          contentClassName={"text-xs font-normal"}
          icon={<IconOrderedListStroked />}
        >
          {currentStatus}
        </Button>
      </div>
    </Dropdown>
  );
};

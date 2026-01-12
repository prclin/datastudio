import { FC, useState } from "react";
import { Button, Dropdown, List, Space } from "@douyinfe/semi-ui-19";
import {
  IconCheckCircleStroked,
  IconOrderedListStroked,
} from "@douyinfe/semi-icons";

export const Todo: FC = () => {
  return <List header={<Header />} />;
};
const Header: FC = () => {
  const status = ["未完成", "已完成", "全部任务"];
  const [currentStatus, setCurrentStatus] = useState(status[0]);
  return (
    <Space>
      <Dropdown
        trigger={"click"}
        clickToHide={true}
        render={
          <Dropdown.Menu className={"!px-1"}>
            {status.map((x) => (
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
            icon={<IconOrderedListStroked />}
          >
            {currentStatus}
          </Button>
        </div>
      </Dropdown>
    </Space>
  );
};
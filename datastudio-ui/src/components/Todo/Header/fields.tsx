import { FC, useState } from "react";
import { Button, Dropdown, Typography } from "@douyinfe/semi-ui-19";
import {
  IconConfigStroked,
  IconEyeClosedStroked,
  IconEyeOpenedStroked,
} from "@douyinfe/semi-icons";

const fields = [
  "负责人",
  "开始时间",
  "截止时间",
  "子任务进度",
  "任务来源",
  "创建人",
  "分配人",
  "关注人",
  "创建时间",
  "完成时间",
  "更新时间",
  "任务ID",
  "来源类别",
];
export const TaskFields: FC = () => {
  const [selected, setSelected] = useState<string[]>([]);
  return (
    <Dropdown
      trigger={"click"}
      position={"bottomLeft"}
      render={
        <div
          style={{ maxHeight: "calc(-164px + 100vh)" }}
          className={"flex flex-col pt-3 px-3"}
        >
          <Typography.Text className={"mb-3"}>字段配置</Typography.Text>
          <div
            className={
              "flex-1 w-80 flex flex-col !gap-y-2 pb-3 overflow-x-auto"
            }
          >
            {fields.map(x => (
              <FieldItem
                key={x}
                value={x}
                defaultChecked={selected.find(y => x == y) != undefined}
                onChange={checked => {
                  setSelected(pre => {
                    if (checked) return [...pre, x];
                    return pre.filter(y => x == y);
                  });
                }}
              />
            ))}
          </div>
        </div>
      }
    >
      <div>
        <Button
          theme={"borderless"}
          type={"tertiary"}
          size={"small"}
          contentClassName={"text-xs font-normal"}
          icon={<IconConfigStroked />}
        >
          字段配置
        </Button>
      </div>
    </Dropdown>
  );
};

interface FieldItemProps {
  value: string;
  defaultChecked: boolean;
  onChange: (checked: boolean) => void;
}
const FieldItem: FC<FieldItemProps> = ({
  value,
  defaultChecked = false,
  onChange,
}) => {
  const [checked, setChecked] = useState(defaultChecked);
  return (
    <div className={"w-full flex justify-between"}>
      {value}
      <Button
        theme={"borderless"}
        type={"tertiary"}
        size={"small"}
        contentClassName={"text-xs font-normal"}
        icon={checked ? <IconEyeOpenedStroked /> : <IconEyeClosedStroked />}
        onClick={() => {
          const result = !checked;
          setChecked(result);
          onChange(result);
        }}
      />
    </div>
  );
};

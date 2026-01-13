import { FC, RefObject, useRef, useState } from "react";
import {
  ArrayField,
  Button,
  Dropdown,
  Form,
  Space,
  Table,
  Typography,
} from "@douyinfe/semi-ui-19";
import {
  IconCenterLeftStroked,
  IconChainStroked,
  IconCheckCircleStroked,
  IconClockStroked,
  IconClose,
  IconConfigStroked,
  IconEyeClosedStroked,
  IconEyeOpenedStroked,
  IconFilterStroked,
  IconLoopTextStroked,
  IconOrderedListStroked,
  IconTextStroked,
  IconUserStroked,
} from "@douyinfe/semi-icons";
import Section from "@douyinfe/semi-ui-19/lib/es/form/section";
import { OptionProps } from "@douyinfe/semi-ui-19/lib/es/select";
import { ColumnProps } from "@douyinfe/semi-ui-19/lib/es/table";

const { Text } = Typography;

const columns: ColumnProps[] = [
  {
    fixed: "left",
    width: 426,
    title: (
      <Text
        ellipsis={{ showTooltip: true }}
        icon={<IconTextStroked />}
        size={"small"}
      >
        任务标题
      </Text>
    ),
    dataIndex: "title",
  },
  {
    title: (
      <Text
        ellipsis={{ showTooltip: true }}
        icon={<IconUserStroked />}
        size={"small"}
      >
        负责人
      </Text>
    ),
    width: 120,
    dataIndex: "executor",
  },
  {
    title: (
      <Text
        ellipsis={{ showTooltip: true }}
        icon={<IconClockStroked />}
        size={"small"}
      >
        开始时间
      </Text>
    ),
    width: 180,
    dataIndex: "start_time",
  },
  {
    title: (
      <Text
        ellipsis={{ showTooltip: true }}
        icon={<IconClockStroked />}
        size={"small"}
      >
        截止时间
      </Text>
    ),
    width: 180,
    dataIndex: "deadline",
  },
  {
    title: (
      <Text
        ellipsis={{ showTooltip: true }}
        icon={<IconLoopTextStroked />}
        size={"small"}
      >
        子任务进度
      </Text>
    ),
    width: 80,
    dataIndex: "subtask_progress",
  },
  {
    title: (
      <Text
        ellipsis={{ showTooltip: true }}
        icon={<IconCenterLeftStroked />}
        size={"small"}
      >
        任务来源
      </Text>
    ),
    width: 140,
    dataIndex: "source",
  },
  {
    title: (
      <Text
        ellipsis={{ showTooltip: true }}
        icon={<IconUserStroked />}
        size={"small"}
      >
        创建人
      </Text>
    ),
    width: 120,
    dataIndex: "creator",
  },
  {
    title: (
      <Text
        ellipsis={{ showTooltip: true }}
        icon={<IconUserStroked />}
        size={"small"}
      >
        分配人
      </Text>
    ),
    width: 120,
    dataIndex: "assignee",
  },
  {
    title: (
      <Text
        ellipsis={{ showTooltip: true }}
        icon={<IconUserStroked />}
        size={"small"}
      >
        关注人
      </Text>
    ),
    width: 120,
    dataIndex: "followers",
  },
  {
    title: (
      <Text
        ellipsis={{ showTooltip: true }}
        icon={<IconClockStroked />}
        size={"small"}
      >
        创建时间
      </Text>
    ),
    width: 120,
    dataIndex: "creation_time",
  },
  {
    title: (
      <Text
        ellipsis={{ showTooltip: true }}
        icon={<IconClockStroked />}
        size={"small"}
      >
        完成时间
      </Text>
    ),
    width: 120,
    dataIndex: "completion_time",
  },
  {
    title: (
      <Text
        ellipsis={{ showTooltip: true }}
        icon={<IconClockStroked />}
        size={"small"}
      >
        更新时间
      </Text>
    ),
    width: 120,
    dataIndex: "update_time",
  },
  {
    title: (
      <Text
        ellipsis={{ showTooltip: true }}
        icon={<IconChainStroked />}
        size={"small"}
      >
        任务 ID
      </Text>
    ),
    width: 120,
    dataIndex: "task_id",
  },
  {
    title: (
      <Text
        ellipsis={{ showTooltip: true }}
        icon={<IconCenterLeftStroked />}
        size={"small"}
      >
        来源类别
      </Text>
    ),
    width: 80,
    dataIndex: "source_kind",
  },
];

const tableData = [
  {
    title: "xxasd",
    executor: "xxasd",
    start_time: "xxasd",
    deadline: "xxasd",
    subtask_progress: "xxasd",
    source: "xxasd",
    creator: "xxasd",
    assignee: "xxasd",
    followers: "xxasd",
    creation_time: "xxasd",
    completion_time: "xxasd",
    update_time: "xxasd",
    task_id: "xxasd",
    source_kind: "xxasd",
    children: [
      {
        title: "xxss",
        executor: "xxasd",
        start_time: "xxasd",
        deadline: "xxasd",
        subtask_progress: "xxasd",
        source: "xxasd",
        creator: "xxasd",
        assignee: "xxasd",
        followers: "xxasd",
        creation_time: "xxasd",
        completion_time: "xxasd",
        update_time: "xxasd",
        task_id: "xxasd",
        source_kind: "xxasd",
      },
    ],
  },
];
export const Todo: FC = () => {
  return (
    <>
      <Table
        resizable
        sticky
        pagination={false}
        title={<Header />}
        columns={columns}
        dataSource={tableData}
        rowKey={"title"}
        onHeaderRow={() => ({
          className:
            "[&_.react-resizable-handle]:invisible [&:hover_.react-resizable-handle]:visible",
        })}
      />
    </>
  );
};
const Header: FC = () => {
  return (
    <Space>
      <TaskStatus />
      <TaskFilter />
      <TaskFields />
    </Space>
  );
};

const TaskStatus: FC = () => {
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

const TaskFilter: FC = () => {
  const form = useRef<Form>(undefined);
  return (
    <Dropdown
      keepDOM
      trigger="click"
      render={
        <Form className={"w-176 p-5"} ref={form as RefObject<Form>}>
          <ArrayField field={"conditions"}>
            {({ arrayFields, add }) => {
              return (
                <Space vertical={true} align={"start"} className={"w-full"}>
                  <Section
                    text={
                      <div className={"flex justify-between"}>
                        <span className={"text-sm font-normal"}>筛选</span>
                        <Button
                          theme={"borderless"}
                          type={"tertiary"}
                          size={"small"}
                          contentClassName={"text-xs font-normal"}
                        >
                          清空
                        </Button>
                      </div>
                    }
                  >
                    {arrayFields.map(({ key, field, remove }) => {
                      return (
                        <FilterItem remove={remove} field={field} key={key} />
                      );
                    })}
                  </Section>
                  <Button
                    theme={"outline"}
                    type={"tertiary"}
                    onClick={() => add()}
                    contentClassName={"font-normal text-semi-color-text-0"}
                  >
                    添加条件
                  </Button>
                </Space>
              );
            }}
          </ArrayField>
        </Form>
      }
    >
      <div>
        <Button
          theme={"borderless"}
          type={"tertiary"}
          icon={<IconFilterStroked />}
          size={"small"}
          contentClassName={"text-xs font-normal"}
        >
          筛选
        </Button>
      </div>
    </Dropdown>
  );
};

const conditions = [
  {
    title: "executor",
    operators: ["in", "not in", "is null", "in not null"],
    type: "select",
  },
  {
    title: "start_time",
    operators: ["=", "<", ">", "between", "is null", "in not null"],
    type: "time",
  },
  {
    title: "deadline",
    operators: ["=", "<", ">", "between", "is null", "in not null"],
    type: "time",
  },
  {
    title: "completion_time",
    operators: ["=", "<", ">", "between", "is null", "in not null"],
    type: "time",
  },
  {
    title: "assignee",
    operators: ["in", "not in", "is null", "in not null"],
    type: "select",
  },
  {
    title: "followers",
    operators: ["in", "not in", "is null", "in not null"],
    type: "select",
  },
  {
    title: "creator",
    operators: ["in", "not in", "is null", "in not null"],
    type: "select",
  },
  {
    title: "source",
    operators: ["in", "not in"],
    type: "select",
  },
  {
    title: "source_kind",
    operators: ["in", "not in"],
    type: "select",
  },
  {
    title: "creation_time",
    operators: ["=", "<", ">", "between"],
    type: "time",
  },
  {
    title: "update_time",
    operators: ["=", "<", ">", "between"],
    type: "time",
  },
];

const titles = conditions.map(x => ({ label: x.title, value: x.title }));
interface FilterItemProps {
  field: string;
  remove: () => void;
}
const FilterItem: FC<FilterItemProps> = ({ field, remove }) => {
  const [fieldValue, setFieldValue] = useState<string>();
  const condition = conditions.find(x => x.title == fieldValue);
  const operatorOptions = condition?.operators.map(
    x => ({ label: x, value: x }) as OptionProps,
  );
  const kind = condition?.type;
  const defaultOperator = operatorOptions && operatorOptions[0].value;
  const [operator, setOperator] = useState(defaultOperator);
  return (
    <div className={"flex items-center space-x-2"}>
      <span>当</span>
      <div>
        <Form.Select
          noLabel
          field={`${field}.field`}
          defaultOpen
          defaultActiveFirstOption
          className={"w-44"}
          zIndex={1060}
          optionList={titles}
          onChange={value => setFieldValue(value as string)}
        />
      </div>
      <div className={"flex-1 flex space-x-2"}>
        {fieldValue && (
          <>
            <Form.Select
              noLabel
              field={`${field}.operator`}
              className={"w-28"}
              zIndex={1060}
              optionList={operatorOptions}
              initValue={defaultOperator}
              onChange={value => setOperator(value as string)}
            />
            <div className={"flex-1"}>
              {kind == "select" ? (
                <Form.Select
                  noLabel
                  filter
                  multiple
                  zIndex={1060}
                  field={`${field}.value`}
                  className={"w-full"}
                />
              ) : (
                <Form.DatePicker
                  noLabel
                  zIndex={1060}
                  field={`${field}.value`}
                  type={operator == "between" ? "dateTimeRange" : "dateTime"}
                  className={"w-full"}
                />
              )}
            </div>
          </>
        )}
      </div>
      <Button
        icon={<IconClose />}
        type={"tertiary"}
        theme={"borderless"}
        onClick={remove}
      />
    </div>
  );
};

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
const TaskFields: FC = () => {
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

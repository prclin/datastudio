import { FC } from "react";
import {
  Avatar,
  Button,
  DatePicker,
  Progress,
  Select,
  Table,
  Tooltip,
  Typography,
} from "@douyinfe/semi-ui-19";
import {
  IconCalendarStroked,
  IconCenterLeftStroked,
  IconChainStroked,
  IconClockStroked,
  IconLoopTextStroked,
  IconTextStroked,
  IconTickCircle,
  IconUserAdd,
  IconUserStroked,
} from "@douyinfe/semi-icons";
import { ColumnProps } from "@douyinfe/semi-ui-19/lib/es/table";
import { withDefaultProps } from "../../utils/component.tsx";
import { TextProps } from "@douyinfe/semi-ui-19/lib/es/typography";
import { Header } from "./Header";

const { Text, Title } = Typography;

const TableTitle = withDefaultProps<TextProps>(Text, {
  ellipsis: { showTooltip: true },
  size: "small",
  className: "leading-5 h-5",
});

const columns: ColumnProps<Data>[] = [
  {
    fixed: "left",
    width: 426,
    title: <TableTitle icon={<IconTextStroked />}>任务标题</TableTitle>,
    dataIndex: "title",
    useFullRender: true,
    render: (text, record, _index, options) => {
      console.log(options);
      return (
        <div className={"flex items-center px-2"}>
          {options?.indentText}
          {options?.expandIcon}
          {record.completed ? (
            <IconTickCircle className={"text-semi-color-success mr-2"} />
          ) : (
            <span className={"h-4 w-4 border rounded-lg mr-2"} />
          )}
          <span className={"flex-1 truncate"}>{text}</span>
        </div>
      );
    },
  },
  {
    title: <TableTitle icon={<IconUserStroked />}>负责人</TableTitle>,
    width: 120,
    dataIndex: "executor",
    render: () => {
      return (
        <div
          className={
            "border border-transparent hover:border-semi-color-border px-2"
          }
        >
          <Select
            filter
            searchPosition={"dropdown"}
            className={"w-full h-full flex items-center"}
            triggerRender={() => (
              <Tooltip content={"添加负责人"} className={"text-xs"}>
                <div>
                  <Button
                    icon={<IconUserAdd className={"text-semi-color-text-3"} />}
                    theme={"borderless"}
                    size={"small"}
                  />
                </div>
              </Tooltip>
            )}
          />
        </div>
      );
    },
  },
  {
    title: <TableTitle icon={<IconClockStroked />}>开始时间</TableTitle>,
    width: 180,
    dataIndex: "start_time",
    sorter: (a, b) => (a!.start_time > b!.start_time ? 1 : -1),
    render: () => {
      return (
        <div
          className={
            "border border-transparent hover:border-semi-color-border px-2"
          }
        >
          <DatePicker
            className={
              "w-full h-full [&_.semi-datepicker-input]:flex [&_.semi-datepicker-input]:items-center [&_.semi-datepicker-input]:h-full"
            }
            triggerRender={() => (
              <Tooltip content={"添加开始时间"} className={"text-xs"}>
                <div>
                  <Button
                    icon={
                      <IconCalendarStroked
                        className={"text-semi-color-text-3"}
                      />
                    }
                    theme={"borderless"}
                    size={"small"}
                  />
                </div>
              </Tooltip>
            )}
          />
        </div>
      );
    },
  },
  {
    title: <TableTitle icon={<IconClockStroked />}>截止时间</TableTitle>,
    width: 180,
    dataIndex: "deadline",
    sorter: (a, b) => (a!.deadline > b!.deadline ? 1 : -1),
    render: () => {
      return (
        <div
          className={
            "border border-transparent hover:border-semi-color-border px-2"
          }
        >
          <DatePicker
            className={
              "w-full h-full [&_.semi-datepicker-input]:flex [&_.semi-datepicker-input]:items-center [&_.semi-datepicker-input]:h-full"
            }
            triggerRender={() => (
              <Tooltip content={"添加结束"} className={"text-xs"}>
                <div>
                  <Button
                    icon={
                      <IconCalendarStroked
                        className={"text-semi-color-text-3"}
                      />
                    }
                    theme={"borderless"}
                    size={"small"}
                  />
                </div>
              </Tooltip>
            )}
          />
        </div>
      );
    },
  },
  {
    title: <TableTitle icon={<IconLoopTextStroked />}>子任务进度</TableTitle>,
    width: 80,
    render: (_, record) => {
      const succeeds = record.children?.filter(x => x.completed).length;
      const total = record.children?.length || 1;
      const percent = ((succeeds || 0) / (total || 1)) * 100;
      return (
        <div className={"flex items-center px-2"}>
          {record.children ? (
            <Tooltip
              content={`${succeeds}/${total} ${percent}%`}
              className={"text-xs"}
            >
              <div>
                <Progress percent={percent} className={"w-6"} />
              </div>
            </Tooltip>
          ) : (
            "-"
          )}
        </div>
      );
    },
  },
  {
    title: <TableTitle icon={<IconCenterLeftStroked />}>任务来源</TableTitle>,
    width: 140,
    dataIndex: "source",
    render: () => <div className={"flex items-center px-2"}>-</div>,
  },
  {
    title: <TableTitle icon={<IconUserStroked />}>创建人</TableTitle>,
    width: 120,
    dataIndex: "creator",
    render: () => (
      <div className={"flex items-center px-2"}>
        <Button
          icon={<Avatar size={"extra-extra-small"} />}
          type={"tertiary"}
          size={"small"}
          className={
            "rounded-xl font-normal text-semi-color-text-0 p-0 pl-0.5 pr-2"
          }
        >
          创建人
        </Button>
      </div>
    ),
  },
  {
    title: <TableTitle icon={<IconUserStroked />}>分配人</TableTitle>,
    width: 120,
    dataIndex: "assignee",
    render: () => (
      <div className={"flex items-center px-2"}>
        <Button
          icon={<Avatar size={"extra-extra-small"} />}
          type={"tertiary"}
          size={"small"}
          className={
            "rounded-xl font-normal text-semi-color-text-0 p-0 pl-0.5 pr-2"
          }
        >
          分配人
        </Button>
      </div>
    ),
  },
  {
    title: <TableTitle icon={<IconUserStroked />}>关注人</TableTitle>,
    width: 120,
    dataIndex: "followers",
    render: () => {
      return (
        <div
          className={
            "border border-transparent hover:border-semi-color-border px-2"
          }
        >
          <Select
            filter
            searchPosition={"dropdown"}
            className={"w-full h-full flex items-center"}
            triggerRender={() => (
              <Tooltip content={"添加负责人"} className={"text-xs"}>
                <div>
                  <Button
                    icon={<IconUserAdd className={"text-semi-color-text-3"} />}
                    theme={"borderless"}
                    size={"small"}
                  />
                </div>
              </Tooltip>
            )}
          />
        </div>
      );
    },
  },
  {
    title: <TableTitle icon={<IconClockStroked />}>创建时间</TableTitle>,
    width: 120,
    dataIndex: "creation_time",
    sorter: (a, b) => (a!.creation_time > b!.creation_time ? 1 : -1),
    render: () => (
      <div className={"px-2 flex items-center"}>
        <Text ellipsis={{ showTooltip: true }} type={"secondary"}>
          2025-12-01 00:00:00
        </Text>
      </div>
    ),
  },
  {
    title: <TableTitle icon={<IconClockStroked />}>完成时间</TableTitle>,
    width: 120,
    dataIndex: "completion_time",
    sorter: (a, b) => (a!.completion_time > b!.completion_time ? 1 : -1),
    render: () => (
      <div className={"px-2 flex items-center"}>
        <Text ellipsis={{ showTooltip: true }} type={"secondary"}>
          2025-12-01 00:00:00
        </Text>
      </div>
    ),
  },
  {
    title: <TableTitle icon={<IconClockStroked />}>更新时间</TableTitle>,
    width: 120,
    dataIndex: "update_time",
    sorter: (a, b) => (a!.update_time > b!.update_time ? 1 : -1),
    render: () => (
      <div className={"px-2 flex items-center"}>
        <Text ellipsis={{ showTooltip: true }} type={"secondary"}>
          2025-12-01 00:00:00
        </Text>
      </div>
    ),
  },
  {
    title: <TableTitle icon={<IconChainStroked />}>任务 ID</TableTitle>,
    width: 120,
    dataIndex: "task_id",
    render: text => (
      <div className={"px-2 flex items-center"}>
        <Text
          type={"secondary"}
          copyable={{
            content: "t1000120",
            render: (_, doCopy) => {
              return (
                <Tooltip content={"点击复制"} className={"text-xs"}>
                  <div>
                    <Button
                      onClick={doCopy}
                      size={"small"}
                      theme={"borderless"}
                      type={"tertiary"}
                      className={"p-0.5 font-normal"}
                    >
                      {text}
                    </Button>
                  </div>
                </Tooltip>
              );
            },
          }}
        />
      </div>
    ),
  },
  {
    title: <TableTitle icon={<IconCenterLeftStroked />}>来源类别</TableTitle>,
    width: 80,
    dataIndex: "source_kind",
    render: () => <div className={"flex items-center"}>-</div>,
  },
];

const tableData: Data[] = [
  {
    title: "xxasasddddddddddddddddddddddddddddddddasddddddddddddddddddddd",
    executor: "xxasd",
    start_time: "2025-12-31 00:00:01",
    deadline: "xxasd",
    source: "xxasd",
    creator: "xxasd",
    assignee: "xxasd",
    followers: "xxasd",
    creation_time: "xxasd",
    completion_time: "xxasd",
    update_time: "xxasd",
    task_id: "xxasd",
    source_kind: "xxasd",
    completed: false,
    children: [
      {
        title: "王爱华 sku产品信息制作表问题",
        executor: "xxasd",
        start_time: "xxasd",
        deadline: "xxasd",
        source: "xxasd",
        creator: "xxasd",
        assignee: "xxasd",
        followers: "xxasd",
        creation_time: "xxasd",
        completion_time: "xxasd",
        update_time: "xxasd",
        task_id: "xxasd",
        source_kind: "xxasd",
        completed: true,
      },
      {
        title: "王爱华 sku产品信asddd息制作表问题",
        executor: "xxasd",
        start_time: "xxasd",
        deadline: "xxasd",
        source: "xxasd",
        creator: "xxasd",
        assignee: "xxasd",
        followers: "xxasd",
        creation_time: "xxasd",
        completion_time: "xxasd",
        update_time: "xxasd",
        task_id: "xxasd",
        source_kind: "xxasd",
        completed: false,
      },
    ],
  },
  {
    title: "xxaasdsd",
    executor: "xxasd",
    start_time: "2025-12-31 00:00:00",
    deadline: "xxasd",
    source: "xxasd",
    creator: "xxasd",
    assignee: "xxasd",
    followers: "xxasd",
    creation_time: "xxasd",
    completion_time: "xxasd",
    update_time: "xxasd",
    task_id: "xxasd",
    source_kind: "xxasd",
    completed: false,
  },
  {
    title: "sss",
    executor: "xxasd",
    start_time: "2025-12-31 00:00:00",
    deadline: "xxasd",
    source: "xxasd",
    creator: "xxasd",
    assignee: "xxasd",
    followers: "xxasd",
    creation_time: "xxasd",
    completion_time: "xxasd",
    update_time: "xxasd",
    task_id: "xxasd",
    source_kind: "xxasd",
    completed: false,
  },
  {
    title: "sssasdasd",
    executor: "xxasd",
    start_time: "2025-12-31 00:00:00",
    deadline: "xxasd",
    source: "xxasd",
    creator: "xxasd",
    assignee: "xxasd",
    followers: "xxasd",
    creation_time: "xxasd",
    completion_time: "xxasd",
    update_time: "xxasd",
    task_id: "xxasd",
    source_kind: "xxasd",
    completed: false,
  },
];
interface Data {
  title: string;
  executor: string;
  start_time: string;
  deadline: string;
  source: string;
  creator: string;
  assignee: string;
  followers: string;
  creation_time: string;
  completion_time: string;
  update_time: string;
  task_id: string;
  source_kind: string;
  completed: boolean;
  children?: Data[];
}
export const Todo: FC = () => {
  return (
    <div>
      <Title heading={6} className={"border-b pb-4 border-semi-color-border"}>
        任务
      </Title>
      <Table
        resizable
        sticky
        pagination={false}
        title={<Header />}
        className={"[&_.semi-table-body]:h-[217px]"}
        columns={columns}
        dataSource={tableData}
        rowKey={"title"}
        onHeaderRow={() => ({
          className: [
            "[&_.react-resizable-handle]:invisible",
            "[&:hover_.react-resizable-handle]:visible",
            "[&_.semi-table-cell-fixed-left-last]:border-r-0",
            "[&_.semi-table-row-head]:border-b-0",
          ].join(" "),
        })}
        onRow={() => ({
          className:
            "[&_.semi-table-cell-fixed-left-last]:border-r-0 [&_td]:p-0 [&_td]:h-12 [&_td>:only-child]:h-full",
        })}
      />
    </div>
  );
};

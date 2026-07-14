import { FC, useState } from "react";
import {
  Button,
  Col,
  Form,
  Modal,
  Row,
  Space,
  Table,
  Tag,
  Typography,
} from "@douyinfe/semi-ui";
import { FormattedMessage } from "react-intl";
import {
  IconDeleteStroked,
  IconEditStroked,
  IconEyeOpenedStroked,
  IconPlus,
  IconSearch,
} from "@douyinfe/semi-icons";
import { useTableResizeRef } from "@utils/hooks.tsx";

const { Column } = Table;
const { Option } = Form.Select;

interface TaskRecord {
  key: number;
  name: string;
  kind: "spark" | "flink" | "mysql" | "starrocks";
  status: "enabled" | "disabled";
  owner: string;
  create_time: string;
  update_time: string;
}

const data: TaskRecord[] = [
  {
    key: 1,
    name: "daily_sales_aggregation",
    kind: "spark",
    status: "enabled",
    owner: "platform",
    create_time: "2026-05-09 15:20:01",
    update_time: "2026-05-09 15:32:15",
  },
  {
    key: 2,
    name: "ods_to_dwd_orders",
    kind: "flink",
    status: "enabled",
    owner: "data",
    create_time: "2026-05-09 14:48:13",
    update_time: "2026-05-09 15:05:22",
  },
  {
    key: 3,
    name: "user_profile_snapshot",
    kind: "spark",
    status: "enabled",
    owner: "analytics",
    create_time: "2026-05-09 11:02:26",
    update_time: "2026-05-09 11:09:40",
  },
  {
    key: 4,
    name: "quality_check_customer",
    kind: "mysql",
    status: "disabled",
    owner: "data",
    create_time: "2026-05-09 10:15:02",
    update_time: "2026-05-09 10:20:31",
  },
  {
    key: 5,
    name: "sync_metrics_to_olap",
    kind: "starrocks",
    status: "disabled",
    owner: "platform",
    create_time: "2026-05-09 09:20:45",
    update_time: "2026-05-09 09:30:11",
  },
];

const statusTagMap: Record<
  TaskRecord["status"],
  { color: "green" | "grey"; text: string }
> = {
  enabled: { color: "green", text: "启用" },
  disabled: { color: "grey", text: "禁用" },
};

export const Component: FC = () => {
  const ref = useTableResizeRef<HTMLDivElement>();
  const onCell = () => ({ className: "py-3" });
  const [visible, setVisible] = useState(false);

  return (
    <div className={"h-full p-2 flex flex-col space-y-6"}>
      <Row type="flex" justify="space-between" align="middle">
        <Col span={18}>
          <Typography.Title heading={3}>
            <FormattedMessage id={"views.task"} />
          </Typography.Title>
          <Typography.Text type={"secondary"}>
            <FormattedMessage id={"views.task.desc"} />
          </Typography.Text>
        </Col>
        <Col span={6}>
          <Space className={"w-full justify-end"}>
            <Button
              theme={"solid"}
              icon={<IconPlus />}
              className={"bg-[#ff6a3d] border-[#ff6a3d] hover:bg-[#ff5a2b]"}
              onClick={() => setVisible(true)}
            >
              Create Task
            </Button>
          </Space>
        </Col>
      </Row>
      <Form
        layout={"horizontal"}
        className={"first:[&_.semi-form-field-main>*]:bg-semi-color-bg-0"}
      >
        <Form.Input
          field="name"
          noLabel
          prefix={<IconSearch />}
          placeholder={"Search tasks..."}
        />
        <Form.Select
          field="kind"
          prefix={"KIND"}
          noLabel
          showClear
          placeholder={"ALL"}
          className={"w-48"}
        >
          <Option value={"spark"}>Spark</Option>
          <Option value={"flink"}>Flink</Option>
          <Option value={"mysql"}>MySQL</Option>
          <Option value={"starrocks"}>StarRocks</Option>
        </Form.Select>
        <Form.Select
          field="status"
          prefix={"STATUS"}
          noLabel
          showClear
          placeholder={"ALL"}
          className={"w-48"}
        >
          <Option value={"enabled"}>启用</Option>
          <Option value={"disabled"}>禁用</Option>
        </Form.Select>
        <Form.Select
          field="owner"
          prefix={"OWNER"}
          noLabel
          showClear
          placeholder={"ALL"}
          className={"w-48"}
        >
          <Option value={"platform"}>Platform</Option>
          <Option value={"data"}>Data</Option>
          <Option value={"analytics"}>Analytics</Option>
        </Form.Select>
        <Space>
          <Button htmlType={"submit"}>提交</Button>
          <Button htmlType={"reset"}>重置</Button>
        </Space>
      </Form>
      <div ref={ref} className={"flex-1 overflow-hidden"}>
        <Table
          sticky={true}
          dataSource={data}
          rowSelection={{ className: "py-3" }}
          onHeaderRow={() => ({
            className: "[&_.semi-table-row-head]:bg-semi-color-fill-1",
          })}
          pagination={{
            showSizeChanger: true,
            popoverPosition: "topLeft",
            pageSize: 20,
          }}
          className={"h-full [&_.semi-table-pagination-outer]:min-h-12"}
        >
          <Column
            title="TASK NAME"
            dataIndex="name"
            key="name"
            onCell={onCell}
          />
          <Column
            title="KIND"
            dataIndex="kind"
            key="kind"
            onCell={onCell}
            render={(x: TaskRecord["kind"]) => <Tag color={"cyan"}>{x}</Tag>}
          />
          <Column
            title="STATUS"
            dataIndex="status"
            key="status"
            onCell={onCell}
            render={(x: TaskRecord["status"]) => (
              <Tag color={statusTagMap[x].color}>{statusTagMap[x].text}</Tag>
            )}
          />
          <Column title="OWNER" dataIndex="owner" key="owner" onCell={onCell} />
          <Column
            title="CREATE TIME"
            dataIndex="create_time"
            key="create_time"
            onCell={onCell}
          />
          <Column
            title="UPDATE TIME"
            dataIndex="update_time"
            key="update_time"
            onCell={onCell}
          />
          <Column
            title="ACTIONS"
            key="actions"
            className={"w-36"}
            onCell={onCell}
            render={() => (
              <Space>
                <Button size={"small"} icon={<IconEyeOpenedStroked />} />
                <Button size={"small"} icon={<IconEditStroked />} />
                <Button size={"small"} icon={<IconDeleteStroked />} />
              </Space>
            )}
          />
        </Table>
      </div>
      <Modal
        visible={visible}
        onCancel={() => setVisible(false)}
        title={"Create Task"}
        size={"medium"}
        footerFill
      >
        <TaskForm />
      </Modal>
    </div>
  );
};

Component.displayName = "Task";

interface TaskFormData {
  name: string;
  kind: string;
  sql: string;
}

const TaskForm: FC = () => {
  return (
    <Form
      initValues={{} as TaskFormData}
      className={"h-full [&_.semi-form-section-text]:text-sm"}
      labelPosition={"inset"}
    >
      <Form.Section text={"Basic Info"}>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Input field={"name"} />
          </Col>
          <Col span={12}>
            <Form.Select field={"kind"} className={"w-full"}>
              <Option value={"spark"}>Spark</Option>
              <Option value={"flink"}>Flink</Option>
              <Option value={"mysql"}>MySQL</Option>
              <Option value={"starrocks"}>StarRocks</Option>
            </Form.Select>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Select field={"priority"} className={"w-full"}>
              <Option value={"high"}>High</Option>
              <Option value={"normal"}>Normal</Option>
              <Option value={"low"}>Low</Option>
            </Form.Select>
          </Col>
          <Col span={12}></Col>
        </Row>
      </Form.Section>
      <Form.Section text={"Task Config"}>
        <Form.TextArea
          field={"sql"}
          rows={6}
          placeholder={"SELECT * FROM table_name LIMIT 100"}
        />
        <Form.Input field={"cron"} placeholder={"0 */5 * * * ?"} />
      </Form.Section>
    </Form>
  );
};

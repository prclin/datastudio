import { FC, useState } from "react";
import {
  Button,
  Col,
  Empty,
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
import { ModalReactProps } from "@douyinfe/semi-ui/lib/es/modal";
import {
  IllustrationIdle,
  IllustrationIdleDark,
} from "@douyinfe/semi-illustrations";

const { Column } = Table;
const { Option } = Form.Select;

const data = [
  {
    key: 1,
    name: "Spark Prod",
    kind: "Spark SQL",
    endpoint: "thrift://prod-spark-cluster:10000",
    auth_mode: "Kerberos",
    catalog_support: true,
    last_sync: "2 mins ago",
    status: "healthy",
  },
  {
    key: 2,
    name: "Flink Dev",
    kind: "Flink SQL",
    endpoint: "http://dev-flink-gw:8083",
    auth_mode: "Basic",
    catalog_support: true,
    last_sync: "15 mins ago",
    status: "warning",
  },
  {
    key: 3,
    name: "MySQL Analytic",
    kind: "MySQL",
    endpoint: "jdbc:mysql://analytics-db:3306",
    auth_mode: "LDAP",
    catalog_support: false,
    last_sync: "1 hour ago",
    status: "healthy",
  },
  {
    key: 4,
    name: "StarRocks Cluster",
    kind: "StarRocks",
    endpoint: "jdbc:mysql://sr-fe-svc:9030",
    auth_mode: "Token",
    catalog_support: true,
    last_sync: "4 hours ago",
    status: "error",
  },
  {
    key: 5,
    name: "Legacy PG",
    kind: "PostgreSQL",
    endpoint: "jdbc:postgresql://oid-pg:5432",
    auth_mode: "Basic",
    catalog_support: false,
    last_sync: "2 days ago",
    status: "disabled",
  },
];

const statusTagMap: Record<
  string,
  { color: "green" | "yellow" | "red" | "grey"; text: string }
> = {
  healthy: { color: "green", text: "Healthy" },
  warning: { color: "yellow", text: "Warning" },
  error: { color: "red", text: "Error" },
  disabled: { color: "grey", text: "Disabled" },
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
            <FormattedMessage id={"views.engine-instance"} />
          </Typography.Title>
          <Typography.Text type={"secondary"}>
            <FormattedMessage id={"views.engine-instance.desc"} />
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
              Register Engine
            </Button>
          </Space>
        </Col>
      </Row>
      <Form
        layout={"horizontal"}
        labelPosition={"inset"}
        className={"first:[&_.semi-form-field-main>*]:bg-semi-color-bg-0"}
      >
        <Form.Input
          field="name"
          noLabel
          prefix={<IconSearch />}
          placeholder={"Search engines..."}
        />
        <Form.Select
          field="kind"
          label={"KIND"}
          className={"w-48"}
          placeholder={"ALL"}
          showClear
        >
          <Option value={"spark"}>Spark SQL</Option>
          <Option value={"flink"}>Flink SQL</Option>
          <Option value={"mysql"}>MySQL</Option>
        </Form.Select>
        <Form.Select
          field="status"
          label={"STATUS"}
          className={"w-48"}
          placeholder={"ALL"}
        >
          <Option value={"healthy"}>Healthy</Option>
          <Option value={"warning"}>Warning</Option>
          <Option value={"error"}>Error</Option>
          <Option value={"disabled"}>Disabled</Option>
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
          <Column title="NAME" dataIndex="name" key="name" onCell={onCell} />
          <Column title="kind" dataIndex="kind" key="kind" onCell={onCell} />
          <Column
            title="STATUS"
            dataIndex="status"
            key="status"
            onCell={onCell}
            render={x => (
              <Tag color={statusTagMap[`${x}`].color}>
                {statusTagMap[`${x}`].text}
              </Tag>
            )}
          />
          <Column
            title="ENDPOINT"
            dataIndex="endpoint"
            key="endpoint"
            onCell={onCell}
            render={text => (
              <Typography.Text ellipsis={{ rows: 1, showTooltip: true }}>
                {text}
              </Typography.Text>
            )}
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
      <CreationModal visible={visible} onCancel={() => setVisible(false)} />
    </div>
  );
};

Component.displayName = "EngineInstance";

interface FormData {
  kind: string;
}
const CreationModal: FC<ModalReactProps> = props => {
  return (
    <Modal {...props} title={"Register New Engine"} size={"medium"} footerFill>
      <Form
        initValues={{} as FormData}
        className={"h-full [&_.semi-form-section-text]:text-sm"}
        labelPosition={"inset"}
      >
        {({ values }) => (
          <>
            <Form.Section text={"Basic Info"}>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Input
                    field={"name"}
                    initValue={"引擎-1"}
                    size={"small"}
                  />
                </Col>
                <Col span={12}>
                  <Form.Select
                    field={"kind"}
                    size={"small"}
                    className={"w-full"}
                  >
                    <Option value={1}>spark</Option>
                    <Option value={2}>flink</Option>
                  </Form.Select>
                </Col>
              </Row>
              <Form.Input field={"description"} />
            </Form.Section>
            <Form.Section text={"Configuration"}>
              {values.kind ? (
                <>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Input field={"host"} />
                    </Col>
                    <Form.Input field={"port"} />
                    <Col span={12}></Col>
                  </Row>
                  <Form.Input field={"database"} />
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Input field={"username"} />
                    </Col>
                    <Col span={12}>
                      <Form.Input field={"password"} mode={"password"} />
                    </Col>
                  </Row>
                  <Typography.Text link underline>
                    Test Connection
                  </Typography.Text>
                </>
              ) : (
                <Empty
                  image={<IllustrationIdle />}
                  darkModeImage={<IllustrationIdleDark />}
                  description={"请先选择引擎"}
                />
              )}
            </Form.Section>
          </>
        )}
      </Form>
    </Modal>
  );
};

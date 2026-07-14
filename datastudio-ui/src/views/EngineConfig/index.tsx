import { FC, useState } from "react";
import {
  Button,
  Col,
  Form,
  Row,
  SideSheet,
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
  IconPulse,
  IconSearch,
} from "@douyinfe/semi-icons";
import { IconApacheSpark } from "@icons/IconApacheSpark.tsx";
import { IconApacheFlink } from "@icons/IconApacheFlink.tsx";
import { useTableResizeRef } from "@utils/hooks.tsx";
import { ConfigForm } from "@views/EngineConfig/config-form.tsx";

const { Column } = Table;
const { Option } = Form.Select;

const data = new Array(102).fill(0).map((_, index) => ({
  key: index,
  name: "spark cluster",
  kind: Math.floor(Math.random() * 100) % 2 === 0 ? "spark" : "flink",
  create_time: new Date().toLocaleString(),
  update_time: new Date().toLocaleString(),
}));
export const Component: FC = () => {
  const ref = useTableResizeRef<HTMLDivElement>();
  const onCell = () => ({ className: "py-3" });
  const [visible, setVisible] = useState(false);
  return (
    <div className={"h-full p-2 flex flex-col space-y-4 bg-semi-color-bg-0"}>
      <Row type="flex" justify="space-between" align="middle">
        <Col span={18}>
          <Typography.Title heading={3}>
            <FormattedMessage id={"views.engine-config"} />
          </Typography.Title>
          <Typography.Text type={"secondary"}>
            <FormattedMessage id={"views.engine-config.desc"} />
          </Typography.Text>
        </Col>
        <Col span={6}>
          <Space className={"w-full justify-end"}>
            <Button
              theme={"solid"}
              icon={<IconPlus />}
              onClick={() => setVisible(true)}
            >
              New Config
            </Button>
          </Space>
        </Col>
      </Row>
      <Form layout={"horizontal"} className={""} labelPosition={"inset"}>
        <Form.Input
          field="name"
          noLabel
          prefix={<IconSearch />}
          placeholder={"search by name..."}
        />
        <Form.Select
          field="kind"
          label={"KIND"}
          className={"w-48"}
          placeholder={"ALL"}
        >
          <Option value="flink">flink</Option>
          <Option value="spark">spark</Option>
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
          pagination={{
            showSizeChanger: true,
            popoverPosition: "topLeft",
            pageSize: 20,
          }}
          className={
            "[&_.semi-table-pagination-outer]:min-h-12 semi-light-scrollbar"
          }
        >
          <Column title="name" dataIndex="name" key="name" onCell={onCell} />
          <Column
            title="kind"
            dataIndex="kind"
            key="kind"
            onCell={onCell}
            render={x => (
              <Tag
                color={x === "spark" ? "red" : "purple"}
                prefixIcon={
                  x === "spark" ? <IconApacheSpark /> : <IconApacheFlink />
                }
              >
                {x}
              </Tag>
            )}
          />
          <Column
            title="create time"
            dataIndex="create_time"
            key="create_time"
            onCell={onCell}
          />
          <Column
            title="update time"
            dataIndex="update_time"
            key="update_time"
            onCell={onCell}
          />
          <Column
            title="actions"
            key="actions"
            className={"w-32"}
            onCell={onCell}
            render={() => (
              <Space>
                <Button size={"small"} icon={<IconPulse />} />
                <Button size={"small"} icon={<IconEyeOpenedStroked />} />
                <Button size={"small"} icon={<IconEditStroked />} />
                <Button size={"small"} icon={<IconDeleteStroked />} />
              </Space>
            )}
          />
        </Table>
      </div>
      <SideSheet
        title={"Register New Engine"}
        visible={visible}
        onCancel={() => setVisible(false)}
        className={
          "semi-light-scrollbar [&_.semi-sidesheet-body]:scrollbar-gutter-stable"
        }
      >
        <ConfigForm />
      </SideSheet>
    </div>
  );
};
Component.displayName = "ClusterConfig";

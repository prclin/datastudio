import { FC, useEffect, useRef } from "react";
import {
  Button,
  Col,
  Form,
  Row,
  Space,
  Table,
  Tag,
  Typography,
} from "@douyinfe/semi-ui-19";
import { FormattedMessage } from "react-intl";
import {
  IconDeleteStroked,
  IconEditStroked,
  IconPlus,
  IconSearch,
} from "@douyinfe/semi-icons";
import Column from "@douyinfe/semi-ui-19/lib/es/table/Column";
import { IconApacheSpark } from "@icons/IconApacheSpark.tsx";
import { IconApacheFlink } from "@icons/IconApacheFlink.tsx";

const { Option } = Form.Select;

const data = new Array(102).fill(0).map((_, index) => ({
  key: index,
  name: "spark cluster",
  kind: Math.floor(Math.random() * 100) % 2 === 0 ? "spark" : "flink",
  version: (Math.random() * 10).toFixed(1),
  create_time: new Date().toLocaleString(),
  update_time: new Date().toLocaleString(),
}));
export const Component: FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const observer = new ResizeObserver(entries => {
      const pagerHeight = ref
        .current!.querySelector(".semi-table-pagination-outer")!
        .getBoundingClientRect();
      const headerHeight = ref
        .current!.querySelector(".semi-table-header")!
        .getBoundingClientRect();
      const tableBody: HTMLElement =
        ref.current!.querySelector(".semi-table-body")!;
      tableBody.style.height =
        entries[0].contentRect.height -
        headerHeight.height -
        pagerHeight.height +
        "px";
    });

    if (ref.current) observer.observe(ref.current);

    return () => observer.disconnect();
  }, []);
  return (
    <div className={"h-full p-2 flex flex-col space-y-8"}>
      <Row type="flex" justify="space-between" align="middle">
        <Col span={18}>
          <Typography.Title heading={3}>
            <FormattedMessage id={"views.cluster-config"} />
          </Typography.Title>
          <Typography.Text type={"secondary"}>
            <FormattedMessage id={"views.cluster-config.desc"} />
          </Typography.Text>
        </Col>
        <Col span={6}>
          <Space className={"w-full justify-end"}>
            <Button theme={"outline"} type={"tertiary"}>
              Lunch Instance
            </Button>
            <Button theme={"solid"} icon={<IconPlus />}>
              New Config
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
          placeholder={"search by name..."}
        />
        <Form.Select
          field="kind"
          prefix={"KIND"}
          noLabel
          initValue={""}
          placeholder={"all"}
          className={"w-32"}
        >
          <Option value="flink">flink</Option>
          <Option value="spark">spark</Option>
        </Form.Select>
        <Button htmlType="reset">reset</Button>
      </Form>
      <div ref={ref} className={"flex-1 overflow-hidden"}>
        <Table
          sticky={true}
          dataSource={data}
          rowSelection={{}}
          onHeaderRow={() => ({
            className: "[&_.semi-table-row-head]:bg-semi-color-fill-1",
          })}
          pagination={{
            showSizeChanger: true,
            popoverPosition: "topLeft",
            pageSize: 20,
          }}
          className={"[&_.semi-table-pagination-outer]:min-h-12"}
        >
          <Column title="name" dataIndex="name" key="name" />
          <Column
            title="kind"
            dataIndex="kind"
            key="kind"
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
            title="version"
            dataIndex="version"
            key="version"
            render={text => <Tag>{text}</Tag>}
          />
          <Column
            title="create time"
            dataIndex="create_time"
            key="create_time"
          />
          <Column
            title="update time"
            dataIndex="update_time"
            key="update_time"
          />
          <Column
            title="actions"
            key="actions"
            className={"w-32"}
            render={() => (
              <Space>
                <Button size={"small"} icon={<IconEditStroked />} />
                <Button size={"small"} icon={<IconDeleteStroked />} />
              </Space>
            )}
          />
        </Table>
      </div>
    </div>
  );
};
Component.displayName = "ClusterConfig";

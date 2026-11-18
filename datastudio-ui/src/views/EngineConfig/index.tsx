import { FC, useState } from "react";
import {
  Button,
  Col,
  Form,
  Row,
  Space,
  Table,
  Typography,
} from "@douyinfe/semi-ui";
import { FormattedMessage } from "react-intl";
import {
  IconEyeOpenedStroked,
  IconPlus,
  IconSearch,
} from "@douyinfe/semi-icons";
import { useTableResizeRef } from "@utils/hooks.tsx";
import { formatDateTime } from "@utils/format.ts";
import {
  EngineConfigItem,
  EngineConfigPageQuery,
  EngineKind,
} from "@models/engine-config.ts";
import { useConfigPage } from "@services/engine-config.ts";
import { ConfigDetail } from "@views/EngineConfig/config-detail.tsx";
import { ConfigForm } from "@views/EngineConfig/config-form.tsx";
import { KindTag, kinds } from "@views/EngineConfig/kind.tsx";

const { Column } = Table;
const { Option } = Form.Select;

type Filter = Pick<EngineConfigPageQuery, "name" | "kind">;

export const Component: FC = () => {
  const ref = useTableResizeRef<HTMLDivElement>();
  const onCell = () => ({ className: "py-3" });
  const [query, setQuery] = useState<EngineConfigPageQuery>({
    page: 1,
    size: 20,
  });
  const [creating, setCreating] = useState(false);
  const [record, setRecord] = useState<EngineConfigItem>();
  const { data, isFetching } = useConfigPage(query);
  const { list = [], total = 0 } = data?.data ?? {};
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
              onClick={() => setCreating(true)}
            >
              New Config
            </Button>
          </Space>
        </Col>
      </Row>
      <Form<Filter>
        layout={"horizontal"}
        labelPosition={"inset"}
        onSubmit={filter => setQuery(pre => ({ ...pre, ...filter, page: 1 }))}
        onReset={() =>
          setQuery(pre => ({
            ...pre,
            name: undefined,
            kind: undefined,
            page: 1,
          }))
        }
      >
        <Form.Input
          field="name"
          noLabel
          prefix={<IconSearch />}
          placeholder={"search by name..."}
          showClear
        />
        <Form.Select
          field="kind"
          label={"KIND"}
          className={"w-48"}
          placeholder={"ALL"}
          showClear
        >
          {kinds.map(({ value, label }) => (
            <Option key={value} value={value}>
              {label}
            </Option>
          ))}
        </Form.Select>
        <Space>
          <Button htmlType={"submit"}>提交</Button>
          <Button htmlType={"reset"}>重置</Button>
        </Space>
      </Form>
      <div ref={ref} className={"flex-1 overflow-hidden"}>
        <Table<EngineConfigItem>
          sticky={true}
          rowKey={"id"}
          loading={isFetching}
          dataSource={list}
          pagination={{
            showSizeChanger: true,
            popoverPosition: "topLeft",
            currentPage: query.page,
            pageSize: query.size,
            total,
            onChange: (page, size) => setQuery(pre => ({ ...pre, page, size })),
          }}
          className={
            "[&_.semi-table-pagination-outer]:min-h-12 semi-light-scrollbar"
          }
        >
          <Column title="NAME" dataIndex="name" onCell={onCell} />
          <Column
            title="KIND"
            dataIndex="kind"
            onCell={onCell}
            render={(kind: EngineKind) => <KindTag kind={kind} />}
          />
          <Column
            title="DST FS"
            dataIndex="dstFs"
            onCell={onCell}
            render={(dstFs?: string) => (
              <Typography.Text ellipsis={{ rows: 1, showTooltip: true }}>
                {dstFs || "-"}
              </Typography.Text>
            )}
          />
          <Column
            title="CONFIGS"
            dataIndex="configs"
            onCell={onCell}
            render={(configs?: Record<string, string>) =>
              Object.keys(configs ?? {}).length
            }
          />
          <Column
            title="CREATE TIME"
            dataIndex="createTime"
            onCell={onCell}
            render={(time?: string) => formatDateTime(time)}
          />
          <Column
            title="UPDATE TIME"
            dataIndex="updateTime"
            onCell={onCell}
            render={(time?: string) => formatDateTime(time)}
          />
          <Column<EngineConfigItem>
            title="ACTIONS"
            className={"w-36"}
            onCell={onCell}
            render={(_, item) => (
              <Button
                size={"small"}
                icon={<IconEyeOpenedStroked />}
                onClick={() => setRecord(item)}
              />
            )}
          />
        </Table>
      </div>
      <ConfigForm visible={creating} onClose={() => setCreating(false)} />
      <ConfigDetail record={record} onClose={() => setRecord(undefined)} />
    </div>
  );
};
Component.displayName = "ClusterConfig";

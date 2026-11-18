import { FC, useState } from "react";
import { Button, Form, Space, Table, Typography } from "@douyinfe/semi-ui";
import { IconPlus, IconSearch } from "@douyinfe/semi-icons";
import { useTableResizeRef } from "@utils/hooks.tsx";
import { useGlobal } from "@utils/context.tsx";
import { formatDateTime } from "@utils/format.ts";
import {
  EngineConfigItem,
  EngineConfigPageQuery,
  EngineKind,
} from "@models/engine-config.ts";
import { useConfigPage } from "@services/engine-config.ts";
import { ConfigForm } from "@views/Runtime/EngineConfig/config-form.tsx";
import { kinds, KindTag } from "@views/Runtime/EngineConfig/kind.tsx";

const { Column } = Table;
const { Option } = Form.Select;

type Filter = Pick<EngineConfigPageQuery, "name" | "kind">;

export const Component: FC = () => {
  const ref = useTableResizeRef<HTMLDivElement>();
  const { navigate } = useGlobal();
  const onCell = () => ({ className: "py-3" });
  const [query, setQuery] = useState<EngineConfigPageQuery>({
    page: 1,
    size: 20,
  });
  const [creating, setCreating] = useState(false);
  const { data, isFetching } = useConfigPage(query);
  const { list = [], total = 0 } = data?.data ?? {};
  return (
    <div className={"h-full flex flex-col space-y-4"}>
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
        <Button
          theme={"solid"}
          icon={<IconPlus />}
          className={"ms-auto self-center"}
          onClick={() => setCreating(true)}
        >
          New Config
        </Button>
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
          <Column
            title="NAME"
            dataIndex="name"
            onCell={onCell}
            render={(name: string, { id }: EngineConfigItem) => {
              const path = `/runtime/engine-config/${id}`;
              return (
                <Typography.Text
                  link={{
                    href: path,
                    onClick: e => {
                      //交给 SPA 路由跳转,避免整页刷新
                      e.preventDefault();
                      void navigate(path);
                    },
                  }}
                >
                  {name}
                </Typography.Text>
              );
            }}
          />
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
        </Table>
      </div>
      <ConfigForm visible={creating} onClose={() => setCreating(false)} />
    </div>
  );
};
Component.displayName = "ClusterConfig";

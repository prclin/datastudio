import { FC, useState } from "react";
import { useParams } from "react-router";
import {
  Button,
  Descriptions,
  Empty,
  Row,
  Space,
  Table,
  Tabs,
  Typography,
} from "@douyinfe/semi-ui";
import { IconEditStroked } from "@douyinfe/semi-icons";
import {
  IllustrationIdle,
  IllustrationIdleDark,
} from "@douyinfe/semi-illustrations";
import { useConfig } from "@services/engine-config.ts";
import { useGlobal } from "@utils/context.tsx";
import { formatDateTime } from "@utils/format.ts";
import { ConfigArtifacts } from "@views/Runtime/EngineConfig/Detail/artifacts.tsx";
import { ConfigEditor } from "@views/Runtime/EngineConfig/Detail/editor.tsx";
import { KindTag } from "@views/Runtime/EngineConfig/kind.tsx";
import { draftConfigs } from "@views/Runtime/EngineConfig/configs.tsx";

const { TabPane } = Tabs;
const { Column } = Table;

export const Component: FC = () => {
  const { id = "" } = useParams();
  const { navigate } = useGlobal();
  const [editing, setEditing] = useState(false);
  const { data, isLoading, isFetching } = useConfig(id);
  const record = data?.data;
  const configs = draftConfigs(record?.configs);

  return (
    <div className={"h-full p-2 flex flex-col space-y-4 bg-semi-color-bg-0"}>
      <Row type="flex" justify="space-between" align="middle">
        <Space align="center">
          <Typography.Title heading={3} className={"m-0"}>
            {record?.name}
          </Typography.Title>
          {record && <KindTag kind={record.kind} />}
        </Space>
        <Space>
          {!editing && (
            <Button
              theme={"solid"}
              icon={<IconEditStroked />}
              disabled={!record}
              onClick={() => setEditing(true)}
            >
              Edit
            </Button>
          )}
          {/*编辑中离开会丢弃未提交的改动*/}
          <Button
            type={"tertiary"}
            disabled={editing}
            onClick={() => void navigate("/runtime/engine-config")}
          >
            Back
          </Button>
        </Space>
      </Row>
      {record ? (
        <Tabs type={"line"}>
          <TabPane tab={"Overview"} itemKey={"overview"}>
            {editing ? (
              <ConfigEditor record={record} onExit={() => setEditing(false)} />
            ) : (
              <div className={"py-4"}>
                <Descriptions
                  align={"left"}
                  column={1}
                  data={[
                    {
                      key: "ID",
                      value: (
                        <Typography.Text copyable={{ content: record.id }}>
                          {record.id}
                        </Typography.Text>
                      ),
                    },
                    { key: "Kind", value: <KindTag kind={record.kind} /> },
                    { key: "Target FS", value: record.dstFs || "-" },
                    {
                      key: "Create time",
                      value: formatDateTime(record.createTime),
                    },
                    {
                      key: "Update time",
                      value: formatDateTime(record.updateTime),
                    },
                  ]}
                />
                <Typography.Title heading={6} className={"mt-6"}>
                  Configs
                </Typography.Title>
                {configs.length ? (
                  <Table
                    size={"small"}
                    rowKey={"key"}
                    pagination={false}
                    loading={isFetching}
                    dataSource={configs}
                  >
                    <Column title="KEY" dataIndex="key" />
                    <Column title="VALUE" dataIndex="value" />
                  </Table>
                ) : (
                  <Typography.Text type={"tertiary"}>
                    No config item
                  </Typography.Text>
                )}
              </div>
            )}
          </TabPane>
          <TabPane tab={"Artifacts"} itemKey={"artifacts"}>
            <div className={"py-4"}>
              <ConfigArtifacts record={record} />
            </div>
          </TabPane>
        </Tabs>
      ) : (
        !isLoading && (
          <Empty
            image={<IllustrationIdle />}
            darkModeImage={<IllustrationIdleDark />}
            title={"Engine config not found"}
            description={`id ${id} is not readable`}
          />
        )
      )}
    </div>
  );
};
Component.displayName = "EngineConfigDetail";

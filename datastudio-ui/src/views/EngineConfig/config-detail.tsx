import { FC } from "react";
import {
  Button,
  Descriptions,
  Form,
  SideSheet,
  Space,
  Typography,
} from "@douyinfe/semi-ui";
import { FormattedMessage } from "react-intl";
import { useQueryClient } from "@tanstack/react-query";
import { EngineConfigItem } from "@models/engine-config.ts";
import { configPageKey, useUpdateConfig } from "@services/engine-config.ts";
import { isOk } from "@services/common.ts";
import { formatDateTime } from "@utils/format.ts";
import { ConfigArtifacts } from "@views/EngineConfig/config-artifacts.tsx";
import {
  ConfigDraft,
  ConfigRows,
  draftConfigs,
  toConfigs,
} from "@views/EngineConfig/configs.tsx";
import { KindTag } from "@views/EngineConfig/kind.tsx";

export const ConfigDetail: FC<{
  record?: EngineConfigItem;
  onClose: () => void;
}> = ({ record, onClose }) => {
  const queryClient = useQueryClient();
  const update = useUpdateConfig();

  return (
    <SideSheet
      visible={!!record}
      onCancel={onClose}
      title={<FormattedMessage id={"views.engine-config.detail.title"} />}
      width={560}
      footer={null}
      className={
        "semi-light-scrollbar [&_.semi-sidesheet-body]:scrollbar-gutter-stable"
      }
    >
      {record && (
        <Form<ConfigDraft>
          key={record.id}
          labelPosition={"inset"}
          initValues={{
            name: record.name,
            configs: draftConfigs(record.configs),
          }}
          className={"[&_.semi-form-section-text]:text-sm"}
          onSubmit={({ name, configs }) =>
            update.mutate(
              { id: record.id, name, configs: toConfigs(configs) },
              {
                onSuccess: async res => {
                  if (!isOk(res)) return;
                  await queryClient.invalidateQueries({
                    queryKey: [configPageKey],
                  });
                  onClose();
                },
              },
            )
          }
        >
          <Descriptions
            align={"left"}
            column={1}
            data={[
              { key: "Kind", value: <KindTag kind={record.kind} /> },
              { key: "Target FS", value: record.dstFs || "-" },
              { key: "Create time", value: formatDateTime(record.createTime) },
              { key: "Update time", value: formatDateTime(record.updateTime) },
              {
                key: "ID",
                value: (
                  <Typography.Text copyable={{ content: record.id }}>
                    {record.id}
                  </Typography.Text>
                ),
              },
            ]}
          />
          <Form.Section text={"Basic Info"}>
            <Form.Input
              field={"name"}
              label={"Config Name"}
              rules={[{ required: true }]}
            />
          </Form.Section>
          <Form.Section text={"Configs"}>
            <ConfigRows />
          </Form.Section>
          <ConfigArtifacts record={record} />
          <Space className={"mt-6"}>
            <Button
              theme={"solid"}
              htmlType={"submit"}
              loading={update.isPending}
            >
              Submit
            </Button>
            <Button type={"tertiary"} htmlType={"button"} onClick={onClose}>
              Cancel
            </Button>
          </Space>
        </Form>
      )}
    </SideSheet>
  );
};

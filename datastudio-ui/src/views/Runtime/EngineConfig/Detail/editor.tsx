import { FC } from "react";
import { Button, Form, Space } from "@douyinfe/semi-ui";
import { useQueryClient } from "@tanstack/react-query";
import { EngineConfigItem } from "@models/engine-config.ts";
import {
  configKey,
  configPageKey,
  useUpdateConfig,
} from "@services/engine-config.ts";
import { isOk } from "@services/common.ts";
import {
  ConfigDraft,
  ConfigRows,
  draftConfigs,
  toConfigs,
} from "@views/Runtime/EngineConfig/configs.tsx";

/** 后端只允许改名称与配置项,其余字段在详情页保持只读 */
export const ConfigEditor: FC<{
  record: EngineConfigItem;
  onExit: () => void;
}> = ({ record, onExit }) => {
  const queryClient = useQueryClient();
  const update = useUpdateConfig();

  return (
    <Form<ConfigDraft>
      labelPosition={"inset"}
      initValues={{
        name: record.name,
        configs: draftConfigs(record.configs),
      }}
      className={"py-4 [&_.semi-form-section-text]:text-sm"}
      onSubmit={({ name, configs }) =>
        update.mutate(
          { id: record.id, name, configs: toConfigs(configs) },
          {
            onSuccess: async res => {
              if (!isOk(res)) return;
              await queryClient.invalidateQueries({
                queryKey: [configPageKey],
              });
              //列表与详情各自按 key 取数,提交成功后都要重新拉
              await queryClient.invalidateQueries({
                queryKey: [configKey, record.id],
              });
              onExit();
            },
          },
        )
      }
    >
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
      <Space className={"mt-6"}>
        <Button theme={"solid"} htmlType={"submit"} loading={update.isPending}>
          Submit
        </Button>
        <Button type={"tertiary"} htmlType={"button"} onClick={onExit}>
          Cancel
        </Button>
      </Space>
    </Form>
  );
};

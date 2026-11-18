import { FC } from "react";
import { Button, Col, Form, Row, SideSheet, Space } from "@douyinfe/semi-ui";
import { FormattedMessage } from "react-intl";
import { useQueryClient } from "@tanstack/react-query";
import {
  configPageKey,
  useFileSystems,
  useNewConfig,
} from "@services/engine-config.ts";
import { isOk } from "@services/common.ts";
import {
  ConfigRows,
  CreateDraft,
  toConfigs,
} from "@views/Runtime/EngineConfig/configs.tsx";
import { kinds } from "@views/Runtime/EngineConfig/kind.tsx";

const { Option } = Form.Select;

export const ConfigForm: FC<{ visible: boolean; onClose: () => void }> = ({
  visible,
  onClose,
}) => {
  const queryClient = useQueryClient();
  const { data: fileSystems, isPending } = useFileSystems();
  const mutation = useNewConfig({
    onSuccess: async res => {
      if (!isOk(res)) return;
      await queryClient.invalidateQueries({ queryKey: [configPageKey] });
      onClose();
    },
  });
  return (
    <SideSheet
      visible={visible}
      onCancel={onClose}
      title={
        <FormattedMessage id={"views.runtime.engine-config.creation.title"} />
      }
      width={560}
      footer={null}
      className={
        "semi-light-scrollbar [&_.semi-sidesheet-body]:scrollbar-gutter-stable"
      }
    >
      <Form<CreateDraft>
        labelPosition={"inset"}
        initValues={{ name: "", kind: 0 }}
        className={"[&_.semi-form-section-text]:text-sm"}
        onSubmit={({ configs, ...command }) =>
          mutation.mutate({ ...command, configs: toConfigs(configs) })
        }
      >
        <Form.Section text={"Basic Info"}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Input
                field={"name"}
                label={"Config Name"}
                rules={[{ required: true }]}
              />
            </Col>
            <Col span={12}>
              <Form.Select
                field={"dstFs"}
                label={"Target FS"}
                loading={isPending}
              >
                {fileSystems?.data?.map(fs => (
                  <Option key={fs} value={fs}>
                    {fs}
                  </Option>
                ))}
              </Form.Select>
            </Col>
          </Row>
          <Form.RadioGroup field={"kind"} label={"Kind"}>
            {kinds.map(({ value, label }) => (
              <Form.Radio key={value} value={value}>
                {label}
              </Form.Radio>
            ))}
          </Form.RadioGroup>
        </Form.Section>
        <Form.Section text={"Configs"}>
          <ConfigRows />
        </Form.Section>
        <Space className={"mt-6"}>
          <Button
            theme={"solid"}
            htmlType={"submit"}
            loading={mutation.isPending}
          >
            Submit
          </Button>
          <Button type={"tertiary"} htmlType={"button"} onClick={onClose}>
            Cancel
          </Button>
        </Space>
      </Form>
    </SideSheet>
  );
};

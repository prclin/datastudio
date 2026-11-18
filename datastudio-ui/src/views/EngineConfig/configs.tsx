import { FC } from "react";
import { ArrayField, Button, Col, Form, Row } from "@douyinfe/semi-ui";
import { IconMinusCircle, IconPlus } from "@douyinfe/semi-icons";
import {
  CreateConfigCommand,
  UpdateConfigCommand,
} from "@models/engine-config.ts";

/** configs 在表格里以键值行编辑,提交前收敛成 jsonb 对象 */
export type ConfigRow = { key?: string; value?: string };

/** 后端只允许改 name 与 configs,创建在此基础上补 kind/dstFs */
export type ConfigDraft = Pick<UpdateConfigCommand, "name"> & {
  configs?: ConfigRow[];
};

export type CreateDraft = Omit<CreateConfigCommand, "configs"> & ConfigDraft;

/** 无 key 的空行只用于输入,不写入配置 */
export const toConfigs = (rows?: ConfigRow[]) =>
  (rows ?? []).reduce<Record<string, string>>(
    (configs, { key, value }) =>
      key ? { ...configs, [key]: value ?? "" } : configs,
    {},
  );

/** jsonb 对象展开成键值行,供表单回填 */
export const draftConfigs = (configs?: Record<string, string>) =>
  Object.entries(configs ?? {}).map(([key, value]) => ({ key, value }));

/** 键值行编辑器,创建抽屉与详情抽屉共用 */
export const ConfigRows: FC = () => (
  <ArrayField field={"configs"}>
    {({ add, arrayFields }) => (
      <>
        {arrayFields.map(({ field, key, remove }) => (
          <Row gutter={8} key={key} type={"flex"} align={"middle"}>
            <Col span={10}>
              <Form.Input noLabel field={`${field}[key]`} placeholder={"key"} />
            </Col>
            <Col span={10}>
              <Form.Input
                noLabel
                field={`${field}[value]`}
                placeholder={"value"}
              />
            </Col>
            <Col span={4}>
              <Button
                theme={"borderless"}
                type={"danger"}
                icon={<IconMinusCircle />}
                onClick={remove}
              />
            </Col>
          </Row>
        ))}
        <Button
          className={"mt-1"}
          block
          icon={<IconPlus />}
          onClick={() => add()}
        >
          Add config
        </Button>
      </>
    )}
  </ArrayField>
);

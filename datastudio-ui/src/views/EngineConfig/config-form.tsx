import { FC } from "react";
import {
  ArrayField,
  Button,
  Col,
  Form,
  Row,
  SideSheet,
  Space,
  Typography,
} from "@douyinfe/semi-ui";
import { IconMinusCircle, IconPlusCircle } from "@douyinfe/semi-icons";
import { CreateConfigCommand } from "@models/engine-config.ts";
import { useNewConfig } from "@services/engine-config.ts";
import { FileItem } from "@douyinfe/semi-ui/lib/es/upload";
import { SideSheetReactProps } from "@douyinfe/semi-ui/lib/es/sideSheet";

const { Option } = Form.Select;
const { Section } = Form;
export const ConfigForm: FC<SideSheetReactProps> = props => {
  const mutation = useNewConfig();
  return (
    <SideSheet
      {...props}
      title={"Register New Engine"}
      className={
        "semi-light-scrollbar [&_.semi-sidesheet-body]:scrollbar-gutter-stable"
      }
      footer={
        <Space className={"mt-auto mb-2"}>
          <Button htmlType={"submit"}>submit</Button>
          <Button htmlType={"reset"} type={"warning"}>
            reset
          </Button>
          <Button type={"tertiary"}>cancel</Button>
        </Space>
      }
    >
      <Form
        initValues={
          {} as Omit<CreateConfigCommand, "configs" | "artifacts"> & {
            configs?: { key: string; value: string }[];
            artifacts?: FileItem[];
          }
        }
        className={"[&_.semi-form-section-text]:text-sm h-full flex flex-col"}
        labelPosition={"inset"}
        onSubmit={values => {
          const configs = values.configs
            ?.map(x => ({ [x.key]: x.value }))
            .reduce((x, y) => ({ ...x, ...y }));
          const artifacts = values.artifacts?.map(
            artifact => artifact.fileInstance!,
          );
          console.log(values);
          mutation.mutate({
            ...values,
            configs: JSON.stringify(configs),
            artifacts,
          });
        }}
      >
        <Section text={"Basic Info"}>
          <Form.Input field={"name"} label={"Config Name"} />
          <Form.Select
            field={"kind"}
            label={"Kind"}
            className={"w-full"}
            showClear
            initValue={"0"}
          >
            <Option value={"0"}>spark</Option>
            <Option value={"1"}>flink</Option>
          </Form.Select>
        </Section>
        <Section text={"Configs"}>
          <div className={"overflow-y-auto max-h-42 scrollbar-gutter-stable"}>
            <ArrayField field={"configs"}>
              {({ add, arrayFields }) => {
                if (arrayFields.length == 0)
                  return (
                    <Button onClick={() => add()} block>
                      添加
                    </Button>
                  );
                return (
                  <>
                    {arrayFields.map(({ field, key, remove }) => (
                      <Row
                        className={"w-full"}
                        gutter={8}
                        key={key}
                        type={"flex"}
                        align={"middle"}
                        justify={"end"}
                      >
                        <Col span={10}>
                          <Form.Input noLabel field={`${field}[key]`} />
                        </Col>
                        <Col span={9}>
                          <Form.Input noLabel field={`${field}[value]`} />
                        </Col>
                        <Col span={5}>
                          <Button
                            theme="borderless"
                            icon={<IconPlusCircle />}
                            onClick={() => add()}
                          />
                          <Button
                            type="danger"
                            theme="borderless"
                            icon={<IconMinusCircle />}
                            onClick={remove}
                          />
                        </Col>
                      </Row>
                    ))}
                  </>
                );
              }}
            </ArrayField>
          </div>
        </Section>
        <Section text="Artifacts">
          <Typography.Text type={"tertiary"}>
            Upload required JAR files and configuration bundles for executor
            nodes.
          </Typography.Text>
          <Form.Upload
            noLabel
            directory
            draggable
            action={""}
            field={"artifacts"}
            uploadTrigger="custom"
            dragMainText={"点击上传文件或拖拽文件到这里"}
            className={
              "[&_.semi-upload-file-list-main]:overflow-auto [&_.semi-upload-file-list-main]:max-h-44 [&_.semi-upload-file-card]:w-full"
            }
          />
        </Section>
      </Form>
    </SideSheet>
  );
};

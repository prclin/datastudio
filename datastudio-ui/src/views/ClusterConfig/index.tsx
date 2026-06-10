import { FC, useEffect, useRef, useState } from "react";
import {
  ArrayField,
  Button,
  Col,
  Form,
  Modal,
  Row,
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
  IconMinusCircle,
  IconPlus,
  IconPlusCircle,
  IconPulse,
  IconSearch,
} from "@douyinfe/semi-icons";
import { IconApacheSpark } from "@icons/IconApacheSpark.tsx";
import { IconApacheFlink } from "@icons/IconApacheFlink.tsx";
import { useTableResizeRef } from "@utils/hooks.tsx";

const { Column } = Table;
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
  const ref = useTableResizeRef<HTMLDivElement>();
  const onCell = () => ({ className: "py-3" });
  const [visible, setVisible] = useState(false);
  return (
    <div className={"h-full p-2 flex flex-col space-y-4 bg-semi-color-bg-0"}>
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
            title="version"
            dataIndex="version"
            key="version"
            onCell={onCell}
            render={text => <Tag>{text}</Tag>}
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
      <Modal
        footerFill
        title={"Register New Engine"}
        size={"large"}
        className={
          "[&_.semi-modal-body]:h-120 [&_.semi-modal-body]:overflow-hidden"
        }
        visible={visible}
        onCancel={() => setVisible(false)}
      >
        <ConfigForm />
      </Modal>
    </div>
  );
};
Component.displayName = "ClusterConfig";

const { Section } = Form;
const ConfigForm: FC = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const setConfigsHeight = (containerHeight: number) => {
      const config: HTMLElement = ref.current!.querySelector(
        ".cluster-config-list",
      )!;
      const configContainer = window.getComputedStyle(
        ref.current!.querySelector(".cluster-config-list-container")!,
      );
      const basic = ref
        .current!.querySelector(".cluster-config-basic")!
        .getBoundingClientRect();
      const title = ref
        .current!.querySelector(".semi-form-section-text")!
        .getBoundingClientRect();

      config.style.maxHeight =
        containerHeight -
        basic.height -
        Number(configContainer.marginTop.replace("px", "")) -
        Number(configContainer.paddingTop.replace("px", "")) -
        Number(configContainer.paddingBottom.replace("px", "")) -
        title.height +
        "px";
    };

    const setFileListHeight = (containerHeight: number) => {
      const fileList: HTMLElement = ref.current!.querySelector(
        ".semi-upload-file-list-main",
      )!;
      if (fileList == null) return;

      const filesContainer = ref.current!.querySelector(
        ".cluster-config-artifacts",
      )!;
      const header = filesContainer
        .querySelector(".semi-form-section-text")!
        .getBoundingClientRect();
      const desc = filesContainer
        .querySelector(".semi-typography")!
        .getBoundingClientRect();
      const fieldCss = window.getComputedStyle(
        filesContainer.querySelector(".semi-form-field")!,
      );
      const drag = filesContainer
        .querySelector(".semi-upload-drag-area")!
        .getBoundingClientRect();
      const filesTitle = filesContainer
        .querySelector(".semi-upload-file-list-title")!
        .getBoundingClientRect();

      fileList.style.maxHeight =
        containerHeight -
        header.height -
        desc.height -
        Number(fieldCss.paddingTop.replace("px", "")) -
        Number(fieldCss.paddingBottom.replace("px", "")) -
        drag.height -
        filesTitle.height +
        "px";
    };

    const observer = new ResizeObserver(entries => {
      setConfigsHeight(entries[0].contentRect.height);
      setFileListHeight(entries[0].contentRect.height);
    });
    const mutationObserver = new MutationObserver(() => {
      const fileList: HTMLElement = ref.current!.querySelector(
        ".semi-upload-file-list-main",
      )!;

      if (
        fileList == null ||
        window.getComputedStyle(fileList).maxHeight !== "none"
      )
        return;

      setFileListHeight(ref.current!.getBoundingClientRect().height);
    });
    if (ref.current) {
      observer.observe(ref.current);
      mutationObserver.observe(ref.current, { childList: true, subtree: true });
    }

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, []);
  return (
    <div ref={ref} className={"h-full overflow-hidden"}>
      <Form
        initValues={{} as FormData}
        className={"[&_.semi-form-section-text]:text-sm h-full"}
        labelPosition={"inset"}
      >
        <Row gutter={16} className={"h-full [&_.semi-col]:h-full"}>
          <Col span={16} className={"flex flex-col space-y-8"}>
            <Section text={"Basic Info"} className={"cluster-config-basic"}>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Input field={"name"} label={"Config Name"} />
                </Col>
                <Col span={12}>
                  <Form.Select
                    field={"kind"}
                    label={"Kind"}
                    className={"w-full"}
                    showClear
                    initValue={"spark"}
                  >
                    <Option value={"spark"}>spark</Option>
                    <Option value={"flink"}>flink</Option>
                  </Form.Select>
                </Col>
              </Row>
            </Section>
            <Section
              text={"Configs"}
              className={"cluster-config-list-container"}
            >
              <div className={"cluster-config-list overflow-y-auto"}>
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
                            gutter={16}
                            key={key}
                            type={"flex"}
                            align={"middle"}
                          >
                            <Col span={10}>
                              <Form.Input noLabel field={`${field}[key]`} />
                            </Col>
                            <Col span={10}>
                              <Form.Input noLabel field={`${field}[value]`} />
                            </Col>
                            <Col span={4}>
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
          </Col>
          <Col span={8}>
            <Section text="Artifacts" className={"cluster-config-artifacts"}>
              <Typography.Text type={"tertiary"}>
                Upload required JAR files and configuration bundles for executor
                nodes.
              </Typography.Text>
              <Form.RadioGroup
                field={"storage_type"}
                initValue={"1"}
                noLabel
                extraText={"where artifacts stored in"}
              >
                <Form.Radio value={"1"}>local</Form.Radio>
                <Form.Radio value={"2"}>s3</Form.Radio>
                <Form.Radio value={"3"}>hdfs</Form.Radio>
              </Form.RadioGroup>
              <Form.Upload
                noLabel
                directory
                draggable
                action={""}
                field={"files"}
                uploadTrigger="custom"
                dragMainText={"点击上传文件或拖拽文件到这里"}
                className={
                  "[&_.semi-upload-file-list-main]:justify-between [&_.semi-upload-file-list-main]:overflow-auto"
                }
              />
            </Section>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

import { FC, useEffect, useRef } from "react";
import {
  ArrayField,
  Button,
  Col,
  Form,
  Row,
  Typography,
} from "@douyinfe/semi-ui";
import { useGlobal } from "@utils/context.tsx";
import Option from "@douyinfe/semi-ui/lib/es/select/option";
import { withDefaultProps } from "@utils/component.tsx";
import { IconMinusCircle, IconPlusCircle } from "@douyinfe/semi-icons";

const Section = withDefaultProps(Form.Section, {
  className: "bg-semi-color-bg-0 p-4",
});

export const Component: FC = () => {
  const { msg } = useGlobal();
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
      const filesCss = window.getComputedStyle(filesContainer);
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
        Number(filesCss.paddingTop.replace("px", "")) -
        Number(filesCss.paddingBottom.replace("px", "")) -
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
    <div className={"h-full p-2 flex flex-col space-y-8"}>
      <Typography>
        <Typography.Title heading={3}>
          {msg("views.cluster-config.creation.title")}
        </Typography.Title>
        <Typography.Text type={"secondary"}>
          Configure your computational resources for data processing pipelines.
        </Typography.Text>
      </Typography>
      <div ref={ref} className={"flex-1 overflow-hidden"}>
        <Form>
          <Row gutter={16} className={"h-full [&_.semi-col]:h-full"}>
            <Col span={15} className={"flex flex-col space-y-8"}>
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
                              <Col span={11}>
                                <Form.Input noLabel field={`${field}[key]`} />
                              </Col>
                              <Col span={11}>
                                <Form.Input noLabel field={`${field}[value]`} />
                              </Col>
                              <Col span={2}>
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
            <Col span={9}>
              <Section text="Artifacts" className={"cluster-config-artifacts"}>
                <Typography.Text type={"tertiary"}>
                  Upload required JAR files and configuration bundles for
                  executor nodes.
                </Typography.Text>
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
    </div>
  );
};
Component.displayName = "Creation";

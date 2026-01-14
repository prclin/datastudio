import { FC, RefObject, useRef, useState } from "react";
import {
  ArrayField,
  Button,
  Dropdown,
  Form,
  Space,
} from "@douyinfe/semi-ui-19";
import Section from "@douyinfe/semi-ui-19/lib/es/form/section";
import { IconClose, IconFilterStroked } from "@douyinfe/semi-icons";
import { OptionProps } from "@douyinfe/semi-ui-19/lib/es/select";

export const TaskFilter: FC = () => {
  const form = useRef<Form>(undefined);
  return (
    <Dropdown
      keepDOM
      trigger="click"
      render={
        <Form className={"w-176 p-5"} ref={form as RefObject<Form>}>
          <ArrayField field={"conditions"}>
            {({ arrayFields, add }) => {
              return (
                <Space vertical={true} align={"start"} className={"w-full"}>
                  <Section
                    text={
                      <div className={"flex justify-between"}>
                        <span className={"text-sm font-normal"}>筛选</span>
                        <Button
                          theme={"borderless"}
                          type={"tertiary"}
                          size={"small"}
                          contentClassName={"text-xs font-normal"}
                        >
                          清空
                        </Button>
                      </div>
                    }
                  >
                    {arrayFields.map(({ key, field, remove }) => {
                      return (
                        <FilterItem remove={remove} field={field} key={key} />
                      );
                    })}
                  </Section>
                  <Button
                    theme={"outline"}
                    type={"tertiary"}
                    onClick={() => add()}
                    contentClassName={"font-normal text-semi-color-text-0"}
                  >
                    添加条件
                  </Button>
                </Space>
              );
            }}
          </ArrayField>
        </Form>
      }
    >
      <div>
        <Button
          theme={"borderless"}
          type={"tertiary"}
          icon={<IconFilterStroked />}
          size={"small"}
          contentClassName={"text-xs font-normal"}
        >
          筛选
        </Button>
      </div>
    </Dropdown>
  );
};

const conditions = [
  {
    title: "executor",
    operators: ["in", "not in", "is null", "in not null"],
    type: "select",
  },
  {
    title: "start_time",
    operators: ["=", "<", ">", "between", "is null", "in not null"],
    type: "time",
  },
  {
    title: "deadline",
    operators: ["=", "<", ">", "between", "is null", "in not null"],
    type: "time",
  },
  {
    title: "completion_time",
    operators: ["=", "<", ">", "between", "is null", "in not null"],
    type: "time",
  },
  {
    title: "assignee",
    operators: ["in", "not in", "is null", "in not null"],
    type: "select",
  },
  {
    title: "followers",
    operators: ["in", "not in", "is null", "in not null"],
    type: "select",
  },
  {
    title: "creator",
    operators: ["in", "not in", "is null", "in not null"],
    type: "select",
  },
  {
    title: "source",
    operators: ["in", "not in"],
    type: "select",
  },
  {
    title: "source_kind",
    operators: ["in", "not in"],
    type: "select",
  },
  {
    title: "creation_time",
    operators: ["=", "<", ">", "between"],
    type: "time",
  },
  {
    title: "update_time",
    operators: ["=", "<", ">", "between"],
    type: "time",
  },
];

const titles = conditions.map(x => ({ label: x.title, value: x.title }));
interface FilterItemProps {
  field: string;
  remove: () => void;
}
const FilterItem: FC<FilterItemProps> = ({ field, remove }) => {
  const [fieldValue, setFieldValue] = useState<string>();
  const condition = conditions.find(x => x.title == fieldValue);
  const operatorOptions = condition?.operators.map(
    x => ({ label: x, value: x }) as OptionProps,
  );
  const kind = condition?.type;
  const defaultOperator = operatorOptions && operatorOptions[0].value;
  const [operator, setOperator] = useState(defaultOperator);
  return (
    <div className={"flex items-center space-x-2"}>
      <span>当</span>
      <div>
        <Form.Select
          noLabel
          field={`${field}.field`}
          defaultOpen
          defaultActiveFirstOption
          className={"w-44"}
          zIndex={1060}
          optionList={titles}
          onChange={value => setFieldValue(value as string)}
        />
      </div>
      <div className={"flex-1 flex space-x-2"}>
        {fieldValue && (
          <>
            <Form.Select
              noLabel
              field={`${field}.operator`}
              className={"w-28"}
              zIndex={1060}
              optionList={operatorOptions}
              initValue={defaultOperator}
              onChange={value => setOperator(value as string)}
            />
            <div className={"flex-1"}>
              {kind == "select" ? (
                <Form.Select
                  noLabel
                  filter
                  multiple
                  zIndex={1060}
                  field={`${field}.value`}
                  className={"w-full"}
                />
              ) : (
                <Form.DatePicker
                  noLabel
                  zIndex={1060}
                  field={`${field}.value`}
                  type={operator == "between" ? "dateTimeRange" : "dateTime"}
                  className={"w-full"}
                />
              )}
            </div>
          </>
        )}
      </div>
      <Button
        icon={<IconClose />}
        type={"tertiary"}
        theme={"borderless"}
        onClick={remove}
      />
    </div>
  );
};

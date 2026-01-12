import { FC, useState, useRef, RefObject } from "react";
import {
  Button,
  Dropdown,
  List,
  Space,
  Form,
  ArrayField,
} from "@douyinfe/semi-ui-19";
import {
  IconCheckCircleStroked,
  IconClose,
  IconFilterStroked,
  IconOrderedListStroked,
} from "@douyinfe/semi-icons";
import Section from "@douyinfe/semi-ui-19/lib/es/form/section";
import { OptionProps } from "@douyinfe/semi-ui-19/lib/es/select";

export const Todo: FC = () => {
  return <List header={<Header />} />;
};
const Header: FC = () => {
  return (
    <Space>
      <TaskStatus />
      <TaskFilter />
    </Space>
  );
};

const TaskStatus: FC = () => {
  const status = ["未完成", "已完成", "全部任务"];
  const [currentStatus, setCurrentStatus] = useState(status[0]);

  return (
    <Dropdown
      trigger={"click"}
      clickToHide={true}
      render={
        <Dropdown.Menu className={"!px-1"}>
          {status.map(x => (
            <Dropdown.Item
              key={x}
              className={"!p-2 w-32 flex justify-between"}
              active={currentStatus == x}
              onClick={() => setCurrentStatus(x)}
            >
              {x} {currentStatus == x ? <IconCheckCircleStroked /> : ""}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      }
    >
      <div>
        <Button
          theme={"borderless"}
          type={"tertiary"}
          icon={<IconOrderedListStroked />}
        >
          {currentStatus}
        </Button>
      </div>
    </Dropdown>
  );
};

const TaskFilter: FC = () => {
  const form = useRef<Form>(undefined);
  return (
    <Dropdown
      keepDOM
      trigger="click"
      position="bottomLeft"
      render={
        <Form className={"w-176 p-5"} ref={form as RefObject<Form>}>
          <ArrayField field={"conditions"}>
            {({ arrayFields, add }) => {
              return (
                <Space vertical={true} align={"start"} className={"w-full"}>
                  <Section
                    text={
                      <div className={"flex justify-between"}>
                        筛选{" "}
                        <Button
                          theme={"borderless"}
                          type={"tertiary"}
                          size={"small"}
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
                    size={"small"}
                    onClick={() => add()}
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
    value: Form.Select,
  },
  {
    title: "start_time",
    operators: ["=", "<", ">", "between", "is null", "in not null"],
    value: Form.DatePicker,
  },
  {
    title: "deadline",
    operators: ["=", "<", ">", "between", "is null", "in not null"],
    value: Form.DatePicker,
  },
  {
    title: "completion_time",
    operators: ["=", "<", ">", "between", "is null", "in not null"],
    value: Form.DatePicker,
  },
  {
    title: "assignee",
    operators: ["in", "not in", "is null", "in not null"],
    value: Form.Select,
  },
  {
    title: "followers",
    operators: ["in", "not in", "is null", "in not null"],
    value: Form.Select,
  },
  {
    title: "creator",
    operators: ["in", "not in", "is null", "in not null"],
    value: Form.Select,
  },
  {
    title: "source",
    operators: ["in", "not in"],
    value: Form.Select,
  },
  {
    title: "source_kind",
    operators: ["in", "not in"],
    value: Form.Select,
  },
  {
    title: "creation_time",
    operators: ["=", "<", ">", "between"],
    value: Form.DatePicker,
  },
  {
    title: "update_time",
    operators: ["=", "<", ">", "between"],
    value: Form.DatePicker,
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
  const defaultOperator = operatorOptions && operatorOptions[0].value;
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
            />
            <div className={"flex-1"}>
              <Form.Select
                noLabel
                field={`${field}.value`}
                className={"w-full"}
              />
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

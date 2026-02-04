import { FC, HTMLProps, ReactNode, useEffect, useRef, useState } from "react";
import { Divider, Input, Radio, RadioGroup, Space } from "@douyinfe/semi-ui-19";
import { IconCrossStroked, IconSearch, IconTick } from "@douyinfe/semi-icons";
import { useGlobal } from "@utils/context.tsx";
import { RadioProps } from "@douyinfe/semi-ui-19/lib/es/radio";
import { IconNotebook } from "@icons/IconNotebook.tsx";
import { IconTable } from "@icons/IconTable.tsx";
import { IconPipeline } from "@icons/IconPipeline.tsx";
import Text from "@douyinfe/semi-ui-19/lib/es/typography/text";
import { FormattedRelativeTime } from "react-intl";

const choices = [
  {
    icon: <IconNotebook />,
    text: "Notebooks",
    tag: "type:notebooks",
  },
  {
    icon: <IconTable />,
    text: "Tables",
    tag: "type:tables",
  },
  {
    icon: <IconPipeline />,
    text: "Pipelines",
    tag: "type:pipelines",
  },
];

export const Search: FC<HTMLProps<HTMLDivElement>> = props => {
  const { msg } = useGlobal();
  const search = useRef<HTMLInputElement>({} as HTMLInputElement);
  const container = useRef<HTMLDivElement>({} as HTMLDivElement);

  const [value, setValue] = useState<string>("");
  const [kind, setKind] = useState<string>();
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const handle = (e: PointerEvent) => {
      if (!container.current.contains(e.target as Node)) setVisible(false);
      else setVisible(true);
    };
    document.addEventListener("click", handle);

    return () => document.removeEventListener("click", handle);
  });
  const onValueChange = (v: string) => {
    setValue(v);
    const currentKind = choices
      .map(x => x.tag)
      .map(x => ({ tag: x, index: v.search(`${x} `) }))
      .filter(x => x.index >= 0)
      .sort((a, b) => a.index - b.index)[0]?.tag;
    setKind(currentKind);
  };
  return (
    <div
      {...props}
      className={["relative", visible && "shadow-md", props.className].join(
        " ",
      )}
      ref={container}
    >
      <Input
        prefix={<IconSearch />}
        suffix={
          <IconCrossStroked
            className={"cursor-pointer"}
            onClick={() => {
              onValueChange("");
            }}
          />
        }
        placeholder={msg("top_search")}
        className={[
          "bg-semi-color-bg-0 z-10 rounded",
          "hover:border-semi-color-primary has-[:focus]:border-transparent",
        ].join(" ")}
        ref={search}
        value={value}
        onChange={onValueChange}
      />
      {visible && (
        <div
          className={
            "absolute w-full top-8 bg-semi-color-bg-0 shadow-md rounded-b z-10"
          }
        >
          <RadioGroup
            type={"pureCard"}
            className={"p-2"}
            mode={"advanced"}
            value={kind}
            onChange={e => {
              const currentValue = e.target.value;
              setKind(currentValue);
              setValue(pre => {
                const input = choices
                  .map(x => x.tag)
                  .reduce((x, y) => x.replaceAll(y, ""), pre)
                  .trim();
                return currentValue ? `${currentValue} ${input}` : input;
              });
              search.current.focus();
            }}
          >
            {choices.map(x => (
              <SearchRadio
                key={x.text}
                icon={kind === x.tag ? <IconTick /> : x.icon}
                value={x.tag}
              >
                {x.text}
              </SearchRadio>
            ))}
          </RadioGroup>
          <Divider className={"mb-1 mx-2"} />
          <div>
            <Text
              type={"tertiary"}
              className={"px-3 py-1.5 inline-block cursor-default"}
            >
              {msg("top_recents")}
            </Text>
            <RecentItem
              name={"a.ipynb"}
              path={"src/views"}
              viewTime={"2026-01-30 17:00:00"}
            />
          </div>
        </div>
      )}
    </div>
  );
};

const SearchRadio: FC<RadioProps & { icon: ReactNode }> = props => {
  const { icon, children, ...old } = props;
  return (
    <Radio
      {...old}
      className={[
        "px-2 py-0 group border-semi-color-text-3 has-[:checked]:border-semi-color-primary",
        "hover:bg-semi-color-primary-light-default hover:border-semi-color-primary",
      ].join(" ")}
    >
      <span
        className={[
          "flex justify-center items-center space-x-2",
          "font-normal leading-6 hover:text-semi-color-primary",
          "group-has-[:checked]:text-semi-color-primary",
        ].join(" ")}
      >
        {icon}
        {typeof children === "string" ? <span>{children}</span> : children}
      </span>
    </Radio>
  );
};

const RecentItem: FC<{ name: string; path: string; viewTime: string }> = ({
  name,
  path,
  viewTime,
}) => {
  const [interval] = useState(() => new Date(viewTime).getTime() - Date.now());
  return (
    <div
      className={
        "flex justify-between items-center py-1 px-6 hover:bg-semi-color-primary-light-default cursor-pointer"
      }
    >
      <div className={"p-4 leading-4"}>
        <IconNotebook className={"align-top text-semi-color-text-0"} />
      </div>
      <Space vertical align={"start"} className={"flex-1"} spacing={0}>
        <Text>{name}</Text>
        <Text type={"tertiary"}>{path}</Text>
      </Space>
      <Text type={"tertiary"}>
        <FormattedRelativeTime value={interval} />
      </Text>
    </div>
  );
};

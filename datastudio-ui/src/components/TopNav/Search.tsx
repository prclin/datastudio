import { FC, HTMLProps, ReactNode, useRef, useState } from "react";
import { Divider, Input, Radio, RadioGroup } from "@douyinfe/semi-ui-19";
import { IconSearch, IconTick } from "@douyinfe/semi-icons";
import { useGlobal } from "@utils/context.tsx";
import { RadioProps } from "@douyinfe/semi-ui-19/lib/es/radio";
import { IconNotebook } from "@icons/IconNotebook.tsx";
import { IconTable } from "@icons/IconTable.tsx";
import { IconPipeline } from "@icons/IconPipeline.tsx";

const choices = [
  {
    icon: <IconNotebook />,
    text: "Notebooks",
  },
  {
    icon: <IconTable />,
    text: "Tables",
  },
  {
    icon: <IconPipeline />,
    text: "Pipelines",
  },
];

export const Search: FC<HTMLProps<HTMLDivElement>> = props => {
  const { msg } = useGlobal();
  const search = useRef<HTMLInputElement>({} as HTMLInputElement);
  const [kind, setKind] = useState<string>();
  return (
    <div {...props} className={["relative", props.className].join(" ")}>
      <Input
        showClear
        prefix={<IconSearch />}
        placeholder={msg("top_search")}
        className={[
          "bg-semi-color-bg-0 z-10",
          "hover:border-semi-color-primary has-[:focus]:border-transparent",
        ].join(" ")}
        ref={search}
      />
      <div className={"absolute w-full top-8 bg-semi-color-bg-0"}>
        <RadioGroup
          type={"pureCard"}
          className={"p-2"}
          mode={"advanced"}
          value={kind}
          onChange={e => setKind(e.target.value)}
        >
          {choices.map(x => (
            <SearchRadio
              key={x.text}
              icon={kind === x.text ? <IconTick /> : x.icon}
              value={x.text}
            >
              {x.text}
            </SearchRadio>
          ))}
        </RadioGroup>
        <Divider className={"mb-2 mx-2"} />
      </div>
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

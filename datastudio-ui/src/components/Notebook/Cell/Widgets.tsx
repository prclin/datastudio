import { FC, HTMLAttributes } from "react";

import { loader } from "@monaco-editor/react";
import * as monaco from "monaco-editor";
import { Button, ButtonGroup, Divider } from "@douyinfe/semi-ui-19";
import { IconDeleteStroked, IconPlusStroked } from "@douyinfe/semi-icons";
import { withDefaultProps } from "@utils/component.tsx";
import { DividerProps } from "@douyinfe/semi-ui-19/lib/es/divider";
import { useNotebook } from "@components/Notebook";

// 加载使用npm包而不使用cdn
loader.config({ monaco });

export const Collapser: FC<HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => {
  return (
    <div
      className={[
        "collapser w-2 hover:!bg-semi-color-primary-hover",
        className,
      ].join(" ")}
      {...props}
    ></div>
  );
};

export interface PromptProps {
  count?: number;
  hideCount?: boolean;
  className?: string;
}
export const Prompt: FC<PromptProps> = ({ count, hideCount, className }) => {
  return (
    <div
      className={[
        "prompt whitespace-pre w-16 text-right p-1 text-sm",
        "border border-transparent text-semi-color-text-3 cursor-move select-none",
        className,
      ].join(" ")}
    >
      {!hideCount && `[ ${count || " "} ] :`}
    </div>
  );
};

const ActionButton = withDefaultProps(Button, {
  className: "hover:text-semi-color-primary",
  onFocus: e => e.target.blur(),
});

export const Actions: FC<{ className?: string }> = ({ className }) => {
  return (
    <ButtonGroup
      size={"small"}
      theme={"borderless"}
      type={"tertiary"}
      className={["gap-2", className].join(" ")}
    >
      <ActionButton icon={<IconPlusStroked />} />
      <ActionButton icon={<IconDeleteStroked />} />
    </ButtonGroup>
  );
};

const DividerButton = withDefaultProps(Button, {
  icon: <IconPlusStroked size={"small"} />,
  type: "tertiary",
  theme: "borderless",
  size: "small",
  className: "px-2 font-normal hover:text-semi-color-secondary",
});
export const CellDivider: FC<DividerProps & { index: number }> = ({
  index,
  ...props
}) => {
  const { addCell } = useNotebook();
  return (
    <Divider dashed {...props}>
      <DividerButton onClick={() => addCell("code", index)}>Code</DividerButton>
      <DividerButton onClick={() => addCell("markdown", index)}>
        Markdown
      </DividerButton>
    </Divider>
  );
};

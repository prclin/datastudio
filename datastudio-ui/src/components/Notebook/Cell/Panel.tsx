import { FC, ReactNode } from "react";
import {
  Collapser,
  Prompt,
  PromptProps,
} from "@components/Notebook/Cell/Widgets.tsx";

type CellPanelProps = Omit<PromptProps, "className"> & {
  collapserClassName?: string;
  promptClassName?: string;
  onCollapserClick?: () => void;
  children?: ReactNode;
};

export const CellPanel: FC<CellPanelProps> = ({
  collapserClassName,
  promptClassName,
  onCollapserClick,
  count,
  hideCount,
  children,
}) => {
  return (
    <div className={"p-1 flex items-stretch"}>
      <Collapser className={collapserClassName} onClick={onCollapserClick} />
      <Prompt count={count} hideCount={hideCount} className={promptClassName} />
      <div className={"flex-1"}>{children}</div>
    </div>
  );
};

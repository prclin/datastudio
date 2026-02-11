import { FC, ReactNode } from "react";
import {
  Collapser,
  Prompt,
  PromptProps,
} from "@components/Notebook/Cell/Widgets.tsx";

type CellPanelProps = Omit<PromptProps, "className"> & {
  kind?: "source" | "outputs";
  onCollapserClick?: () => void;
  children?: ReactNode;
};

export const CellPanel: FC<CellPanelProps> = ({
  onCollapserClick,
  count,
  hideCount,
  children,
  kind = "code",
}) => {
  return (
    <div className={"p-1 flex items-stretch"}>
      <Collapser
        className={
          "group-checked/cell:bg-semi-color-primary group-has-[:checked]/cell:bg-semi-color-primary"
        }
        onClick={onCollapserClick}
      />
      <Prompt
        count={count}
        hideCount={hideCount}
        className={
          kind === "code"
            ? "group-has-[:checked]/cell:text-semi-color-primary"
            : "group-has-[:checked]/cell:text-semi-color-warning"
        }
      />
      <div className={"flex-1"}>{children}</div>
    </div>
  );
};

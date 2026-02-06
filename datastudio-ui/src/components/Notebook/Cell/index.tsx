import {
  Dispatch,
  FC,
  ReactNode,
  SetStateAction,
  useRef,
  useState,
} from "react";
import { loader } from "@monaco-editor/react";
import * as monaco from "monaco-editor";
import {
  Actions,
  Collapser,
  Prompt,
  PromptProps,
  Source,
  SourceRef,
} from "@components/Notebook/Cell/Widgets.tsx";
import { Cell as _Cell, NotebookMetadata } from "@components/Notebook/notebook";
import { MarkdownRender } from "@douyinfe/semi-ui-19";
// 加载使用npm包而不使用cdn
loader.config({ monaco });

export interface CellProps {
  cell?: _Cell;
  language?:
    | NotebookMetadata["language_info"]["name"]
    | "python"
    | "scala"
    | "markdown";
  path?: string;
}

export const Cell: FC<CellProps> = ({ cell, language, path }) => {
  const sourceRef = useRef<SourceRef>(null);
  const isMarkdown = cell?.cell_type === "markdown";
  const [showMarkdown, setShowMarkdown] = useState(isMarkdown);
  const [value, setValue] = useState(cell?.source.join("\n"));
  const radioRef = useRef<HTMLInputElement>(null);
  return (
    <div
      tabIndex={-1}
      onMouseDown={() => {
        if (radioRef.current) {
          radioRef.current.checked = true;
        }
      }}
      className={
        "relative group/cell focus:border-semi-color-primary border border-transparent p-1"
      }
    >
      <Actions
        className={
          "absolute top-3 right-10 z-10 invisible group-hover/cell:visible group-focus/cell:visible"
        }
      />
      <input
        ref={radioRef}
        type={"radio"}
        name={"cell"}
        className={"absolute hidden"}
      />
      <CellPanel count={cell?.execution_count} hideCount={isMarkdown}>
        {(collapsed, setCollapsed) => {
          return (
            <>
              {!showMarkdown ? (
                <Source
                  ref={sourceRef}
                  language={language}
                  path={path}
                  defaultValue={value}
                  collapsed={collapsed}
                  onFocus={() => setCollapsed(false)}
                  onBlur={() => {
                    if (isMarkdown) {
                      setShowMarkdown(true);
                      setValue(sourceRef.current?.getValue);
                    }
                  }}
                />
              ) : (
                <div
                  onDoubleClick={() => {
                    setShowMarkdown(false);
                    sourceRef.current?.focus();
                  }}
                  className={"py-1 px-2 border border-transparent"}
                >
                  <MarkdownRender raw={value} />
                </div>
              )}
            </>
          );
        }}
      </CellPanel>
      {!isMarkdown && cell?.outputs && cell.outputs.length != 0 && (
        <CellPanel count={cell?.execution_count} kind={"outputs"}>
          {/* todo填充结果 */}
          <div>todo</div>
        </CellPanel>
      )}
    </div>
  );
};

type CellPanelProps = Omit<PromptProps, "className"> & {
  kind?: "source" | "outputs";
  children?:
    | ReactNode
    | ((
        collapsed: boolean,
        setCollapsed: Dispatch<SetStateAction<boolean>>,
      ) => ReactNode);
};

const CellPanel: FC<CellPanelProps> = ({
  count,
  hideCount,
  children,
  kind = "code",
}) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={"p-1 flex items-stretch"}>
      <Collapser
        className={
          "group-checked/cell:bg-semi-color-primary group-has-[:checked]/cell:bg-semi-color-primary"
        }
        onClick={() => setCollapsed(pre => !pre)}
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
      <div className={"flex-1"}>
        {children && typeof children === "function"
          ? children(collapsed, setCollapsed)
          : children}
      </div>
    </div>
  );
};

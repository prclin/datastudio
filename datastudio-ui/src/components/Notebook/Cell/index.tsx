import { FC, useRef, useState } from "react";
import { loader } from "@monaco-editor/react";
import * as monaco from "monaco-editor";
import { Actions } from "@components/Notebook/Cell/Widgets.tsx";
import { Cell as _Cell, NotebookMetadata } from "@components/Notebook/notebook";
import { MarkdownRender } from "@douyinfe/semi-ui-19";
import { CellPanel } from "@components/Notebook/Cell/Panel.tsx";
import { Source, SourceRef } from "@components/Notebook/Cell/Source.tsx";
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
  const radioRef = useRef<HTMLInputElement>(null);

  const isMarkdown = cell?.cell_type === "markdown";
  const [showMarkdown, setShowMarkdown] = useState(isMarkdown);
  const [value, setValue] = useState(cell?.source.join("\n"));
  const [sourceHidden, setSourceHidden] = useState(false);
  return (
    <div
      tabIndex={-1}
      onFocus={() => {
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
      <CellPanel
        count={cell?.execution_count}
        hideCount={isMarkdown}
        onCollapserClick={() => setSourceHidden(pre => !pre)}
        collapserClassName={"group-has-[:checked]/cell:bg-semi-color-primary"}
        promptClassName={
          "group-has-[:checked]/cell:text-semi-color-primary cursor-move"
        }
      >
        {!showMarkdown ? (
          <Source
            ref={sourceRef}
            language={language}
            path={path}
            defaultValue={value}
            collapsed={sourceHidden}
            onFocus={() => setSourceHidden(false)}
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
            <MarkdownRender raw={value == "" ? "type markdown here" : value} />
          </div>
        )}
      </CellPanel>
      {!isMarkdown && cell?.outputs && cell.outputs.length != 0 && (
        <CellPanel
          count={cell?.execution_count}
          collapserClassName={"group-has-[:checked]/cell:bg-semi-color-primary"}
          promptClassName={
            "group-has-[:checked]/cell:text-semi-color-secondary"
          }
        >
          {/* todo填充结果 */}
          <div>todo</div>
        </CellPanel>
      )}
    </div>
  );
};

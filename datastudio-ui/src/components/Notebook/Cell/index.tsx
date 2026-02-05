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
  Collapser,
  Prompt,
  PromptProps,
  Source,
  SourceRef,
} from "@components/Notebook/Cell/Widgets.tsx";
import { Cell as _Cell } from "@components/Notebook/notebook";
import { MarkdownRender } from "@douyinfe/semi-ui-19";
// 加载使用npm包而不使用cdn
loader.config({ monaco });

export interface CellProps {
  cell?: _Cell;
  language?: "sql" | "python" | "scala" | "markdown";
  path?: string;
}

export const Cell: FC<CellProps> = ({ cell, language, path }) => {
  const sourceRef = useRef<SourceRef>(null);
  const isMarkdown = cell?.cell_type === "markdown";
  const [showMarkdown, setShowMarkdown] = useState(isMarkdown);
  const [value, setValue] = useState(cell?.source.join("\n"));
  return (
    <div>
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
                  className={
                    "py-1 px-2 border border-transparent hover:border-semi-color-primary"
                  }
                >
                  <MarkdownRender raw={value} />
                </div>
              )}
            </>
          );
        }}
      </CellPanel>
      {!isMarkdown && cell?.outputs && cell.outputs.length != 0 && (
        <CellPanel count={cell?.execution_count}>
          {/* todo填充结果 */}
          <div>todo</div>
        </CellPanel>
      )}
    </div>
  );
};

type CellPanelProps = PromptProps & {
  children?:
    | ReactNode
    | ((
        collapsed: boolean,
        setCollapsed: Dispatch<SetStateAction<boolean>>,
      ) => ReactNode);
};

const CellPanel: FC<CellPanelProps> = ({ count, hideCount, children }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      className={
        "p-1 flex items-stretch [&:has(:focus)_.collapser]:bg-semi-color-primary-hover"
      }
    >
      <Collapser onClick={() => setCollapsed(pre => !pre)} />
      <Prompt count={count} hideCount={hideCount} />
      <div className={"flex-1"}>
        {children && typeof children === "function"
          ? children(collapsed, setCollapsed)
          : children}
      </div>
    </div>
  );
};

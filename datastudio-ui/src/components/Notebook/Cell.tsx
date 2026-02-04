import { FC, forwardRef, useImperativeHandle, useRef, useState } from "react";
import { Editor, loader } from "@monaco-editor/react";
import * as monaco from "monaco-editor";
import { editor } from "monaco-editor";
// 加载使用npm包而不使用cdn
loader.config({ monaco });

const defaultHeight = 20;

interface CellProps {
  cell_type?: "code" | "markdown";
  execution_count?: number;
  id?: string;
  metadata?: {
    editable?: boolean;
    "jp-MarkdownHeadingCollapsed"?: boolean;
    jupyter?: { outputs_hidden?: boolean; source_hidden?: boolean };
  };
  language?: "sql" | "python" | "scala" | "markdown";
  path?: string;
  defaultValue?: string;
}

export const Cell: FC<CellProps> = ({
  cell_type = "code",
  execution_count,
  id,
  metadata,
  language,
  path,
  defaultValue,
}) => {
  console.log(id, cell_type, metadata);
  const [collapsed, setCollapsed] = useState(false);
  const codeRef = useRef<CodeRef>(null);
  return (
    <div
      className={
        "p-1 flex items-stretch [&:has(:focus)_.collapser]:bg-semi-color-primary-hover"
      }
    >
      <Collapser
        onClick={() => {
          setCollapsed(pre => !pre);
          codeRef.current?.scrollToTop();
        }}
      />
      <Prompt count={execution_count} />
      <Code
        className={"flex-1"}
        ref={codeRef}
        language={language}
        path={path}
        defaultValue={defaultValue}
        collapsed={collapsed}
        onFocus={() => setCollapsed(false)}
      />
    </div>
  );
};

export const Collapser: FC<{ onClick: () => void }> = ({ onClick }) => {
  return (
    <div
      className={"collapser w-2 hover:!bg-semi-color-primary-active"}
      onClick={onClick}
    ></div>
  );
};

export const Prompt: FC<{ count?: number }> = ({ count }) => {
  return (
    <div
      className={[
        "whitespace-pre w-16 text-right p-1 text-sm",
        "border border-transparent text-semi-color-text-3 cursor-move select-none",
      ].join(" ")}
    >
      [ {count || " "} ] :
    </div>
  );
};

type CodeProps = Pick<CellProps, "path" | "language" | "defaultValue"> & {
  onFocus?: () => void;
  collapsed?: boolean;
  className?: string;
};
interface CodeRef {
  scrollToTop: () => void;
}
export const Code = forwardRef<CodeRef, CodeProps>(
  ({ language, path, defaultValue, onFocus, collapsed, className }, ref) => {
    const [height, setHeight] = useState(
      (defaultValue?.split("\n").length || 1) * defaultHeight,
    );
    const editorRef = useRef<editor.IStandaloneCodeEditor>(undefined);

    const onMount = (e: editor.IStandaloneCodeEditor) => {
      editorRef.current = e;
      e.onDidContentSizeChange(() => {
        const contentHeight = e.getContentHeight();
        const width = e.getContainerDomNode().clientWidth;
        setHeight(contentHeight);
        requestAnimationFrame(() =>
          e.layout({ height: contentHeight, width: width }),
        );
      });
      onFocus && e.onDidFocusEditorText(onFocus);
    };

    useImperativeHandle(ref, () => ({
      scrollToTop: () => {
        editorRef.current?.revealLine(1);
      },
    }));

    return (
      <div
        className={[
          "py-1 border has-[:focus]:border-semi-color-primary overflow-hidden",
          className,
        ].join(" ")}
      >
        <Editor
          language={language}
          path={path}
          defaultValue={defaultValue}
          height={collapsed ? defaultHeight : height}
          options={{
            scrollBeyondLastLine: false,
            minimap: { enabled: false },
            scrollbar: { vertical: "hidden" },
            overviewRulerLanes: 0,
            lineNumbersMinChars: 2,
            lineHeight: defaultHeight,
            renderLineHighlight: "none",
            guides: {
              indentation: !collapsed,
            },
          }}
          onMount={onMount}
        />
      </div>
    );
  },
);

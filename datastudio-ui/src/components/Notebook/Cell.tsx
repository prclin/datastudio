import { FC, useRef, useState } from "react";
import { Editor, loader } from "@monaco-editor/react";
import * as monaco from "monaco-editor";
import { editor } from "monaco-editor";
// 加载使用npm包而不使用cdn
loader.config({ monaco });

const defaultHeight = 20;

interface CellProps {
  defaultValue?: string;
  language?: string;
  path?: string;
}

export const Cell: FC<CellProps> = ({ defaultValue = "", language, path }) => {
  const [height, setHeight] = useState(
    defaultValue.split("\n").length * defaultHeight,
  );
  const [collapsed, setCollapsed] = useState(false);
  const containerRef = useRef<editor.IStandaloneCodeEditor>(undefined);
  const onMount = (e: editor.IStandaloneCodeEditor) => {
    containerRef.current = e;
    e.onDidContentSizeChange(() => {
      console.log(1);
      const contentHeight = e.getContentHeight();
      const width = e.getContainerDomNode().clientWidth;
      setHeight(contentHeight);
      requestAnimationFrame(() =>
        e.layout({ height: contentHeight, width: width }),
      );
    });
    e.onDidFocusEditorText(() => setCollapsed(false));
  };

  return (
    <div
      className={
        "p-1 flex items-stretch [&:has(:focus)_.collapsible]:bg-semi-color-primary-hover"
      }
    >
      <div
        className={"collapsible w-2 hover:!bg-semi-color-primary-active"}
        onClick={() => setCollapsed(pre => !pre)}
      ></div>
      <div
        className={
          "w-16 text-right p-1 text-sm border border-transparent text-semi-color-text-3 cursor-move"
        }
      >
        [ 1 ] :
      </div>
      <div
        className={
          "flex-1 py-1 border has-[:focus]:border-semi-color-primary overflow-hidden"
        }
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
              indentation: false,
            },
          }}
          onMount={onMount}
        />
      </div>
    </div>
  );
};

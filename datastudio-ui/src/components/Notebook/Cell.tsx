import { FC, useRef, useState } from "react";
import { Editor, loader } from "@monaco-editor/react";
import * as monaco from "monaco-editor";
import { editor } from "monaco-editor";
// 加载使用npm包而不使用cdn
loader.config({ monaco });

export const Cell: FC = () => {
  const [height, setHeight] = useState(19);
  const containerRef = useRef<editor.IStandaloneCodeEditor>(undefined);
  const onMount = (e: editor.IStandaloneCodeEditor) => {
    containerRef.current = e;
    e.onDidContentSizeChange(() => {
      const contentHeight = e.getContentHeight();
      const width = e.getContainerDomNode().clientWidth;
      setHeight(contentHeight);
      e.layout({ height: contentHeight, width: width }, true);
    });
  };
  return (
    <div className={"flex items-stretch"}>
      <div className={"w-2 hover:bg-semi-color-primary-active"}></div>
      <div
        className={
          "w-16 text-right p-1.5 text-sm leading-4 text-semi-color-text-3 cursor-move"
        }
      >
        [ 1 ] :
      </div>
      <div
        className={"flex-1 py-1 border has-[:focus]:border-semi-color-primary"}
      >
        <Editor
          height={height}
          language="sql"
          defaultValue="select * from x"
          options={{
            scrollBeyondLastLine: false,
            minimap: { enabled: false },
            scrollbar: { vertical: "hidden" },
            overviewRulerLanes: 0,
            lineNumbersMinChars: 2,
            renderLineHighlight: "none",
          }}
          path={"b.sql"}
          onMount={onMount}
        />
      </div>
    </div>
  );
};

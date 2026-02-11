import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { CellProps } from "@components/Notebook/Cell/index.tsx";
import { Editor } from "@monaco-editor/react";
import { editor } from "monaco-editor";
import { useControllableState } from "@utils/hooks.tsx";

type SourceProps = Pick<CellProps, "path" | "language"> & {
  onFocus?: () => void;
  onBlur?: () => void;
  collapsed?: boolean;
  className?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (v?: string) => void;
  lineHeight?: number;
};
export interface SourceRef {
  focus: () => void;
  scrollToTop: () => void;
  getValue: () => string;
}
export const Source = forwardRef<SourceRef, SourceProps>(
  (
    {
      language,
      path,
      value,
      defaultValue,
      onChange,
      onFocus,
      collapsed,
      className,
      onBlur,
      lineHeight = 20,
    },
    ref,
  ) => {
    const [height, setHeight] = useState(
      (defaultValue?.split("\n").length || 1) * lineHeight,
    );

    const [innerValue, setInnerValue] = useControllableState(
      defaultValue,
      value,
      onChange,
    );

    const editorRef = useRef<editor.IStandaloneCodeEditor>(null);

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
      onBlur && e.onDidBlurEditorText(onBlur);
    };

    useImperativeHandle(ref, () => ({
      focus: () => {
        editorRef.current?.focus();
      },
      scrollToTop: () => {
        editorRef.current?.revealLine(1);
      },
      getValue: () => editorRef.current?.getValue() || "",
    }));

    const isMarkdown = language === "markdown";
    return (
      <div
        className={[
          "py-1 border has-[:focus]:border-semi-color-primary",
          collapsed && "overflow-hidden",
          className,
        ].join(" ")}
      >
        <Editor
          language={language}
          onChange={setInnerValue}
          path={path}
          value={innerValue}
          height={collapsed ? lineHeight : height}
          loading={null}
          options={{
            scrollBeyondLastLine: false,
            minimap: { enabled: false },
            scrollbar: { vertical: "hidden" },
            overviewRulerLanes: 0,
            lineNumbersMinChars: 2,
            lineNumbers: isMarkdown ? "off" : "on",
            folding: !isMarkdown,
            lineHeight: lineHeight,
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

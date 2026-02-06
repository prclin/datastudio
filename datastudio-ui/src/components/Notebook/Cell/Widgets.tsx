import { FC, forwardRef, useImperativeHandle, useRef, useState } from "react";
import { CellProps } from "@components/Notebook/Cell/index.tsx";

import { Editor, loader } from "@monaco-editor/react";
import * as monaco from "monaco-editor";
import { editor } from "monaco-editor";
import { Button, ButtonGroup } from "@douyinfe/semi-ui-19";
import { IconDeleteStroked, IconPlusStroked } from "@douyinfe/semi-icons";
import { withDefaultProps } from "@utils/component.tsx";
import { ButtonProps } from "@douyinfe/semi-ui-19/lib/es/button";

// 加载使用npm包而不使用cdn
loader.config({ monaco });

const defaultHeight = 20;

export const Collapser: FC<{ onClick?: () => void; className?: string }> = ({
  onClick,
  className,
}) => {
  return (
    <div
      className={[
        "collapser w-2 hover:!bg-semi-color-primary-active",
        className,
      ].join(" ")}
      onClick={onClick}
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
        "whitespace-pre w-16 text-right p-1 text-sm",
        "border border-transparent text-semi-color-text-3 cursor-move select-none",
        className,
      ].join(" ")}
    >
      {!hideCount && `[ ${count || " "} ] :`}
    </div>
  );
};

type SourceProps = Pick<CellProps, "path" | "language"> & {
  onFocus?: () => void;
  onBlur?: () => void;
  collapsed?: boolean;
  className?: string;
  defaultValue?: string;
};
export interface SourceRef {
  focus: () => void;
  scrollToTop: () => void;
  getValue: () => string;
}
export const Source = forwardRef<SourceRef, SourceProps>(
  (
    { language, path, defaultValue, onFocus, collapsed, className, onBlur },
    ref,
  ) => {
    const [height, setHeight] = useState(
      (defaultValue?.split("\n").length || 1) * defaultHeight,
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
          path={path}
          defaultValue={defaultValue}
          height={collapsed ? defaultHeight : height}
          loading={null}
          options={{
            scrollBeyondLastLine: false,
            minimap: { enabled: false },
            scrollbar: { vertical: "hidden" },
            overviewRulerLanes: 0,
            lineNumbersMinChars: 2,
            lineNumbers: isMarkdown ? "off" : "on",
            folding: !isMarkdown,
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

const ActionButton = withDefaultProps<ButtonProps>(Button, {
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

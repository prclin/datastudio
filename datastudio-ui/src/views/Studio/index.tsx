import { FC } from "react";
import "@codingame/monaco-vscode-editor-api/esm/vs/editor/editor.worker.js";
import { Vscode } from "@components/Vscode";

export const Component: FC = () => {
  return (
    <div className={"p-2 h-full"}>
      <Vscode />
    </div>
  );
};
Component.displayName = "Studio";

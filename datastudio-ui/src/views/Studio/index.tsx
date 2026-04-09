import { FC } from "react";
import { IconDatastudio } from "@icons/IconDatastudio.tsx";
import "@codingame/monaco-vscode-editor-api/esm/vs/editor/editor.worker.js";
import { Vscode } from "@components/Vscode";

export const Studio: FC = () => {
  return (
    <div className={"p-2 h-full"}>
      <Vscode />
    </div>
  );
};

export default Studio;
export const order = 2;
export const text = "views.studio";
export const icon = <IconDatastudio />;
export const group = "SQL";

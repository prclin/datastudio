import { FC } from "react";
import { IconDatastudio } from "@icons/IconDatastudio.tsx";
import "@codingame/monaco-vscode-editor-api/esm/vs/editor/editor.worker.js";
import { Vscode } from "@components/Vscode";

export const Studio: FC = () => {
  return (
    <div className={"p-2"}>
      <Vscode />
    </div>
  );
};

export default Studio;
export const order = 2;
export const text = "side_studio";
export const icon = <IconDatastudio />;
export const path = "studio";

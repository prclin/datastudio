import { FC } from "react";
import { Editor, loader } from "@monaco-editor/react";
import * as monaco from "monaco-editor";

loader.config({ monaco });

export const Cell: FC = () => {
  return (
    <div>
      <Editor
        className={"h-24"}
        language="sql"
        defaultValue="select * from x"
        options={{ scrollBeyondLastLine: false }}
        path={"b.sql"}
      />
    </div>
  );
};

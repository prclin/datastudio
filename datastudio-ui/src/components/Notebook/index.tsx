import { FC } from "react";
import { Cell } from "@components/Notebook/Cell";
import { Notebook as _Notebook } from "@components/Notebook/notebook";
import { ToolBar } from "@components/Notebook/ToolBar";
import { CellDivider } from "@components/Notebook/Cell/Widgets.tsx";

interface NotebookProps {
  notebook?: _Notebook;
}

const defaultNotebook: _Notebook = {
  cells: [
    {
      cell_type: "markdown",
      id: "asd",
      metadata: {},
      source: ["# sd"],
    },
    {
      cell_type: "code",
      id: "sad",
      metadata: {},
      source: ["select * from x;", "show create table x;"],
      outputs: [
        { output_type: "execute_result", data: { "text/plain": ["asd"] } },
      ],
    },
  ],
  metadata: {
    kernelspec: {
      display_name: "xx",
      name: "x",
    },
    language_info: {
      file_extension: ".fsql",
      mimetype: "text/x-fsql",
      name: "fsql",
      version: "1.18",
    },
  },
  nbformat: 4,
  nbformat_minor: 5,
};

export const Notebook: FC<NotebookProps> = ({ notebook = defaultNotebook }) => {
  return (
    <div>
      <ToolBar />

      <div>
        <CellDivider className={"opacity-0 hover:opacity-100"} />
        {notebook.cells.map((cell, index) => (
          <div key={index}>
            <Cell
              language={
                cell.cell_type === "markdown"
                  ? "markdown"
                  : notebook.metadata.language_info.name
              }
              path={cell.id}
              cell={cell}
            />
            <CellDivider className={"opacity-0 hover:opacity-100"} />
          </div>
        ))}
      </div>
    </div>
  );
};

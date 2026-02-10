import { createContext, FC, useContext, useState } from "react";
import { Cell } from "@components/Notebook/Cell";
import {
  Cell as _Cell,
  Notebook as _Notebook,
} from "@components/Notebook/notebook";
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
  const [nb, setNb] = useState(notebook);
  const addCell = (kind: _Cell["cell_type"], index: number) => {
    setNb(pre => {
      let cell: _Cell;
      switch (kind) {
        case "markdown":
          cell = {
            cell_type: "markdown",
            id: "sdddd",
            metadata: {},
            source: [""],
          };
          break;
        case "code":
          cell = {
            cell_type: "code",
            id: "sddasfggasad",
            metadata: {},
            source: [""],
            outputs: [],
          };
          break;
      }
      const cells = [
        ...pre.cells.slice(0, index),
        cell,
        ...pre.cells.splice(index),
      ];
      return { ...pre, cells };
    });
  };
  return (
    <Context.Provider value={{ addCell }}>
      <div>
        <ToolBar />

        <div>
          <CellDivider index={0} className={"opacity-0 hover:opacity-100"} />
          {nb.cells.map((cell, index) => (
            <div key={cell.id}>
              <Cell
                language={
                  cell.cell_type === "markdown"
                    ? "markdown"
                    : nb.metadata.language_info.name
                }
                path={cell.id}
                cell={cell}
              />
              <CellDivider
                index={index + 1}
                className={"opacity-0 hover:opacity-100"}
              />
            </div>
          ))}
        </div>
      </div>
    </Context.Provider>
  );
};

interface NotebookContext {
  addCell: (kind: _Cell["cell_type"], index: number) => void;
}

const Context = createContext<NotebookContext>({
  addCell: () => {},
});

export const useNotebook = () => useContext(Context);

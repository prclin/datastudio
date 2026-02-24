import { createContext, FC, useContext, useMemo, useState } from "react";
import { Cell } from "@components/Notebook/Cell";
import {
  Cell as _Cell,
  Notebook as _Notebook,
} from "@components/Notebook/notebook";
import { ToolBar } from "@components/Notebook/ToolBar";

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
  const context = useMemo(() => {
    const addCell = (
      kind: _Cell["cell_type"],
      position: "before" | "after",
      id?: string,
    ) => {
      setNb(pre => {
        let cell: _Cell;
        switch (kind) {
          case "markdown":
            cell = {
              cell_type: "markdown",
              id: crypto.randomUUID(),
              metadata: {},
              source: [""],
            };
            break;
          case "code":
            cell = {
              cell_type: "code",
              id: crypto.randomUUID(),
              metadata: {},
              source: [""],
              outputs: [],
            };
            break;
        }
        let index = pre.cells.findIndex(item => item.id === id);
        index = position === "after" ? index + 1 : index;
        const cells = [
          ...pre.cells.slice(0, index),
          cell,
          ...pre.cells.splice(index),
        ];
        return { ...pre, cells };
      });
    };
    const deleteCell = () => {};
    return { addCell, deleteCell };
  }, [setNb]);
  return (
    <Context.Provider value={context}>
      <div>
        <ToolBar />
        <div>
          {nb.cells.map((cell, index) => (
            <Cell
              showDivider={index === 0 ? "both" : "bottom"}
              key={cell.id}
              language={
                cell.cell_type === "markdown"
                  ? "markdown"
                  : nb.metadata.language_info.name
              }
              path={cell.id}
              cell={cell}
            />
          ))}
        </div>
      </div>
    </Context.Provider>
  );
};

interface NotebookContext {
  addCell: (
    kind: _Cell["cell_type"],
    position: "before" | "after",
    id?: string,
  ) => void;
  deleteCell: (id: string) => void;
}

const Context = createContext<NotebookContext>({
  addCell: () => {},
  deleteCell: () => {},
});

export const useNotebook = () => useContext(Context);

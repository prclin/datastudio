import { FC } from "react";
import { IconDatastudio } from "@icons/IconDatastudio.tsx";
import { Cell } from "@components/Notebook/Cell";

export const Studio: FC = () => {
  return (
    <div className={"p-2"}>
      <Cell
        language={"markdown"}
        path={"sd"}
        cell={{
          cell_type: "markdown",
          id: "",
          metadata: {},
          source: ["sd"],
        }}
      />
      <Cell
        language={"sql"}
        path={"ass"}
        cell={{ cell_type: "code", id: "sad", metadata: {}, source: [" sd"] }}
      />
    </div>
  );
};

export default Studio;
export const order = 2;
export const text = "side_studio";
export const icon = <IconDatastudio />;
export const path = "studio";

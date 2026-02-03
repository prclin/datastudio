import { FC } from "react";
import { IconDatastudio } from "@icons/IconDatastudio.tsx";
import { Cell } from "@components/Notebook/Cell.tsx";

export const Studio: FC = () => {
  return (
    <div className={"p-2"}>
      <Cell />
    </div>
  );
};

export default Studio;
export const order = 2;
export const text = "side_studio";
export const icon = <IconDatastudio />;
export const path = "studio";

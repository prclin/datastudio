import { FC } from "react";
import { EngineCard } from "@components/EngineCard";

export const Component: FC = () => {
  return (
    <div className={"p-2"}>
      <EngineCard />
    </div>
  );
};

Component.displayName = "EngineInstance";

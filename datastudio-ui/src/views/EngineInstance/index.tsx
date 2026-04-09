import { FC } from "react";
import { IconDatastudio } from "@icons/IconDatastudio.tsx";
import { EngineCard } from "@components/EngineCard";
import { LocaleKey } from "@i18n/locale.ts";

export const EngineInstance: FC = () => {
  return (
    <div className={"p-2"}>
      <EngineCard />
    </div>
  );
};

export default EngineInstance;
export const order = 4;
export const text: LocaleKey = "views.engine-instance";
export const icon = <IconDatastudio />;
export const group = "Infrastructure";

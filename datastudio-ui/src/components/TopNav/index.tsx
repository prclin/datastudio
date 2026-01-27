import { FC } from "react";
import { IconSonicStroked } from "@douyinfe/semi-icons";
import { Button } from "@douyinfe/semi-ui-19";

export const TopNav: FC = () => {
  return (
    <nav className={"h-12 p-2"}>
      <Button
        icon={<IconSonicStroked />}
        theme={"borderless"}
        type={"tertiary"}
        className={"hover:text-semi-color-primary"}
      />
    </nav>
  );
};

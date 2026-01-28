import { FC } from "react";
import { IconSonicStroked } from "@douyinfe/semi-icons";
import { Button, Space, Typography } from "@douyinfe/semi-ui-19";
import { IconDatastudio } from "@icons/IconDatastudio.tsx";
import { Search } from "@components/TopNav/Search.tsx";

const { Text } = Typography;
export const TopNav: FC = () => {
  return (
    <nav className={"h-12 p-2 flex justify-between gap-2"}>
      <Space align={"center"} className={"grow-0 shrink basis-100"}>
        <Button
          icon={<IconSonicStroked />}
          theme={"borderless"}
          type={"tertiary"}
          className={"hover:text-semi-color-primary"}
        />
        <Text
          strong
          icon={<IconDatastudio className={"align-top"} />}
          className={"text-base leading-4"}
        >
          datastudio
        </Text>
      </Space>
      <search className={"flex-1 basis-140 flex justify-center"}>
        <Search className={"w-full max-w-140"} />
      </search>
      <Space className={"grow-0 shrink basis-100"}></Space>
    </nav>
  );
};

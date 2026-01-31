import { FC } from "react";
import { IconSonicStroked } from "@douyinfe/semi-icons";
import {
  Avatar,
  Button,
  Dropdown,
  Space,
  Typography,
} from "@douyinfe/semi-ui-19";
import { IconDatastudio } from "@icons/IconDatastudio.tsx";
import { Search } from "@components/TopNav/Search.tsx";
import { useGlobal } from "@utils/context.tsx";

const { Text } = Typography;
export const TopNav: FC = () => {
  const { msg } = useGlobal();
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
          icon={
            <IconDatastudio className={"align-top text-semi-color-primary"} />
          }
          className={"text-base leading-4"}
        >
          datastudio
        </Text>
      </Space>
      <search className={"flex-1 basis-140 flex justify-center"}>
        <Search className={"w-full max-w-140"} />
      </search>
      <Space align={"center"} className={"grow-0 shrink basis-100 justify-end"}>
        <Dropdown
          trigger={"click"}
          render={
            <Dropdown.Menu className={"px-2 w-70"}>
              <Dropdown.Title className={"leading-5 p-2"}>
                user@email.com
              </Dropdown.Title>
              <Dropdown.Item className={"p-2 my-1"}>
                {msg("top_settings")}
              </Dropdown.Item>
              <Dropdown.Item className={"p-2 my-1"}>
                {msg("top_logout")}
              </Dropdown.Item>
            </Dropdown.Menu>
          }
        >
          <div>
            <Button theme={"borderless"} type={"tertiary"} className={"p-1"}>
              <Avatar size="extra-small">U</Avatar>
            </Button>
          </div>
        </Dropdown>
      </Space>
    </nav>
  );
};

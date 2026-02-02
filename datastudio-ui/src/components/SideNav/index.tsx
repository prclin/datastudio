import { FC, ReactNode, useState } from "react";
import { Button, Nav } from "@douyinfe/semi-ui-19";
import { IconHomeStroked, IconPlus } from "@douyinfe/semi-icons";
import { withDefaultProps } from "@utils/component.tsx";
import { NavItemProps } from "@douyinfe/semi-ui-19/lib/es/navigation";
import { LocaleKey, useGlobal } from "@utils/context.tsx";
import { IconDatastudio } from "@icons/IconDatastudio.tsx";

const NavItem = withDefaultProps<NavItemProps>(Nav.Item, {
  className: [
    "leading-4 py-1.5 rounded mb-0.5 font-normal",
    "[&_.semi-navigation-item-icon]:min-w-4 [&_.semi-navigation-item-icon]:mr-2",
    "hover:bg-semi-color-primary-light-hover hover:text-semi-color-primary-hover [&_.semi-navigation-item-icon]:text-inherit",
  ].join(" "),
});
const items: { key: string; text: LocaleKey; icon: ReactNode }[] = [
  {
    key: "home",
    text: "side_home",
    icon: <IconHomeStroked size={"default"} />,
  },
  {
    key: "studio",
    text: "side_studio",
    icon: <IconDatastudio />,
  },
];
export const SideNav: FC = () => {
  const { msg } = useGlobal();
  const [selected, setSelected] = useState<(string | number)[]>(["home"]);
  return (
    <nav className={"px-3 w-50"}>
      <Nav
        className={"w-full border-none p-0 bg-transparent"}
        selectedKeys={selected}
        onSelect={({ itemKey }) => setSelected([itemKey])}
      >
        <Nav.Header className={"p-0"}>
          <Button
            block
            size={"large"}
            icon={<IconPlus className={"text-semi-color-primary"} />}
            theme={"outline"}
            className={[
              "text-semi-color-text-0 justify-start rounded-lg",
              "bg-semi-color-primary-light-default hover:bg-semi-color-primary-light-hover",
              "border-semi-color-primary-light-active",
            ].join(" ")}
          >
            New
          </Button>
        </Nav.Header>
        {items.map(({ key, text, icon }) => (
          <NavItem
            itemKey={key}
            text={msg(text)}
            icon={icon}
            className={
              selected[0] == key
                ? "text-semi-color-primary-hover font-bold bg-semi-color-primary-light-hover"
                : undefined
            }
          />
        ))}
      </Nav>
    </nav>
  );
};

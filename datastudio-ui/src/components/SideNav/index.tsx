import { FC, ReactNode, useState } from "react";
import { Button, Nav } from "@douyinfe/semi-ui-19";
import { IconPlus } from "@douyinfe/semi-icons";
import { withDefaultProps } from "@utils/component.tsx";
import { useGlobal } from "@utils/context.tsx";

const NavItem = withDefaultProps(Nav.Item, {
  className: [
    "leading-4 py-1.5 rounded mb-0.5 font-normal [&_.semi-icon]:text-base",
    "[&_.semi-navigation-item-icon]:min-w-4 [&_.semi-navigation-item-icon]:mr-2",
    "hover:bg-semi-color-primary-light-hover hover:text-semi-color-primary-hover [&_.semi-navigation-item-icon]:text-inherit",
  ].join(" "),
});

interface SideNavProps {
  isOpen: boolean;
  items?: SideNavItemProps[];
  onItemClick?: (path: SideNavItemProps["path"]) => void;
  defaultSelected?: string;
}
interface SideNavItemProps {
  text: string;
  path: string;
  icon: ReactNode;
}
export const SideNav: FC<SideNavProps> = ({
  isOpen = true,
  items,
  onItemClick,
  defaultSelected = "",
}) => {
  const { msg } = useGlobal();
  const [selected, setSelected] = useState<(string | number)[]>([
    defaultSelected,
  ]);
  return (
    <nav
      className={[
        "px-3 w-50 transition-all",
        !isOpen && "w-0 px-0 pl-2 overflow-hidden",
      ].join(" ")}
    >
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
            {msg("side_new")}
          </Button>
        </Nav.Header>
        {items?.map(({ path, text, icon }) => (
          <NavItem
            key={path}
            itemKey={path}
            text={text}
            icon={icon}
            onClick={() => onItemClick && onItemClick(path)}
            className={
              selected[0] == path
                ? "text-semi-color-primary-hover font-bold bg-semi-color-primary-light-hover"
                : undefined
            }
          />
        ))}
      </Nav>
    </nav>
  );
};

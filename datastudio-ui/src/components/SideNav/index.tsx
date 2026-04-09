import { FC, ReactNode, useState } from "react";
import { Button, Nav, Space } from "@douyinfe/semi-ui-19";
import { IconChevronRight, IconPlus } from "@douyinfe/semi-icons";
import { withDefaultProps } from "@utils/component.tsx";
import { useGlobal } from "@utils/context.tsx";

const NavItem = withDefaultProps(Nav.Item, {
  className: [
    "h-fit leading-4 py-1.5 rounded mb-0.5 mt-0 font-normal [&_.semi-icon]:text-base",
    "[&_.semi-navigation-item-icon]:min-w-4 [&_.semi-navigation-item-icon]:mr-2",
    "hover:bg-semi-color-primary-light-hover hover:text-semi-color-primary-hover [&_.semi-navigation-item-icon]:text-inherit",
  ].join(" "),
});

interface SideNavProps {
  isOpen: boolean;
  items?: SideNavItemProps[];
  onItemClick?: (path: SideNavItemProps["path"]) => void;
}
interface SideNavItemProps {
  group?: string;
  text: string;
  path: string;
  icon: ReactNode;
}
export const SideNav: FC<SideNavProps> = ({
  isOpen = true,
  items,
  onItemClick,
}) => {
  const { msg, location } = useGlobal();

  const groups = Object.groupBy(items!, x => x.group || "");
  const [openedKeys, setOpenedKeys] = useState<(string | number)[]>(
    Object.keys(groups).filter(x => x !== ""),
  );
  return (
    <nav
      className={[
        "transition-all overflow-hidden ",
        isOpen ? "px-3 w-50" : "w-0 px-0 pl-2",
      ].join(" ")}
    >
      <Nav
        className={[
          "w-full border-none p-0 bg-transparent",
          // sub nav title styles
          "[&_.semi-navigation-sub-title]:h-fit [&_.semi-navigation-sub-title]:py-1.5 [&_.semi-navigation-sub-title]:font-normal",
          "[&_.semi-navigation-sub-title]:leading-4 [&_.semi-navigation-sub-title]:mb-0.5",
          "hover:[&_.semi-navigation-sub-title]:text-semi-color-primary-hover hover:[&_.semi-navigation-sub-title]:bg-semi-color-primary-light-hover",
          "[&_.semi-navigation-sub-title_.semi-navigation-item-icon]:opacity-0 [&_.semi-navigation-item-sub]:mb-0",
        ].join(" ")}
        openKeys={openedKeys}
        onOpenChange={({ itemKey, isOpen }) => {
          if (!itemKey) return;
          setOpenedKeys(pre => {
            const filtered = pre.filter(x => x !== itemKey);
            if (isOpen) return [...filtered, itemKey];
            else return filtered;
          });
        }}
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
            {msg("side.new")}
          </Button>
        </Nav.Header>
        {Object.entries(groups).map(([key, value]) => {
          const items = value?.map(({ path, text, icon }) => (
            <NavItem
              key={path}
              itemKey={path}
              text={text}
              icon={icon}
              onClick={() => onItemClick && onItemClick(path)}
              className={
                location.pathname.split("/")[1] == path
                  ? "text-semi-color-primary-hover font-bold bg-semi-color-primary-light-hover"
                  : "text-semi-color-text-1"
              }
            />
          ));
          if (key)
            return (
              <Nav.Sub
                key={key}
                itemKey={key}
                text={
                  <Space
                    className={
                      "text-semi-color-text-2 [.semi-navigation-sub-title:hover_&]:text-semi-color-primary-hover"
                    }
                  >
                    <span>{key}</span>
                    <IconChevronRight
                      size={"small"}
                      className={[
                        "transition-[transform,opacity] duration-300 [.semi-navigation-sub-title:hover_&]:opacity-100",
                        openedKeys.includes(key) ? "rotate-90 opacity-0" : "",
                      ].join(" ")}
                    />
                  </Space>
                }
              >
                {items}
              </Nav.Sub>
            );
          else return items;
        })}
      </Nav>
    </nav>
  );
};

import { FC, ReactNode, useMemo } from "react";
import { Button, Nav, Space } from "@douyinfe/semi-ui";
import { IconChevronRight, IconPlus } from "@douyinfe/semi-icons";
import { withDefaultProps } from "@utils/component.tsx";
import { useGlobal } from "@utils/context.tsx";
import { LocaleKey } from "@i18n/locale.ts";

const NavItem = withDefaultProps(Nav.Item, {
  className: [
    "h-fit leading-4 py-1.5 rounded mb-0.5 mt-0 font-normal [&_.semi-icon]:text-base",
    "text-semi-color-text-1 [&.semi-navigation-item-selected]:text-semi-color-primary-hover",
    "[&.semi-navigation-item-selected]:font-bold [&.semi-navigation-item-selected]:bg-semi-color-primary-light-hover",
    "[&_.semi-navigation-item-icon]:min-w-4 [&_.semi-navigation-item-icon]:mr-2",
    "hover:bg-semi-color-primary-light-hover hover:text-semi-color-primary-hover [&_.semi-navigation-item-icon]:text-inherit",
  ].join(" "),
});

interface SideNavProps {
  isOpen: boolean;
  items?: SideNavItem[];
  onItemClick?: (path: SideNavItem["path"]) => void;
}
export interface SideNavItem {
  group?: string;
  name: LocaleKey;
  path: string;
  icon?: ReactNode;
  order: number;
}
export const SideNav: FC<SideNavProps> = ({
  isOpen = true,
  items = [],
  onItemClick,
}) => {
  const { msg, location } = useGlobal();
  const { defaultOpenKeys, entries } = useMemo(() => {
    const groups = Object.groupBy(items, x => x.group || "");
    const defaultOpenKeys = Object.keys(groups).filter(x => x !== "");
    const entries = Object.entries(groups).sort(
      ([_1, x], [_2, y]) =>
        Math.min(...x!.map(i => i.order)) - Math.min(...y!.map(i => i.order)),
    );
    return { defaultOpenKeys, entries };
  }, [items]);

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
        defaultOpenKeys={defaultOpenKeys}
        defaultSelectedKeys={[
          items.findLast(item => location.pathname.startsWith(item.path))!.path,
        ]}
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
        {entries.map(([group, item]) => {
          const subitems = item?.map(({ path, name, icon }) => (
            <NavItem
              key={path}
              itemKey={path}
              text={msg(name)}
              icon={icon}
              onClick={() => onItemClick && onItemClick(path)}
            />
          ));
          if (group)
            return (
              <Nav.Sub
                key={group}
                itemKey={group}
                text={
                  <Space
                    className={
                      "text-semi-color-text-2 [.semi-navigation-sub-title:hover_&]:text-semi-color-primary-hover"
                    }
                  >
                    <span>{msg(group)}</span>
                    <IconChevronRight
                      size={"small"}
                      className={[
                        "opacity-0 transition-[transform,opacity] duration-300 [.semi-navigation-sub-title:hover_&]:opacity-100",
                        "[.semi-navigation-sub-title[aria-expanded=true]_&]:rotate-90 [.semi-navigation-sub-title[aria-expanded=false]_&]:opacity-100",
                      ].join(" ")}
                    />
                  </Space>
                }
              >
                {subitems}
              </Nav.Sub>
            );
          else return subitems;
        })}
      </Nav>
    </nav>
  );
};

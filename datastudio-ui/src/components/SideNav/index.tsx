import { FC } from "react";
import { Button, Nav } from "@douyinfe/semi-ui-19";
import { IconHomeStroked, IconPlus } from "@douyinfe/semi-icons";
import { withDefaultProps } from "@utils/component.tsx";
import { NavItemProps } from "@douyinfe/semi-ui-19/lib/es/navigation";

const NavItem = withDefaultProps<NavItemProps>(Nav.Item, {
  className: [
    "leading-4 py-1.5 rounded mb-0.5 hover:",
    "[&_.semi-navigation-item-icon]:min-w-4 [&_.semi-navigation-item-icon]:mr-2",
  ].join(" "),
});
export const SideNav: FC = () => {
  return (
    <nav className={"px-3 w-50"}>
      <Nav className={"w-full border-none p-0 bg-transparent"} siz>
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
        <NavItem
          itemKey={"union"}
          text={"Home"}
          icon={<IconHomeStroked size={"default"} />}
        />
      </Nav>
    </nav>
  );
};

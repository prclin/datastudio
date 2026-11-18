import { FC, useEffect } from "react";
import { Outlet, UIMatch, useMatches } from "react-router";
import { Tabs, Typography } from "@douyinfe/semi-ui";
import { Handle, ViewObject, views } from "@/routes";
import { LocaleKey } from "@i18n/locale.ts";
import { useGlobal } from "@utils/context.tsx";

const { TabPane } = Tabs;

const { children = [] }: Pick<ViewObject, "children"> =
  views.find(view => view.path === "/runtime") ?? {};

interface RuntimeTab {
  path: string;
  name: LocaleKey;
  desc?: LocaleKey;
}

/** tab 与标题都由子路由的 handle 提供,文案与侧边栏、面包屑同源,详情页不算 tab */
const tabs = children.flatMap(({ path, handle }): RuntimeTab[] => {
  const { name, desc, detail } = (handle ?? {}) as Handle;
  return path && name && !detail
    ? [{ path: `/runtime/${path}`, name, desc }]
    : [];
});

export const Component: FC = () => {
  const { msg, navigate, location } = useGlobal();
  const detail = (useMatches() as UIMatch<unknown, Handle>[]).at(-1)?.handle
    ?.detail;
  const active = tabs.findLast(tab => location.pathname.startsWith(tab.path));
  //跳转的那一帧先按第一个子 view 出标题,免得闪空
  const current = active ?? tabs[0];

  //只访问 /runtime 时落到第一个子 view
  useEffect(() => {
    if (!active && tabs.length) void navigate(tabs[0].path, { replace: true });
  }, [active, navigate]);

  //详情页自成一页,标题与 tab 由自己给
  if (detail) return <Outlet />;

  return (
    <div className={"h-full p-2 flex flex-col space-y-4 bg-semi-color-bg-0"}>
      {current && (
        <>
          <Typography.Title heading={3}>{msg(current.name)}</Typography.Title>
          {current.desc && (
            <Typography.Text type={"secondary"}>
              {msg(current.desc)}
            </Typography.Text>
          )}
        </>
      )}
      <Tabs
        type={"line"}
        activeKey={active?.path}
        onChange={path => navigate(path)}
      >
        {tabs.map(({ path, name }) => (
          <TabPane key={path} tab={msg(name)} itemKey={path} />
        ))}
      </Tabs>
      <div className={"flex-1 overflow-hidden"}>
        <Outlet />
      </div>
    </div>
  );
};
Component.displayName = "Runtime";

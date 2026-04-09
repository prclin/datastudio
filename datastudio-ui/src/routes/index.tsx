import { createBrowserRouter, RouteObject } from "react-router";
import { App } from "@/App.tsx";
import { IconTabsStroked } from "@douyinfe/semi-icons";
import { View } from "@/react-env";
//动态获取views下的一级导航
const context = import.meta.webpackContext("@views/", {
  regExp: /index\.tsx$/,
});

const keyToPath = (key: string, start: number = 1, end: number = -1) => {
  return key
    .split("/")
    .slice(start, end)
    .map(x =>
      x
        .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
        .replace(/([A-Z])([A-Z][a-z])/g, "$1-$2")
        .toLowerCase(),
    )
    .join("/");
};
export const views: View[] = context
  .keys()
  .map(key => {
    const module = context(key) as View;
    console.log(module);
    let path = module.path;
    if (path === undefined)
      path = module.nested ? keyToPath(key, 2) : keyToPath(key);
    return {
      key,
      group: module.group,
      order: module.order || Number.MAX_VALUE,
      text: module.text,
      icon: module.icon || <IconTabsStroked />,
      path: path,
      default: module.default,
      nested: module.nested,
      level: key.split("/").slice(1, -1).length,
    };
  })
  .reduce((acc, view) => {
    let group = view.key.split("/").length - 3;
    if (!view.nested) group = 0;

    (acc[group] ||= []).push(view);
    return acc;
  }, [] as View[][])
  .reduceRight((acc, views) => {
    const newAcc = [] as View[];
    for (const view of views) {
      view.children = acc.filter(x => {
        const keys = x.key.split("/");
        return view.key.split("/").every(y => keys.includes(y));
      });
      newAcc.push(view);
    }
    return newAcc.sort((x, y) => x.order - y.order);
  }, [] as View[])
  .sort((x, y) => x.order - y.order);

const mapRoute = (views?: View[]): RouteObject[] => {
  if (!views) return [];
  return views.map(x => ({
    path: x.path,
    Component: x.default,
    children: mapRoute(x.children),
  }));
};
export const routes = createBrowserRouter([
  {
    path: "/",
    Component: App,
    children: mapRoute(views),
  },
]);

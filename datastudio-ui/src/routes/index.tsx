import { createBrowserRouter } from "react-router";
import { App } from "@/App.tsx";
import { IconTabsStroked } from "@douyinfe/semi-icons";
import { View } from "@/react-env";
//动态获取views下的一级导航
const modules = import.meta.webpackContext("../views/");
const viewObj: View[] = modules
  .keys()
  .map(x => {
    const module = modules(x) as View;
    return {
      order: module.order || Number.MAX_VALUE,
      text: module.text,
      icon: module.icon || <IconTabsStroked />,
      path: module.path,
      default: module.default,
    };
  })
  .sort((x, y) => x.order - y.order);
export const views = [...new Map(viewObj.map(x => [x.text, x])).values()];

export const routes = createBrowserRouter([
  {
    path: "/",
    Component: App,
    children: views.map(x => ({
      path: x.path,
      Component: x.default,
    })),
  },
]);

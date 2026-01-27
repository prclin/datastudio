import { createBrowserRouter } from "react-router";
import { App } from "../App.tsx";
import { IconTabsStroked } from "@douyinfe/semi-icons";

//动态获取views下的一级导航
const modules = import.meta.webpackContext("../views/");
const viewObj = modules
  .keys()
  .map(x => ({
    order: modules(x).order || Number.MAX_VALUE,
    name: x.split("/")[1],
    icon: modules(x).icon || <IconTabsStroked />,
    component: modules(x).default,
  }))
  .sort((x, y) => x.order - y.order);
export const views = [...new Map(viewObj.map(x => [x.name, x])).values()];

export const routes = createBrowserRouter([
  {
    path: "/",
    Component: App,
    children: views.map(x => ({
      path: x.name,
      Component: x.component,
    })),
  },
]);

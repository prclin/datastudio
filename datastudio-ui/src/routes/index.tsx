import { createBrowserRouter, RouteObject } from "react-router";
import { App } from "@/App.tsx";
import { IconHomeStroked } from "@douyinfe/semi-icons";
import { ReactNode } from "react";
import { LocaleKey } from "@i18n/locale.ts";
import { IconDatastudio } from "@icons/IconDatastudio.tsx";

export interface Handle {
  name?: LocaleKey;
  icon?: ReactNode;
  group?: LocaleKey;
}
export type ViewObject = RouteObject & {
  handle?: Handle;
  children?: ViewObject[];
};

export const views: Array<ViewObject> = [
  {
    path: "/",
    handle: {
      name: "views.home",
      icon: <IconHomeStroked />,
    },
    lazy: () => import("@views/Home/index.tsx"),
  },
  {
    path: "/studio",
    handle: {
      name: "views.studio",
      icon: <IconDatastudio />,
    },
    lazy: () => import("@views/Studio/index.tsx"),
  },
  {
    path: "/engine-instance",
    handle: {
      name: "views.engine-instance",
      icon: <IconDatastudio />,
      group: "views.group.infra",
    },
    lazy: () => import("@views/EngineInstance/index.tsx"),
  },
  {
    path: "/engine-config",
    handle: {
      name: "views.engine-config",
      icon: <IconDatastudio />,
      group: "views.group.infra",
    },
    lazy: () => import("@views/EngineConfig/index.tsx"),
    children: [
      {
        path: "sdd",
        element: <div>asd</div>,
      },
    ],
  },
  {
    path: "/task",
    handle: {
      name: "views.task",
      icon: <IconDatastudio />,
      group: "views.group.ops",
    },
    lazy: () => import("@views/Task/index.tsx"),
  },
];

export const routes = createBrowserRouter([
  {
    Component: App,
    children: views,
  },
]);

import { createBrowserRouter, RouteObject } from "react-router";
import { App } from "@/App.tsx";
import { IconHomeStroked } from "@douyinfe/semi-icons";
import { ReactNode } from "react";
import { LocaleKey } from "@i18n/locale.ts";
import { IconDatastudio } from "@icons/IconDatastudio.tsx";

export interface Handle {
  name?: LocaleKey;
  desc?: LocaleKey;
  icon?: ReactNode;
  group?: LocaleKey;
  /** 详情页不出现在 runtime 的 tab 里,也不套 runtime 的标题与 tab */
  detail?: boolean;
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
    path: "/runtime",
    handle: {
      name: "views.runtime",
      icon: <IconDatastudio />,
    },
    lazy: () => import("@views/Runtime/index.tsx"),
    children: [
      {
        path: "engine-instance",
        handle: {
          name: "views.runtime.engine-instance",
          desc: "views.runtime.engine-instance.desc",
          icon: <IconDatastudio />,
          group: "views.group.infra",
        },
        lazy: () => import("@views/Runtime/EngineInstance/index.tsx"),
      },
      {
        path: "engine-config",
        handle: {
          name: "views.runtime.engine-config",
          desc: "views.runtime.engine-config.desc",
          icon: <IconDatastudio />,
          group: "views.group.infra",
        },
        lazy: () => import("@views/Runtime/EngineConfig/index.tsx"),
      },
      {
        path: "engine-config/:id",
        handle: {
          name: "views.runtime.engine-config.detail",
          icon: <IconDatastudio />,
          detail: true,
        },
        lazy: () => import("@views/Runtime/EngineConfig/Detail/index.tsx"),
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

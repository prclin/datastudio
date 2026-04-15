import { createBrowserRouter, RouteObject } from "react-router";
import { App } from "@/App.tsx";
import { IconHomeStroked } from "@douyinfe/semi-icons";
import { ReactNode } from "react";
import { LocaleKey } from "@i18n/locale.ts";
import { IconDatastudio } from "@icons/IconDatastudio.tsx";
import { RouteProps } from "@douyinfe/semi-ui-19/lib/es/breadcrumb";
// //动态获取views下的一级导航
// const context = import.meta.webpackContext("@views/", {
//   regExp: /index\.tsx$/,
// });
//
// const keyToPath = (key: string, start: number = 1, end: number = -1) => {
//   return key
//     .split("/")
//     .slice(start, end)
//     .map(x =>
//       x
//         .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
//         .replace(/([A-Z])([A-Z][a-z])/g, "$1-$2")
//         .toLowerCase(),
//     )
//     .join("/");
// };
// export const viewx: View[] = context
//   .keys()
//   .map(key => {
//     const module = context(key) as View;
//     console.log(module);
//     let path = module.path;
//     if (path === undefined)
//       path = module.nested ? keyToPath(key, 2) : keyToPath(key);
//     return {
//       key,
//       group: module.group,
//       order: module.order || Number.MAX_VALUE,
//       text: module.text,
//       icon: module.icon || <IconTabsStroked />,
//       path: path,
//       default: module.default,
//       nested: module.nested,
//       level: key.split("/").slice(1, -1).length,
//     };
//   })
//   .reduce((acc, view) => {
//     let group = view.key.split("/").length - 3;
//     if (!view.nested) group = 0;
//
//     (acc[group] ||= []).push(view);
//     return acc;
//   }, [] as View[][])
//   .reduceRight((acc, views) => {
//     const newAcc = [] as View[];
//     for (const view of views) {
//       view.children = acc.filter(x => {
//         const keys = x.key.split("/");
//         return view.key.split("/").every(y => keys.includes(y));
//       });
//       newAcc.push(view);
//     }
//     return newAcc.sort((x, y) => x.order - y.order);
//   }, [] as View[])
//   .sort((x, y) => x.order - y.order);
//
// const mapRoute = (views?: View[]): RouteObject[] => {
//   if (!views) return [];
//   return views.map(x => ({
//     path: x.path,
//     Component: x.default,
//     children: mapRoute(x.children),
//   }));
// };

export type ViewObject = RouteObject & {
  order?: number;
  text?: LocaleKey;
  icon?: ReactNode;
  group?: LocaleKey;
  children?: ViewObject[];
  parent?: ViewObject;
  breads?: RouteProps[];
};

// 当path,order,text,icon都不为undefined时，将被展示在侧边导航
export type NavObject = Required<
  Pick<ViewObject, "path" | "order" | "text" | "icon">
> &
  Omit<ViewObject, "path" | "order" | "text" | "icon">;

export const views: Array<ViewObject> = [
  {
    Component: App,
    path: "/",
    order: 1,
    text: "views.home",
    icon: <IconHomeStroked />,
    children: [
      {
        index: true,
        lazy: () => import("@views/Home/index.tsx"),
      },
      {
        path: "studio",
        lazy: () => import("@views/Studio/index.tsx"),
        order: 2,
        text: "views.studio",
        icon: <IconDatastudio />,
      },
      {
        path: "engine-instance",
        order: 3,
        text: "views.engine-instance",
        icon: <IconDatastudio />,
        group: "views.group.infra",
        children: [
          {
            index: true,
            lazy: () => import("@views/EngineInstance/index.tsx"),
          },
        ],
      },
      {
        path: "cluster-config",
        order: 4,
        text: "views.cluster-config",
        icon: <IconDatastudio />,
        group: "views.group.infra",
        children: [
          { index: true, lazy: () => import("@views/ClusterConfig/index.tsx") },
          {
            path: "creation",
            lazy: () => import("@views/ClusterConfig/Creation/index.tsx"),
            text: "views.cluster-config.creation",
          },
        ],
      },
    ],
  },
];

// 将views展开
let tmpViews = views;
while (tmpViews.some(view => (view.children?.length || 0) > 0)) {
  tmpViews = tmpViews.flatMap(view => {
    const newView = { ...view, children: undefined };
    if (newView.text === "views.home" && !newView.breads) {
      (newView.breads ||= []).push({ name: newView.text, path: newView.path });
    }
    const children =
      view.children
        ?.filter(x => !x.index)
        .map((subview: ViewObject) => {
          const path = [view.path, subview.path]
            .map(x => (x === "/" ? "" : x))
            .join("/");
          const breads = [
            ...(newView.breads || []),
            {
              name: subview.text,
              path: subview.path,
            },
          ];
          return { ...subview, path, breads };
        }) || [];

    return [newView, ...children];
  });
}

export const flattedViews = tmpViews.sort(
  (x, y) => (x.path?.length || 0) - (y.path?.length || 0),
);
console.log(flattedViews);
export const navs = tmpViews.filter(
  x => x.path !== undefined && x.order && x.text && x.icon,
) as NavObject[];

export const routes = createBrowserRouter(views);

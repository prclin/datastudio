import "@/index.css";
import "@icons/iconfont.js";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router";
import { routes } from "@/routes";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <RouterProvider router={routes} />,
);

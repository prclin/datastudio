import "@/index.css";
import "@icons/iconfont.js";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router";
import { routes } from "@/routes";
import { StrictMode } from "react";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <RouterProvider router={routes} />
  </StrictMode>,
);

import "@/index.css";
import "@douyinfe/semi-ui/react19-adapter";
import "@icons/iconfont.js";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router";
import { routes } from "@/routes";
import { StrictMode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// to resolve "ResizeObserver loop completed with undelivered notifications."
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function debounce<T extends (...args: any[]) => any>(fn: T, wait = 300) {
  let timer: ReturnType<typeof setTimeout> | undefined = undefined;

  return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, wait);
  };
}

const _ = window.ResizeObserver;
window.ResizeObserver = class ResizeObserver extends _ {
  constructor(callback: ResizeObserverCallback) {
    callback = debounce(callback, 100);
    super(callback);
  }
};
const queryClient = new QueryClient();
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={routes} />
    </QueryClientProvider>
  </StrictMode>,
);

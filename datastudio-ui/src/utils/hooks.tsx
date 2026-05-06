import { useEffect, useRef, useState } from "react";

export const useControllableState = <T,>(
  defaultValue?: T,
  value?: T,
  onChange?: (v?: T) => void,
) => {
  const [inner, setInner] = useState(defaultValue);
  const isControlled = value !== undefined;

  const state = isControlled ? value : inner;

  const setState = (v?: T) => {
    if (!isControlled) {
      setInner(v);
    }
    onChange?.(v);
  };

  return [state, setState] as const;
};

export const useTableResizeRef = <T extends HTMLElement>() => {
  const ref = useRef<T>(null);
  useEffect(() => {
    const observer = new ResizeObserver(entries => {
      const pagerHeight = ref
        .current!.querySelector(".semi-table-pagination-outer")!
        .getBoundingClientRect();
      const headerHeight = ref
        .current!.querySelector(".semi-table-header")!
        .getBoundingClientRect();
      const tableBody: HTMLElement =
        ref.current!.querySelector(".semi-table-body")!;
      tableBody.style.height =
        entries[0].contentRect.height -
        headerHeight.height -
        pagerHeight.height +
        "px";
    });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return ref;
};

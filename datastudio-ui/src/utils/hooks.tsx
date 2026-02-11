import { useState } from "react";

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

import { ComponentType, ReactNode } from "react";

export function withDefaultProps<T extends object>(
  RawComponent: ComponentType,
  defaultProps: T,
) {
  return (props: T): ReactNode => {
    return <RawComponent {...defaultProps} {...props} />;
  };
}

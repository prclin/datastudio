import { ComponentType, ReactNode } from "react";

export function withDefaultProps<T extends { className?: string }>(
  RawComponent: ComponentType<T>,
  defaultProps: T,
) {
  return (props: T): ReactNode => {
    const className = [defaultProps.className, props.className]
      .join(" ")
      .trim();
    return (
      <RawComponent
        {...defaultProps}
        {...props}
        className={className === "" ? undefined : className}
      />
    );
  };
}

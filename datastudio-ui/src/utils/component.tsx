import { ComponentType, ReactNode } from "react";

export function withDefaultProps<T extends { className?: string }>(
  RawComponent: ComponentType<T> & { elementType?: string },
  defaultProps: T,
) {
  const Component = (props: T): ReactNode => {
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
  Component.elementType = RawComponent.elementType;
  return Component;
}

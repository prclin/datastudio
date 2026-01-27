import { FC } from "react";

export const IconFont: FC<{ symbol: string }> = ({ symbol }) => {
  return (
    <svg aria-hidden="true" width="1em" height="1em">
      <use xlinkHref={`#${symbol}`}></use>
    </svg>
  );
};

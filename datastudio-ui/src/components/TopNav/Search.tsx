import { FC, HTMLProps, useRef } from "react";
import { Input } from "@douyinfe/semi-ui-19";
import { IconSearch } from "@douyinfe/semi-icons";
import { useGlobal } from "@utils/context.tsx";

export const Search: FC<HTMLProps<HTMLDivElement>> = props => {
  const { msg } = useGlobal();
  const search = useRef<HTMLInputElement>({} as HTMLInputElement);
  return (
    <div {...props} className={["relative", props.className].join(" ")}>
      <Input
        showClear
        prefix={<IconSearch />}
        placeholder={msg("top_search")}
        className={[
          "bg-semi-color-bg-0 z-10",
          "border-transparent hover:border-semi-color-primary",
        ].join(" ")}
        ref={search}
      />
      <div
        className={"absolute w-full top-8 bg-semi-color-bg-0"}
        onMouseDown={e => {
          e.preventDefault();
          search.current.focus();
        }}
      ></div>
    </div>
  );
};

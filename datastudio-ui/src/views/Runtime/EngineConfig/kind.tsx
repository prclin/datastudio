import { FC } from "react";
import { Tag } from "@douyinfe/semi-ui";
import { IconApacheFlink } from "@icons/IconApacheFlink.tsx";
import { IconApacheSpark } from "@icons/IconApacheSpark.tsx";
import { EngineKind } from "@models/engine-config.ts";

interface KindMeta {
  value: EngineKind;
  label: string;
  color: "red" | "purple";
  icon: FC<{ className?: string }>;
}

/** runtime.engine_config.kind 的取值与展示,筛选/表单/列表/详情共用 */
export const kinds: KindMeta[] = [
  { value: 0, label: "spark", color: "red", icon: IconApacheSpark },
  { value: 1, label: "flink", color: "purple", icon: IconApacheFlink },
];

export const KindTag: FC<{ kind: EngineKind }> = ({ kind }) => {
  const {
    label,
    color,
    icon: Icon,
  } = kinds.find(x => x.value === kind) ?? kinds[0];
  return (
    <Tag color={color} prefixIcon={<Icon />}>
      {label}
    </Tag>
  );
};

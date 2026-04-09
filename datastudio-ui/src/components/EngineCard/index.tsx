import { FC } from "react";
import { Card, Tag } from "@douyinfe/semi-ui-19";
import { IconApacheFlink } from "@icons/IconApacheFlink.tsx";

export const EngineCard: FC = () => {
  return (
    <Card
      style={{ maxWidth: 360 }}
      className={"[&>div]:p-2 [&_.semi-card-header-wrapper]:items-center"}
      shadows={"hover"}
      title={
        <Card.Meta
          title={"Spark cluster 2"}
          avatar={<IconApacheFlink className={"text-4xl"} />}
          description={"version: 1.8.0"}
        />
      }
      headerExtraContent={<Tag color={"green"}>running</Tag>}
    >
      {" "}
    </Card>
  );
};

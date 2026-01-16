import { FC } from "react";
import { List, Typography } from "@douyinfe/semi-ui-19";
import { IconInfoCircle } from "@douyinfe/semi-icons";

const { Title, Text } = Typography;

const data = ["a阿斯大速度sd", "as阿斯打死的各个哥d", "阿斯顿过河村vxf"];

export const Messages: FC = () => {
  return (
    <div className={"flex flex-col"}>
      <Title heading={6} className={"border-b pb-4 border-semi-color-border"}>
        消息
      </Title>
      <List
        className={"flex-1"}
        dataSource={data}
        renderItem={item => {
          return (
            <List.Item>
              <Text icon={<IconInfoCircle />} ellipsis={{ showTooltip: true }}>
                {item}
              </Text>
            </List.Item>
          );
        }}
      />
    </div>
  );
};
import { FC, useState } from "react";
import {
  Button,
  Empty,
  Space,
  Table,
  Typography,
  Upload,
} from "@douyinfe/semi-ui";
import { IconCloudUploadStroked } from "@douyinfe/semi-icons";
import { useQueryClient } from "@tanstack/react-query";
import { FileItem } from "@douyinfe/semi-ui/lib/es/upload";
import { ArtifactItem, EngineConfigItem } from "@models/engine-config.ts";
import {
  artifactBatchSize,
  artifactsKey,
  useArtifacts,
  useArtifactsUpload,
} from "@services/engine-config.ts";
import { formatBytes, formatDateTime } from "@utils/format.ts";

const { Column } = Table;

/** 文件先留在本地,确认后按后端单次上限分批串行上传 */
export const ConfigArtifacts: FC<{ record: EngineConfigItem }> = ({
  record,
}) => {
  const queryClient = useQueryClient();
  const [selected, setSelected] = useState<FileItem[]>([]);
  const { data, isFetching } = useArtifacts(record.id, !!record.dstFs);
  const upload = useArtifactsUpload();
  const artifacts = data?.data ?? [];
  const batches = Math.ceil(selected.length / artifactBatchSize);

  const submit = () =>
    upload.mutate(
      {
        id: record.id,
        artifacts: selected.flatMap(({ fileInstance }) => fileInstance ?? []),
      },
      {
        onSuccess: async () => {
          setSelected([]);
          await queryClient.invalidateQueries({
            queryKey: [artifactsKey, record.id],
          });
        },
      },
    );

  if (!record.dstFs)
    return (
      <>
        <Typography.Title className={"mt-6"} heading={6}>
          Artifacts
        </Typography.Title>
        <Typography.Text type={"tertiary"}>
          Target FS is not set, upload is unavailable.
        </Typography.Text>
      </>
    );

  return (
    <>
      <Typography.Title className={"mt-6"} heading={6}>
        Artifacts
      </Typography.Title>
      <Upload
        multiple
        action={""}
        fileList={selected}
        uploadTrigger={"custom"}
        onChange={({ fileList }) => setSelected(fileList)}
      >
        <Button size={"small"} icon={<IconCloudUploadStroked />}>
          Select files
        </Button>
      </Upload>
      {!!selected.length && (
        <Space className={"mt-2"} align={"center"}>
          <Button
            theme={"solid"}
            size={"small"}
            loading={upload.isPending}
            onClick={submit}
          >
            Upload
          </Button>
          <Typography.Text
            type={"tertiary"}
          >{`${selected.length} file(s) in ${batches} batch(es)`}</Typography.Text>
        </Space>
      )}
      {artifacts.length ? (
        <Table<ArtifactItem>
          size={"small"}
          rowKey={"path"}
          pagination={false}
          loading={isFetching}
          dataSource={artifacts}
          className={"mt-2"}
        >
          <Column title="NAME" dataIndex="name" />
          <Column
            title="SIZE"
            dataIndex="size"
            width={90}
            render={(size: number) => formatBytes(size)}
          />
          <Column
            title="MODIFY TIME"
            dataIndex="modifyTime"
            width={160}
            render={(time?: string) => formatDateTime(time)}
          />
        </Table>
      ) : (
        <Empty description={"No artifact"} />
      )}
    </>
  );
};

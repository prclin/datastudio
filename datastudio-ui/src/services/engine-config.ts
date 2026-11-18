import {
  ArtifactItem,
  CreateConfigCommand,
  EngineConfigItem,
  EngineConfigPageQuery,
  UpdateConfigCommand,
  UploadArtifactsCommand,
} from "@models/engine-config.ts";
import type { Page, Response } from "@models/common";
import { newAxios, newMutation, newQuery } from "@services/common.ts";
import { useMutation, useQuery } from "@tanstack/react-query";

const server = newAxios(process.env.API_BASE, "/api");

/** 列表 query 的 key,创建成功后按前缀失效 */
export const configPageKey = "engine-config-page";

/** 详情 query 的 key,按配置 id 区分 */
export const configKey = "engine-config-detail";

/** 产物列表 query 的 key,上传成功后按配置 id 失效 */
export const artifactsKey = "engine-config-artifacts";

/** 后端单次请求最多接收 10 个文件,超出按批次串行提交 */
export const artifactBatchSize = 10;

/** 配置与产物接口都只按 id 定位,与 RuntimeController 的 @PathVariable 一致 */
const configUrl = (id: string) => `runtime/engine-config/${id}`;

const artifactsUrl = (id: string) => `${configUrl(id)}/artifacts`;

export const useConfigPage = newQuery<
  EngineConfigPageQuery,
  Page<EngineConfigItem>
>(server, "POST", "runtime/engine-config/page", configPageKey);

/** 路径里有 id,newQuery 的固定 url 表达不了,单独写 */
export const useConfig = (id: string) =>
  useQuery({
    queryKey: [configKey, id],
    queryFn: () =>
      server
        .get<Response<EngineConfigItem>>(configUrl(id))
        .then(res => res.data),
  });

export const useFileSystems = newQuery<void, string[]>(
  server,
  "GET",
  "runtime/filesystems",
  "engine-config-filesystems",
);

/** 后端按配置的 dst_fs 定位文件系统,故未配置目标文件系统的配置不查询 */
export const useArtifacts = (id: string, enabled: boolean) =>
  useQuery({
    queryKey: [artifactsKey, id],
    queryFn: () =>
      server
        .get<Response<ArtifactItem[]>>(artifactsUrl(id))
        .then(res => res.data),
    enabled,
  });

export const useArtifactsUpload = () =>
  useMutation({
    mutationFn: async ({ id, artifacts }: UploadArtifactsCommand) => {
      const url = artifactsUrl(id);
      const total = artifacts.length;
      for (let offset = 0; offset < total; offset += artifactBatchSize) {
        const form = new FormData();
        artifacts
          .slice(offset, offset + artifactBatchSize)
          .forEach(file => form.append("artifacts", file, file.name));
        await server.postForm<Response<void>>(url, form);
      }
    },
  });

export const useNewConfig = newMutation<CreateConfigCommand, void>(
  server,
  "POST",
  "runtime/engine-config",
);

/** 路径里有 id,newMutation 的固定 url 表达不了,单独写 */
export const useUpdateConfig = () =>
  useMutation({
    mutationFn: ({ id, ...command }: UpdateConfigCommand) =>
      server.put<Response<void>>(configUrl(id), command),
  });

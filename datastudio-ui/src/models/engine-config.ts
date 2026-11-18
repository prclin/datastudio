/** 引擎类型:0-spark;1-flink,与 runtime.engine_config.kind 一致 */
export type EngineKind = 0 | 1;

export interface EngineConfigItem {
  id: string;
  name: string;
  kind: EngineKind;
  configs?: Record<string, string>;
  dstFs?: string;
  createTime?: string;
  updateTime?: string;
}

export interface CreateConfigCommand {
  name: string;
  kind: EngineKind;
  configs?: Record<string, string>;
  dstFs?: string;
}

/** 后端 PUT 只改 name 与 configs,kind/dstFs/artifactsHome 保持原值 */
export interface UpdateConfigCommand {
  id: string;
  name: string;
  configs: Record<string, string>;
}

/** page/size 为后端 Pagination 必填项,从第 1 页开始 */
export interface EngineConfigPageQuery {
  name?: string;
  kind?: EngineKind;
  page: number;
  size: number;
}

/** 产物文件,对应 EngineConfigDTO.ArtifactItem */
export interface ArtifactItem {
  name: string;
  path: string;
  size: number;
  modifyTime?: string;
}

/** 文件系统由后端按配置的 dst_fs 解析,前端只传配置 id */
export interface UploadArtifactsCommand {
  id: string;
  artifacts: File[];
}

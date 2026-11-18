/** 后端时间为 ISO_LOCAL_DATE_TIME,展示时去掉分隔符与亚秒部分 */
export const formatDateTime = (value?: string): string =>
  value ? value.replace("T", " ").slice(0, 19) : "-";

/** 产物大小为字节数,按 1024 进制换算到合适的单位 */
export const formatBytes = (bytes: number): string => {
  const units = ["B", "KB", "MB", "GB", "TB"];
  const index = Math.min(
    Math.floor(Math.log(Math.max(bytes, 1)) / Math.log(1024)),
    units.length - 1,
  );
  return `${(bytes / 1024 ** index).toFixed(index ? 1 : 0)} ${units[index]}`;
};

# DataStudio DDD 规则

记录 datastudio-server 的分层与命名约定，后续新增规则按序号追加。

## 1. 命名

### 1.1 repository 的查询方法以 query 开头

- 领域 repository 与 application 层 repository 的读取方法统一使用 `query` 前缀，例如 `queryPage`、`queryById`；不使用 `find`、`get`、`select`。
- 写入方法使用 `save`，删除方法使用 `delete`。
- mapper 不在此约束内，沿用 MyBatis-Plus 自带的 `select`、`insert`、`update`、`delete`。

## 2. repository 边界

### 2.1 领域 repository 只承载聚合整体操作

- `domain.<上下文>.repository` 中的接口只负责加载与保存完整聚合，读取到的必须是一个状态自洽的聚合整体，避免聚合只被部分加载后被就地修改。
- 存在性判断、单个字段读取这类非聚合操作不下沉到领域 repository：由 application 层直接注入 mapper 完成，或在 `application.repository` 定义 application 层 repository 并由 infrastructure 实现。
- 例：上传引擎产物只需确认配置存在并取其产物目录，application 层用 `EngineConfigMapper#selectById` 取 PO 即可，不给 `EngineConfigRepository` 增加按 id 加载聚合的方法。
- 只修改聚合的部分字段时，同样先 `queryById` 整体加载聚合，在聚合上改写允许修改的字段再 `update` 整体保存，其余字段保持库中原值；不为单个字段在 mapper 上写局部更新语句。
- 例：修改引擎配置只允许改名称与配置项，`updateEngineConfig` 加载聚合后只重写 `name`、`configs`、`updateTime`，`kind`、`dstFs`、`artifactsHome` 沿用原值。

## 3. 派生状态

### 3.1 依赖上下文推导出的状态在创建时落库，后续以库中值为准

- 创建时由请求上下文（调用者组织、时间等）推导出来的字段，计算完即持久化，后续流程读取落库值，不按当前请求上下文重新推导。
- 例：`runtime.engine_config.artifacts_home` 在创建时用创建者组织 id 拼出目录并保存，上传产物写入该目录；若上传时再按调用者组织推导，同一份配置会因上传者所属组织不同而写到不同位置。

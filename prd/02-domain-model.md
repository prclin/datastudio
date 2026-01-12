# DataStudio 领域模型

## 1. 总体说明

本文档以领域驱动设计方式定义 DataStudio 的核心领域模型，给出各域的聚合、核心对象、关键命令与领域事件，用于统一业务语义与边界。

## 2. 集群管理域

### 2.1 聚合

- **Cluster**

### 2.2 核心对象

- **实体**
  - Cluster：集群本体（Flink/Spark），包含在线交互入口与 Web 入口。
- **值对象**
  - ClusterType：Flink / Spark
  - WebEndpoint：Web 入口（JobManager/Application）
  - ClusterStatus：可用/不可用（概念状态）

### 2.3 关键命令

- RegisterCluster：注册集群
- UpdateCluster：更新集群信息
- RemoveCluster：移除集群
- CheckCluster：检查可用性（概念能力）

### 2.4 领域事件

- ClusterRegistered
- ClusterUpdated
- ClusterRemoved
- ClusterStatusChanged

## 3. Notebook 域

### 3.1 聚合

- **Notebook**

### 3.2 核心对象

- **实体**
  - Notebook：文档本体
  - Cell：单元（属于 Notebook）
- **值对象**
  - NotebookFormat：Jupyter Notebook（ipynb）
  - CellType：SQL / Markdown
  - ParameterDefinition：参数定义
  - ParameterValueSet：一次运行的参数取值集合（概念）

### 3.3 关键命令

- CreateNotebook
- UpdateNotebookContent（编辑单元内容与顺序）
- DefineParameters（定义参数）
- BindDefaultCluster（绑定默认集群）

### 3.4 领域事件

- NotebookCreated
- NotebookUpdated
- ParametersDefined
- NotebookClusterBound

## 4. 交互执行域

### 4.1 聚合

- **InteractiveSession**
- **InteractiveRun**

### 4.2 核心对象

- **实体**
  - InteractiveSession：在线交互会话（面向开发态）
  - InteractiveRun：一次交互运行（对外表现为“运行一个单元/一段 SQL”）
- **值对象**
  - EngineType：Flink / Spark
  - InteractiveEndpoint：在线交互入口
  - InteractionProtocol：Jupyter Kernel 协议
  - RunStatus：Running / Succeeded / Failed / Canceled（概念状态）
  - RunResult：结果（概念，包括结果集或错误信息）

### 4.3 关键命令

- OpenSession：打开/获取会话
- CloseSession：关闭会话
- ExecuteInteractively：执行（交互式）
- CancelInteractiveRun：取消执行

### 4.4 领域事件

- SessionOpened
- SessionClosed
- InteractiveRunStarted
- InteractiveRunSucceeded
- InteractiveRunFailed
- InteractiveRunCanceled

## 5. 智能开发域

### 5.1 聚合

- **SqlDocument**

### 5.2 核心对象

- **实体**
  - SqlDocument：编辑期 SQL 文档（面向 LSP 能力承载）
- **值对象**
  - SqlDialect：FlinkSQL / SparkSQL
  - Diagnostic：诊断信息（错误/警告）
  - CompletionItem：补全项

### 5.3 关键命令

- ValidateSql：校验 SQL
- ProvideCompletions：提供补全

### 5.4 领域事件

- SqlValidated
- CompletionsProvided

## 6. 生产提交域

### 6.1 聚合

- **Submission**

### 6.2 核心对象

- **实体**
  - Submission：一次生产提交（将开发成果提交为可运行任务）
- **值对象**
  - SubmissionStatus：Submitted / Running / Failed / Canceled（概念状态）
  - TrackingLink：任务追踪入口（Web 入口的概念表达）

### 6.3 关键命令

- SubmitToProduction：生产提交
- CancelSubmission：取消任务
- QuerySubmissionStatus：查看状态

### 6.4 领域事件

- SubmittedToProduction
- SubmissionCanceled
- SubmissionStatusChanged

## 7. 元数据域

### 7.1 聚合

- **MetadataSource**

### 7.2 核心对象

- **实体**
  - MetadataSource：元数据来源（Hive Metastore）
- **值对象**
  - DatabaseName / TableName / ColumnName
  - TableSchema

### 7.3 关键命令

- ListDatabases
- ListTables
- GetTableSchema

### 7.4 领域事件

- MetadataRefreshed


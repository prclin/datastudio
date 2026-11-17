create schema if not exists runtime;
comment on schema runtime is '运行时相关表';

create table if not exists runtime.engine_config
(
    id             uuid primary key,
    name           varchar(100) not null,
    kind           smallint     not null,
    configs        jsonb,
    dst_fs         varchar(100),
    artifacts_home varchar(200),
    extra          jsonb,
    creator_id     varchar(100),
    create_time    timestamp    not null,
    update_time    timestamp
);
comment on table runtime.engine_config is '引擎配置表';
comment on column runtime.engine_config.id is 'id';
comment on column runtime.engine_config.name is '名称';
comment on column runtime.engine_config.kind is '引擎类型:0-spark;1-flink';
comment on column runtime.engine_config.configs is '配置';
comment on column runtime.engine_config.configs is '配置';
comment on column runtime.engine_config.configs is '配置';
comment on column runtime.engine_config.extra is '额外数据';
comment on column runtime.engine_config.creator_id is '创建者id';
comment on column runtime.engine_config.create_time is '创建时间';
comment on column runtime.engine_config.update_time is '更新时间';
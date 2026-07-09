create database if not exists datastudio;

create table if not exists datastudio.engine_config
(
    id          bigint not null auto_increment primary key comment 'ID',
    name        varchar(512) comment '配置名',
    kind        tinyint comment '配置类型:0-spark;1-flink',
    configs     json comment '配置',
    extra       json comment '额外数据',
    create_time datetime comment '创建时间',
    update_time datetime comment '更新时间'
);
package io.github.prclin.datastudio.server.infrastructure.persistence.po;

import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import tools.jackson.databind.node.ObjectNode;

import java.time.LocalDateTime;
import java.util.UUID;

@TableName("runtime.engine_config")
@Data
public class EngineConfigPO {
    @TableId
    private UUID id;
    private String name;
    private Byte kind;
    private ObjectNode configs;
    private String dstFs;
    private String artifactsHome;
    private String creatorId;
    private ObjectNode extra;
    private LocalDateTime createTime;
    private LocalDateTime updateTime;
}

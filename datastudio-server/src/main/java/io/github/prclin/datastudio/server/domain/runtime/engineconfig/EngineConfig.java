package io.github.prclin.datastudio.server.domain.runtime.engineconfig;

import com.github.f4b6a3.uuid.UuidCreator;
import io.github.prclin.datastuio.common.enums.BaseEnum;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import tools.jackson.databind.node.ObjectNode;

import java.time.LocalDateTime;

@Data
@Builder
public class EngineConfig {
    private String id;
    private String name;
    private Kind kind;
    private String version;
    private ObjectNode configs;
    private String dstFs;
    private String artifactsHome;
    private String creatorId;
    private ObjectNode extra;
    private LocalDateTime createTime;
    private LocalDateTime updateTime;

    public void init() {
        setId(UuidCreator.getTimeOrderedEpoch().toString());
        setCreateTime(LocalDateTime.now());
    }

    @RequiredArgsConstructor
    @Getter
    public enum Kind implements BaseEnum {
        SPARK((byte) 0), FLINK((byte) 1);
        private final byte value;
    }
}

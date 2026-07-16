package io.github.prclin.datastudio.server.domain.runtime.engineconfig;

import io.github.prclin.datastuio.common.enums.BaseEnum;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import tools.jackson.databind.node.ObjectNode;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Data
@Builder
public class EngineConfig {
    private Long id;
    private String name;
    private Kind kind;
    private String version;
    private Map<String, String> configs;
    private List<String> artifacts;
    private ObjectNode extra;
    private LocalDateTime createTime;
    private LocalDateTime updateTime;

    public void init() {
        createTime = LocalDateTime.now();
    }

    @RequiredArgsConstructor
    @Getter
    public enum Kind implements BaseEnum {
        SPARK((byte) 0), FLINK((byte) 1);
        private final byte value;
    }
}

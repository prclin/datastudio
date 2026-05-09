package io.github.prclin.datastudio.server.domain.runtime.model.entity;

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
public class Cluster {
    private Long id;
    private String name;
    private Kind kind;
    private String version;
    private Map<String, String> configs;
    private List<String> artifacts;
    private ObjectNode extra;
    private LocalDateTime createTime;
    private LocalDateTime updateTime;

    @RequiredArgsConstructor
    @Getter
    public enum Kind {
        SPARK((byte) 0), FLINK((byte) 1);
        private final byte value;
    }
}

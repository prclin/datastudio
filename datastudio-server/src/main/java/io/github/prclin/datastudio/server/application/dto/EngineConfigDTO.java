package io.github.prclin.datastudio.server.application.dto;

import java.util.Map;

public class EngineConfigDTO {
    public record ConfigItem(String id, String name, Map<String, String> configs, byte kind, String dstFs,
                             String createTime, String updateTime) {
    }

    public record ArtifactItem(String name, String path, long size, String modifyTime) {
    }
}

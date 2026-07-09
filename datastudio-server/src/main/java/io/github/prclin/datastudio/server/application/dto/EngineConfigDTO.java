package io.github.prclin.datastudio.server.application.dto;

import java.util.Map;

public class EngineConfigDTO {
    public record ConfigItem(Long id, String name, Map<String, String> configs, byte kind,
                             String createTime, String updateTime) {
    }
}

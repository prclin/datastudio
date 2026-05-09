package io.github.prclin.datastudio.server.domain.jupyter.model.entity;

import lombok.Builder;

import java.util.List;
import java.util.Map;

@Builder
public record KernelSpec(String name, Spec spec, Map<String, String> resources) {
    @Builder
    public record Spec(List<String> argv, String displayName, String language,
                       String interruptMode, Map<String, ?> metadata,
                       String kernelProtocolVersion, Map<String, String> env) {
    }
}

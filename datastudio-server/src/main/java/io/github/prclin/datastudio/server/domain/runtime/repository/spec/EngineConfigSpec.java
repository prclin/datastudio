package io.github.prclin.datastudio.server.domain.runtime.repository.spec;

import lombok.Builder;

public abstract class EngineConfigSpec {
    @Builder
    public record EngineConfigPageSpec(String name, Byte kind, Integer offset, Integer size) {
    }
}

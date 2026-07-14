package io.github.prclin.datastudio.server.application.cqrs.query;

import io.github.prclin.datastudio.server.domain.runtime.engineconfig.EngineConfig.Kind;

public abstract class EngineConfigQuery {
    public record EngineConfigPageQuery(String name, Kind kind) {
    }
}

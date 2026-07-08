package io.github.prclin.datastudio.server.domain.runtime.repository;

import io.github.prclin.datastudio.server.domain.runtime.engineconfig.EngineConfig;

public interface EngineConfigRepository {
    Long save(EngineConfig engineConfig);
}

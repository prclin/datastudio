package io.github.prclin.datastudio.server.domain.runtime.repository;

import io.github.prclin.datastudio.server.domain.runtime.engineconfig.EngineConfig;

import java.util.List;

public interface EngineConfigRepository {
    Long save(EngineConfig engineConfig);

    List<EngineConfig> queryLimited(int offset, int size);
}

package io.github.prclin.datastudio.server.domain.runtime.repository;

import io.github.prclin.datastudio.server.domain.runtime.engineconfig.EngineConfig;
import io.github.prclin.datastudio.server.domain.runtime.repository.spec.EngineConfigSpec.EngineConfigPageSpec;
import org.apache.commons.lang3.tuple.Pair;

import java.util.List;

public interface EngineConfigRepository {
    Long save(EngineConfig engineConfig);

    Pair<Long, List<EngineConfig>> queryPage(EngineConfigPageSpec spec);
}

package io.github.prclin.datastudio.server.infrastructure.repository;

import io.github.prclin.datastudio.server.domain.runtime.engineconfig.EngineConfig;
import io.github.prclin.datastudio.server.domain.runtime.repository.EngineConfigRepository;
import io.github.prclin.datastudio.server.infrastructure.assembler.EngineConfigInfraAssembler;
import io.github.prclin.datastudio.server.infrastructure.mapper.EngineConfigMapper;
import io.github.prclin.datastudio.server.infrastructure.po.EngineConfigPO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class EngineConfigRepositoryImpl implements EngineConfigRepository {
    private final EngineConfigMapper engineConfigMapper;
    private final EngineConfigInfraAssembler eciAssembler;

    @Override
    public void save(EngineConfig engineConfig) {
        EngineConfigPO po = eciAssembler.transfer(engineConfig);
        engineConfigMapper.insertOrUpdate(po);
    }
}

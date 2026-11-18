package io.github.prclin.datastudio.server.infrastructure.assembler;

import io.github.prclin.datastudio.server.domain.runtime.engineconfig.EngineConfig;
import io.github.prclin.datastudio.server.infrastructure.persistence.po.EngineConfigPO;
import io.github.prclin.datastuio.common.assembler.BaseAssembler;
import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;

import java.util.List;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public abstract class EngineConfigInfraAssembler extends BaseAssembler {
    public abstract EngineConfigPO transfer(EngineConfig engineConfig);

    public abstract EngineConfig transfer(EngineConfigPO po);

    public abstract List<EngineConfig> transfer(List<EngineConfigPO> pos);
}

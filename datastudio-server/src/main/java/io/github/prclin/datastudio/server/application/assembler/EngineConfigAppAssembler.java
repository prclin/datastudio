package io.github.prclin.datastudio.server.application.assembler;

import io.github.prclin.datastudio.server.application.cqrs.command.EngineCommand.CreateConfigCommand;
import io.github.prclin.datastudio.server.application.cqrs.query.CommonQuery.Pagination;
import io.github.prclin.datastudio.server.application.cqrs.query.EngineConfigQuery.EngineConfigPageQuery;
import io.github.prclin.datastudio.server.application.dto.EngineConfigDTO.ConfigItem;
import io.github.prclin.datastudio.server.domain.runtime.engineconfig.EngineConfig;
import io.github.prclin.datastudio.server.domain.runtime.repository.spec.EngineConfigSpec.EngineConfigPageSpec;
import io.github.prclin.datastuio.common.assembler.BaseAssembler;
import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;

import java.util.List;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public abstract class EngineConfigAppAssembler extends BaseAssembler {

    public abstract EngineConfig transfer(CreateConfigCommand command);

    public abstract ConfigItem transfer(EngineConfig agg);

    public abstract List<ConfigItem> transfer(List<EngineConfig> aggs);

    public abstract EngineConfigPageSpec transfer(EngineConfigPageQuery query, Pagination pagination);
}

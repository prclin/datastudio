package io.github.prclin.datastudio.server.application.assembler;

import io.github.prclin.datastudio.server.application.cqrs.command.EngineCommands.CreateConfig;
import io.github.prclin.datastudio.server.domain.runtime.engineconfig.EngineConfig;
import io.github.prclin.datastuio.common.assembler.BaseAssembler;
import org.mapstruct.AfterMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;
import org.mapstruct.MappingTarget;
import tools.jackson.core.type.TypeReference;

import java.util.Map;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public abstract class EngineConfigAppAssembler extends BaseAssembler {
    @Mapping(target = "artifacts", ignore = true)
    @Mapping(target = "configs", ignore = true)
    public abstract EngineConfig transfer(CreateConfig command);

    @AfterMapping
    protected void mapConfigs(CreateConfig command, @MappingTarget EngineConfig config) {
        config.setConfigs(objectMapper.readValue(command.configs(), new TypeReference<Map<String, String>>() {
        }));
    }

}

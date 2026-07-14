package io.github.prclin.datastudio.server.application.service;

import io.github.prclin.datastudio.server.application.cqrs.command.EngineCommand.CreateConfigCommand;
import io.github.prclin.datastudio.server.application.cqrs.query.CommonQuery.Pagination;
import io.github.prclin.datastudio.server.application.cqrs.query.EngineConfigQuery.EngineConfigPageQuery;
import io.github.prclin.datastudio.server.application.dto.EngineConfigDTO.ConfigItem;
import io.github.prclin.datastudio.server.application.dto.Page;
import io.github.prclin.datastudio.server.application.dto.ResponseBody;

public interface RuntimeService {
    ResponseBody<Void> createEngineConfig(CreateConfigCommand command);

    ResponseBody<Page<ConfigItem>> getEngineConfigPage(EngineConfigPageQuery query, Pagination pagination);
}

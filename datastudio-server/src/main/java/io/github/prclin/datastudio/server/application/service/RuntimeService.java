package io.github.prclin.datastudio.server.application.service;

import io.github.prclin.datastudio.server.application.cqrs.command.EngineCommands.CreateConfig;
import io.github.prclin.datastudio.server.application.dto.ResponseBody;

public interface RuntimeService {
    ResponseBody<Void> createEngineConfig(CreateConfig command);
}

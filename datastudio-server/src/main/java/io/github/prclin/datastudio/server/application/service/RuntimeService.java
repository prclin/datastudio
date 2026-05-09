package io.github.prclin.datastudio.server.application.service;

import io.github.prclin.datastudio.server.application.cqrs.command.ClusterCommands.CreateCommand;
import io.github.prclin.datastudio.server.application.dto.ResponseBody;

public interface RuntimeService {
    ResponseBody<Void> createCluster(CreateCommand command);
}

package io.github.prclin.datastudio.server.application.service.impl;

import io.github.prclin.datastudio.server.application.cqrs.command.ClusterCommands.CreateCommand;
import io.github.prclin.datastudio.server.application.dto.ResponseBody;
import io.github.prclin.datastudio.server.application.service.RuntimeService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class RuntimeServiceImpl implements RuntimeService {
    @Override
    public ResponseBody<Void> createCluster(CreateCommand command) {
        return null;
    }
}

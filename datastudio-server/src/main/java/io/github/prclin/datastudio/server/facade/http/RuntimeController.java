package io.github.prclin.datastudio.server.facade.http;

import io.github.prclin.datastudio.server.application.cqrs.command.EngineCommand.CreateConfigCommand;
import io.github.prclin.datastudio.server.application.cqrs.query.CommonQuery.Pagination;
import io.github.prclin.datastudio.server.application.dto.EngineConfigDTO.ConfigItem;
import io.github.prclin.datastudio.server.application.dto.Page;
import io.github.prclin.datastudio.server.application.dto.ResponseBody;
import io.github.prclin.datastudio.server.application.service.RuntimeService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/runtime")
@AllArgsConstructor
@Slf4j
@Validated
public class RuntimeController {
    private final RuntimeService runtimeService;

    @PostMapping("/engine-config")
    public ResponseBody<Void> postClusterConfig(@Validated CreateConfigCommand command) {
        return runtimeService.createEngineConfig(command);
    }

    @PostMapping("/engine-config/page")
    public ResponseBody<Page<ConfigItem>> getEngineConfigPage(@Validated Pagination pagination) {
        return runtimeService.getEngineConfigPage(pagination);
    }
}

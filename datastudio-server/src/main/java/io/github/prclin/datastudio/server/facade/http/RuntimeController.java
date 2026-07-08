package io.github.prclin.datastudio.server.facade.http;

import io.github.prclin.datastudio.server.application.cqrs.command.EngineCommands.CreateConfig;
import io.github.prclin.datastudio.server.application.dto.ResponseBody;
import io.github.prclin.datastudio.server.application.service.RuntimeService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/runtime")
@AllArgsConstructor
@Slf4j
public class RuntimeController {
    private final RuntimeService runtimeService;

    @PostMapping(value = "/engine-config")
    public ResponseBody<Void> postClusterConfig(CreateConfig command) {
        return runtimeService.createEngineConfig(command);
    }

    @ExceptionHandler
    public void ca(Exception e) {
        log.info("错误", e);
    }
}

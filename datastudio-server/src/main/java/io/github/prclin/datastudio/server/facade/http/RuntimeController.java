package io.github.prclin.datastudio.server.facade.http;

import io.github.prclin.datastudio.server.application.cqrs.command.ClusterCommands.CreateCommand;
import io.github.prclin.datastudio.server.application.dto.ResponseBody;
import io.github.prclin.datastudio.server.application.service.RuntimeService;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/runtime")
@AllArgsConstructor
public class RuntimeController {
    private final RuntimeService runtimeService;

    @PostMapping("/cluster")
    public ResponseBody<Void> postCluster(@RequestPart CreateCommand command) {
        runtimeService.createCluster(command);
        return ResponseBody.ok();
    }
}

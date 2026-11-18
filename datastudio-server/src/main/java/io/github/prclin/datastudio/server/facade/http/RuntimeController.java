package io.github.prclin.datastudio.server.facade.http;

import io.github.prclin.datastudio.server.application.cqrs.command.EngineCommand.CreateConfigCommand;
import io.github.prclin.datastudio.server.application.cqrs.command.EngineCommand.UpdateConfigCommand;
import io.github.prclin.datastudio.server.application.cqrs.query.CommonQuery.Pagination;
import io.github.prclin.datastudio.server.application.cqrs.query.EngineConfigQuery.EngineConfigPageQuery;
import io.github.prclin.datastudio.server.application.dto.EngineConfigDTO.ArtifactItem;
import io.github.prclin.datastudio.server.application.dto.EngineConfigDTO.ConfigItem;
import io.github.prclin.datastudio.server.application.dto.Page;
import io.github.prclin.datastudio.server.application.dto.ResponseBody;
import io.github.prclin.datastudio.server.application.service.RuntimeService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/runtime")
@AllArgsConstructor
@Slf4j
@Validated
public class RuntimeController {
    private final RuntimeService runtimeService;

    @PostMapping("/engine-config")
    public ResponseBody<Void> postClusterConfig(@Validated @RequestBody CreateConfigCommand command) {
        return runtimeService.createEngineConfig(command);
    }

    @PutMapping("/engine-config/{id}")
    public ResponseBody<Void> putEngineConfig(@PathVariable String id, @Validated @RequestBody UpdateConfigCommand command) {
        return runtimeService.updateEngineConfig(id, command);
    }

    @PostMapping("/engine-config/page")
    public ResponseBody<Page<ConfigItem>> getEngineConfigPage(EngineConfigPageQuery query, @Validated Pagination pagination) {
        return runtimeService.getEngineConfigPage(query, pagination);
    }

    @GetMapping("/engine-config/{id}")
    public ResponseBody<ConfigItem> getEngineConfig(@PathVariable String id) {
        return runtimeService.getEngineConfig(id);
    }

    @GetMapping("/filesystems")
    public ResponseBody<List<String>> getFileSystems() {
        return runtimeService.getFileSystems();
    }

    @PostMapping("/engine-config/{id}/artifacts")
    public ResponseBody<Void> postEngineConfigArtifacts(@PathVariable String id, @RequestPart("artifacts") List<MultipartFile> artifacts) throws IOException {
        return runtimeService.uploadEngineConfigArtifacts(id, artifacts);
    }

    @GetMapping("/engine-config/{id}/artifacts")
    public ResponseBody<List<ArtifactItem>> getEngineConfigArtifacts(@PathVariable String id) throws IOException {
        return runtimeService.getEngineConfigArtifacts(id);
    }
}

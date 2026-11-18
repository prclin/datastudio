package io.github.prclin.datastudio.server.application.service;

import io.github.prclin.datastudio.server.application.cqrs.command.EngineCommand.CreateConfigCommand;
import io.github.prclin.datastudio.server.application.cqrs.command.EngineCommand.UpdateConfigCommand;
import io.github.prclin.datastudio.server.application.cqrs.query.CommonQuery.Pagination;
import io.github.prclin.datastudio.server.application.cqrs.query.EngineConfigQuery.EngineConfigPageQuery;
import io.github.prclin.datastudio.server.application.dto.EngineConfigDTO.ArtifactItem;
import io.github.prclin.datastudio.server.application.dto.EngineConfigDTO.ConfigItem;
import io.github.prclin.datastudio.server.application.dto.Page;
import io.github.prclin.datastudio.server.application.dto.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface RuntimeService {
    ResponseBody<Void> createEngineConfig(CreateConfigCommand command);

    ResponseBody<Void> updateEngineConfig(String id, UpdateConfigCommand command);

    ResponseBody<Page<ConfigItem>> getEngineConfigPage(EngineConfigPageQuery query, Pagination pagination);

    ResponseBody<List<String>> getFileSystems();

    ResponseBody<Void> uploadEngineConfigArtifacts(String id, List<MultipartFile> artifacts) throws IOException;

    ResponseBody<List<ArtifactItem>> getEngineConfigArtifacts(String id) throws IOException;
}

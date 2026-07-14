package io.github.prclin.datastudio.server.application.service.impl;

import io.github.prclin.datastudio.server.application.assembler.EngineConfigAppAssembler;
import io.github.prclin.datastudio.server.application.cqrs.command.EngineCommand.CreateConfigCommand;
import io.github.prclin.datastudio.server.application.cqrs.query.CommonQuery.Pagination;
import io.github.prclin.datastudio.server.application.cqrs.query.EngineConfigQuery.EngineConfigPageQuery;
import io.github.prclin.datastudio.server.application.dto.EngineConfigDTO.ConfigItem;
import io.github.prclin.datastudio.server.application.dto.Page;
import io.github.prclin.datastudio.server.application.dto.ResponseBody;
import io.github.prclin.datastudio.server.application.service.RuntimeService;
import io.github.prclin.datastudio.server.domain.runtime.engineconfig.EngineConfig;
import io.github.prclin.datastudio.server.domain.runtime.repository.EngineConfigRepository;
import io.github.prclin.datastudio.server.domain.runtime.repository.spec.EngineConfigSpec.EngineConfigPageSpec;
import io.github.prclin.datastudio.server.infrastructure.configuration.properties.DatastudioProperties;
import io.github.prclin.datastudio.server.infrastructure.util.FileSystemUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.tuple.Pair;
import org.apache.hadoop.fs.Path;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Objects;


@Slf4j
@Service
@RequiredArgsConstructor
public class RuntimeServiceImpl implements RuntimeService {
    private final EngineConfigAppAssembler assembler;
    private final EngineConfigRepository engineConfigRepository;
    private final FileSystemUtil fsUtil;
    private final DatastudioProperties datastudioProperties;

    /**
     * 1. 创建记录
     * <p>
     * 2. 上传文件
     */
    @Override
    public ResponseBody<Void> createEngineConfig(CreateConfigCommand command) {
        EngineConfig engineConfig = assembler.transfer(command);
        Long id = engineConfigRepository.save(engineConfig);
        String artifactsHome = datastudioProperties.getEngineConfig().getArtifactsHome();
        for (MultipartFile artifact : command.artifacts()) {
            try {
                fsUtil.copy(artifact.getInputStream(), new Path(new Path(artifactsHome, id.toString()), Objects.requireNonNull(artifact.getOriginalFilename())));
            } catch (IOException e) {
                return ResponseBody.serverError(String.format("create succeed,upload file %s failed!", artifact.getOriginalFilename()));
            }
        }
        return ResponseBody.ok();
    }

    @Override
    public ResponseBody<Page<ConfigItem>> getEngineConfigPage(EngineConfigPageQuery query, Pagination pagination) {
        EngineConfigPageSpec spec = assembler.transfer(query, pagination);
        Pair<Long, List<EngineConfig>> pair = engineConfigRepository.queryPage(spec);
        List<ConfigItem> items = assembler.transfer(pair.getRight());
        return ResponseBody.ok(Page.of(pair.getLeft(), items));
    }
}

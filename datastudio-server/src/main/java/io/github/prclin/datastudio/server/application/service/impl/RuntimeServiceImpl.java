package io.github.prclin.datastudio.server.application.service.impl;

import io.github.prclin.datastudio.server.application.assembler.EngineConfigAppAssembler;
import io.github.prclin.datastudio.server.application.cqrs.command.EngineCommands.CreateConfig;
import io.github.prclin.datastudio.server.application.dto.ResponseBody;
import io.github.prclin.datastudio.server.application.service.RuntimeService;
import io.github.prclin.datastudio.server.domain.runtime.engineconfig.EngineConfig;
import io.github.prclin.datastudio.server.domain.runtime.repository.EngineConfigRepository;
import io.github.prclin.datastudio.server.infrastructure.configuration.properties.DatastudioProperties;
import io.github.prclin.datastudio.server.infrastructure.util.FileSystemUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import tools.jackson.databind.ObjectMapper;

import java.io.IOException;


@Slf4j
@Service
@RequiredArgsConstructor
public class RuntimeServiceImpl implements RuntimeService {
    private final EngineConfigAppAssembler assembler;
    private final EngineConfigRepository engineConfigRepository;
    private final FileSystemUtil fsUtil;
    private final DatastudioProperties datastudioProperties;
    private final ObjectMapper mapper;

    /**
     * 1. 创建记录
     * <p>
     * 2. 上传文件
     */
    @Override
    public ResponseBody<Void> createEngineConfig(CreateConfig command) {
        EngineConfig engineConfig = assembler.transfer(command);
        engineConfigRepository.save(engineConfig);
        String artifactsHome = datastudioProperties.getEngineConfig().getArtifactsHome();
        for (MultipartFile artifact : command.artifacts()) {
            try {
                fsUtil.copy(artifact.getInputStream(), artifactsHome);
            } catch (IOException e) {
                return ResponseBody.serverError(String.format("upload file %s failed!", artifact.getName()));
            }
        }
        return ResponseBody.ok();
    }
}

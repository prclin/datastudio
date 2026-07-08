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
import org.apache.hadoop.fs.Path;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
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
    public ResponseBody<Void> createEngineConfig(CreateConfig command) {
        EngineConfig engineConfig = assembler.transfer(command);
        Long id = engineConfigRepository.save(engineConfig);
        String artifactsHome = datastudioProperties.getEngineConfig().getArtifactsHome();
        for (MultipartFile artifact : command.artifacts()) {
            try {
                fsUtil.copy(artifact.getInputStream(), new Path(new Path(artifactsHome, id.toString()), Objects.requireNonNull(artifact.getOriginalFilename())));
            } catch (IOException e) {
                return ResponseBody.serverError(String.format("upload file %s failed!", artifact.getOriginalFilename()));
            }
        }
        return ResponseBody.ok();
    }
}

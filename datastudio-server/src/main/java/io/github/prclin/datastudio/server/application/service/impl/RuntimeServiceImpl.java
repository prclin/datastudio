package io.github.prclin.datastudio.server.application.service.impl;

import io.github.prclin.datastudio.server.application.assembler.EngineConfigAppAssembler;
import io.github.prclin.datastudio.server.application.cqrs.command.EngineCommand.CreateConfigCommand;
import io.github.prclin.datastudio.server.application.cqrs.command.EngineCommand.UpdateConfigCommand;
import io.github.prclin.datastudio.server.application.cqrs.query.CommonQuery.Pagination;
import io.github.prclin.datastudio.server.application.cqrs.query.EngineConfigQuery.EngineConfigPageQuery;
import io.github.prclin.datastudio.server.application.dto.EngineConfigDTO.ArtifactItem;
import io.github.prclin.datastudio.server.application.dto.EngineConfigDTO.ConfigItem;
import io.github.prclin.datastudio.server.application.dto.Page;
import io.github.prclin.datastudio.server.application.dto.ResponseBody;
import io.github.prclin.datastudio.server.application.event.EngineConfigEvents.EngineConfigCreated;
import io.github.prclin.datastudio.server.application.service.RuntimeService;
import io.github.prclin.datastudio.server.domain.runtime.engineconfig.EngineConfig;
import io.github.prclin.datastudio.server.domain.runtime.repository.EngineConfigRepository;
import io.github.prclin.datastudio.server.domain.runtime.repository.spec.EngineConfigSpec.EngineConfigPageSpec;
import io.github.prclin.datastudio.server.infrastructure.configuration.properties.DatastudioProperties;
import io.github.prclin.datastudio.server.infrastructure.context.AvailableFileSystem;
import io.github.prclin.datastudio.server.infrastructure.context.Identity;
import io.github.prclin.datastudio.server.infrastructure.context.RequestContext;
import io.github.prclin.datastudio.server.infrastructure.persistence.mapper.EngineConfigMapper;
import io.github.prclin.datastudio.server.infrastructure.persistence.po.EngineConfigPO;
import io.github.prclin.datastudio.server.infrastructure.support.hadoop.HadoopContext;
import io.github.prclin.datastudio.server.infrastructure.util.FileSystemUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.io.FilenameUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.tuple.Pair;
import org.apache.hadoop.fs.FileStatus;
import org.apache.hadoop.fs.FileSystem;
import org.apache.hadoop.fs.Path;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.UUID;


@Slf4j
@Service
@RequiredArgsConstructor
public class RuntimeServiceImpl implements RuntimeService {
    private final EngineConfigAppAssembler assembler;
    private final EngineConfigRepository engineConfigRepository;
    private final EngineConfigMapper ecMapper;
    private final DatastudioProperties datastudioProperties;
    private final HadoopContext hadoopContext;

    private static List<ArtifactItem> toArtifacts(FileSystem fs, Path dir) throws IOException {
        if (!fs.exists(dir)) return List.of();

        return Arrays.stream(fs.listStatus(dir))
                .filter(FileStatus::isFile)
                .sorted(Comparator.comparing(status -> status.getPath().getName()))
                .map(status -> new ArtifactItem(status.getPath().getName(),
                        status.getPath().toString(),
                        status.getLen(),
                        DateTimeFormatter.ISO_LOCAL_DATE_TIME.format(LocalDateTime.ofInstant(Instant.ofEpochMilli(status.getModificationTime()), ZoneId.systemDefault()))))
                .toList();
    }

    @Override
    public ResponseBody<Void> createEngineConfig(CreateConfigCommand command) {
        Identity identity = RequestContext.IDENTITY.get();
        EngineConfig engineConfig = assembler.transfer(command);
        //初始化并保存
        engineConfig.init();
        engineConfig.setCreatorId(identity.getId());
        engineConfig.setArtifactsHome(datastudioProperties.getEngineConfig().getArtifactsHome(Map.of("orgId", identity.getOrganizationId(), "id", engineConfig.getId())));
        engineConfigRepository.save(engineConfig);
        //发送事件
        RequestContext.pushEvent(new EngineConfigCreated(engineConfig.getId(), engineConfig.getCreatorId()));

        return ResponseBody.ok();
    }

    @Override
    public ResponseBody<Void> updateEngineConfig(String id, UpdateConfigCommand command) {
        EngineConfig engineConfig = engineConfigRepository.queryById(id);
        if (engineConfig == null) return ResponseBody.clientError("Engine config not found!");

        //整体加载后只改允许修改的部分,kind、dstFs、artifactsHome 保持原值
        engineConfig.setName(command.name());
        engineConfig.setConfigs(command.configs());
        engineConfig.setUpdateTime(LocalDateTime.now());
        engineConfigRepository.update(engineConfig);

        return ResponseBody.ok();
    }

    @Override
    public ResponseBody<Page<ConfigItem>> getEngineConfigPage(EngineConfigPageQuery query, Pagination pagination) {
        EngineConfigPageSpec spec = assembler.transfer(query, pagination);
        Pair<Long, List<EngineConfig>> pair = engineConfigRepository.queryPage(spec);
        List<ConfigItem> items = assembler.transfer(pair.getRight());
        return ResponseBody.ok(Page.of(pair.getLeft(), items));
    }

    @Override
    public ResponseBody<ConfigItem> getEngineConfig(String id) {
        EngineConfig engineConfig = engineConfigRepository.queryById(id);
        if (engineConfig == null) return ResponseBody.clientError("Engine config not found!");

        return ResponseBody.ok(assembler.transfer(engineConfig));
    }

    @Override
    public ResponseBody<List<String>> getFileSystems() {
        List<String> fileSystems = Arrays.stream(AvailableFileSystem.values()).map(Enum::name).toList();
        return ResponseBody.ok(fileSystems);
    }

    @Override
    public ResponseBody<Void> uploadEngineConfigArtifacts(String id, List<MultipartFile> artifacts) throws IOException {
        EngineConfigPO po = ecMapper.selectById(UUID.fromString(id));
        if (po == null) return ResponseBody.clientError("Engine config not found!");
        String dstFs = po.getDstFs();
        FileSystem fileSystem = hadoopContext.getFileSystem(AvailableFileSystem.valueOf(dstFs));
        if (fileSystem == null) return ResponseBody.clientError("FileSystem " + dstFs + " unavailable!");

        //用创建时落库的目录,不同组织的用户上传同一配置的产物才会落到同一处
        Path dir = new Path(po.getArtifactsHome());
        fileSystem.mkdirs(dir);
        for (MultipartFile artifact : artifacts) {
            //只取文件名,避免客户端提交的路径越出artifacts目录
            String name = FilenameUtils.getName(artifact.getOriginalFilename());
            if (StringUtils.isBlank(name) || name.equals(".") || name.equals("..")) continue;
            FileSystemUtil.copy(artifact.getInputStream(), fileSystem.create(new Path(dir, name), true));
        }

        return ResponseBody.ok();
    }

    @Override
    public ResponseBody<List<ArtifactItem>> getEngineConfigArtifacts(String id) throws IOException {
        EngineConfigPO po = ecMapper.selectById(UUID.fromString(id));
        if (po == null) return ResponseBody.clientError("Engine config not found!");
        String dstFs = po.getDstFs();
        FileSystem fileSystem = hadoopContext.getFileSystem(AvailableFileSystem.valueOf(dstFs));
        if (fileSystem == null) return ResponseBody.clientError("FileSystem " + dstFs + " unavailable!");

        Path dir = new Path(po.getArtifactsHome());
        return ResponseBody.ok(toArtifacts(fileSystem, dir));
    }
}

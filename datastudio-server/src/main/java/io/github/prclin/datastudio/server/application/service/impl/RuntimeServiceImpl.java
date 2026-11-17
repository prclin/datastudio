package io.github.prclin.datastudio.server.application.service.impl;

import io.github.prclin.datastudio.server.application.assembler.EngineConfigAppAssembler;
import io.github.prclin.datastudio.server.application.cqrs.command.EngineCommand.CreateConfigCommand;
import io.github.prclin.datastudio.server.application.cqrs.query.CommonQuery.Pagination;
import io.github.prclin.datastudio.server.application.cqrs.query.EngineConfigQuery.EngineConfigPageQuery;
import io.github.prclin.datastudio.server.application.dto.EngineConfigDTO.ConfigItem;
import io.github.prclin.datastudio.server.application.dto.Page;
import io.github.prclin.datastudio.server.application.dto.ResponseBody;
import io.github.prclin.datastudio.server.application.event.EngineConfigEvents.EngineConfigCreated;
import io.github.prclin.datastudio.server.application.service.RuntimeService;
import io.github.prclin.datastudio.server.domain.runtime.engineconfig.EngineConfig;
import io.github.prclin.datastudio.server.domain.runtime.repository.EngineConfigRepository;
import io.github.prclin.datastudio.server.domain.runtime.repository.spec.EngineConfigSpec.EngineConfigPageSpec;
import io.github.prclin.datastudio.server.infrastructure.configuration.hadoop.HadoopConfHolder;
import io.github.prclin.datastudio.server.infrastructure.configuration.properties.DatastudioProperties;
import io.github.prclin.datastudio.server.infrastructure.context.Identity;
import io.github.prclin.datastudio.server.infrastructure.context.RequestContext;
import io.github.prclin.datastudio.server.infrastructure.persistence.mapper.EngineConfigMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.tuple.Pair;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;


@Slf4j
@Service
@RequiredArgsConstructor
public class RuntimeServiceImpl implements RuntimeService {
    private final EngineConfigAppAssembler assembler;
    private final EngineConfigRepository engineConfigRepository;
    private final EngineConfigMapper ecMapper;
    private final DatastudioProperties datastudioProperties;
    private final HadoopConfHolder hadoopConfHolder;

    @Override
    public ResponseBody<Void> createEngineConfig(CreateConfigCommand command) {
        Identity identity = RequestContext.IDENTITY.get();
        EngineConfig engineConfig = assembler.transfer(command);
        //初始化并保存
        engineConfig.init();
        engineConfig.setCreatorId(identity.getId());
        String artifactsHome = datastudioProperties.getEngineConfig().getArtifactsHome(Map.of("orgId", identity.getOrganizationId(), "id", engineConfig.getId()));
        engineConfig.setArtifactsHome(artifactsHome);
        engineConfigRepository.save(engineConfig);
        //发送事件
        RequestContext.pushEvent(new EngineConfigCreated(engineConfig.getId(), engineConfig.getCreatorId()));

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

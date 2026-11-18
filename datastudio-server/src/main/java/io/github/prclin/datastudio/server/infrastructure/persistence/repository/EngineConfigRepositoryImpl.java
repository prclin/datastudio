package io.github.prclin.datastudio.server.infrastructure.persistence.repository;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import io.github.prclin.datastudio.server.domain.runtime.engineconfig.EngineConfig;
import io.github.prclin.datastudio.server.domain.runtime.repository.EngineConfigRepository;
import io.github.prclin.datastudio.server.domain.runtime.repository.spec.EngineConfigSpec.EngineConfigPageSpec;
import io.github.prclin.datastudio.server.infrastructure.assembler.EngineConfigInfraAssembler;
import io.github.prclin.datastudio.server.infrastructure.persistence.mapper.EngineConfigMapper;
import io.github.prclin.datastudio.server.infrastructure.persistence.po.EngineConfigPO;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.tuple.Pair;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
@RequiredArgsConstructor
public class EngineConfigRepositoryImpl implements EngineConfigRepository {
    private final EngineConfigMapper engineConfigMapper;
    private final EngineConfigInfraAssembler eciAssembler;

    @Override
    public int save(EngineConfig engineConfig) {
        EngineConfigPO po = eciAssembler.transfer(engineConfig);
        return engineConfigMapper.insert(po);
    }

    @Override
    public EngineConfig queryById(String id) {
        EngineConfigPO po = engineConfigMapper.selectById(UUID.fromString(id));
        return po == null ? null : eciAssembler.transfer(po);
    }

    @Override
    public int update(EngineConfig engineConfig) {
        return engineConfigMapper.updateById(eciAssembler.transfer(engineConfig));
    }


    @Override
    public Pair<Long, List<EngineConfig>> queryPage(EngineConfigPageSpec spec) {
        LambdaQueryWrapper<EngineConfigPO> wrapper = Wrappers.<EngineConfigPO>lambdaQuery()
                .eq(StringUtils.isNotBlank(spec.name()), EngineConfigPO::getName, spec.name())
                .eq(spec.kind() != null, EngineConfigPO::getKind, spec.kind());
        Long total = engineConfigMapper.selectCount(wrapper);
        wrapper.last("limit %d offset %d".formatted(spec.size(), spec.offset()));
        List<EngineConfigPO> pos = engineConfigMapper.selectList(wrapper);
        return Pair.of(total, eciAssembler.transfer(pos));
    }
}

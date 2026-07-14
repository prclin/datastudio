package io.github.prclin.datastudio.server.infrastructure.repository;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import io.github.prclin.datastudio.server.domain.runtime.engineconfig.EngineConfig;
import io.github.prclin.datastudio.server.domain.runtime.repository.EngineConfigRepository;
import io.github.prclin.datastudio.server.domain.runtime.repository.spec.EngineConfigSpec.EngineConfigPageSpec;
import io.github.prclin.datastudio.server.infrastructure.assembler.EngineConfigInfraAssembler;
import io.github.prclin.datastudio.server.infrastructure.mapper.EngineConfigMapper;
import io.github.prclin.datastudio.server.infrastructure.po.EngineConfigPO;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.tuple.Pair;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class EngineConfigRepositoryImpl implements EngineConfigRepository {
    private final EngineConfigMapper engineConfigMapper;
    private final EngineConfigInfraAssembler eciAssembler;

    @Override
    public Long save(EngineConfig engineConfig) {
        EngineConfigPO po = eciAssembler.transfer(engineConfig);
        engineConfigMapper.insertOrUpdate(po);
        return po.getId();
    }


    @Override
    public Pair<Long, List<EngineConfig>> queryPage(EngineConfigPageSpec spec) {
        LambdaQueryWrapper<EngineConfigPO> wrapper = Wrappers.<EngineConfigPO>lambdaQuery()
                .eq(StringUtils.isNotBlank(spec.name()), EngineConfigPO::getName, spec.name())
                .eq(spec.kind() != null, EngineConfigPO::getKind, spec.kind());
        Long total = engineConfigMapper.selectCount(wrapper);
        List<EngineConfigPO> pos = engineConfigMapper.selectList(wrapper.last("limit " + spec.offset() + "," + spec.size()));
        return Pair.of(total, eciAssembler.transfer(pos));
    }
}

package io.github.prclin.datastudio.server.infrastructure.repository;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import io.github.prclin.datastudio.server.domain.runtime.engineconfig.EngineConfig;
import io.github.prclin.datastudio.server.domain.runtime.repository.EngineConfigRepository;
import io.github.prclin.datastudio.server.infrastructure.assembler.EngineConfigInfraAssembler;
import io.github.prclin.datastudio.server.infrastructure.mapper.EngineConfigMapper;
import io.github.prclin.datastudio.server.infrastructure.po.EngineConfigPO;
import lombok.RequiredArgsConstructor;
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
    public List<EngineConfig> queryLimited(int offset, int size) {
        LambdaQueryWrapper<EngineConfigPO> wrapper = Wrappers.<EngineConfigPO>lambdaQuery().last("limit " + offset + "," + size);
        List<EngineConfigPO> pos = engineConfigMapper.selectList(wrapper);
        return eciAssembler.transfer(pos);
    }
}

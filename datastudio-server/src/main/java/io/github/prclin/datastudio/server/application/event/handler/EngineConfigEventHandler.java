package io.github.prclin.datastudio.server.application.event.handler;

import io.github.prclin.datastudio.server.application.event.EngineConfigEvents.EngineConfigCreated;
import lombok.RequiredArgsConstructor;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class EngineConfigEventHandler {
    //todo 处理spicedb权限
    @EventListener
    public void onEngineConfigCreated(EngineConfigCreated e) {

    }
}

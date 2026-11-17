package io.github.prclin.datastudio.server.application.aop;

import io.github.prclin.datastudio.server.infrastructure.context.RequestContext;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.AfterThrowing;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
@Aspect
@Slf4j
@Order(2)
@RequiredArgsConstructor
public class EventAspect {
    private final ApplicationEventPublisher publisher;

    /**
     * 切入所有Service方法和事件监听器方法
     */
    @Pointcut("@within(org.springframework.stereotype.Service) || @annotation(org.springframework.context.event.EventListener)")
    public void pointCut() {
    }

    /**
     * 发送事件
     */
    @AfterReturning("pointCut()")
    public void afterReturn() {
        Optional<Object> option;
        while ((option = RequestContext.popEvent()).isPresent()) {
            Object event = option.get();
            publisher.publishEvent(event);
            log.debug("event {} published!", event.getClass().getName());
        }
    }

    /**
     * 丢弃事件
     */
    @AfterThrowing("pointCut()")
    public void afterThrow() {
        Optional<Object> option;
        while ((option = RequestContext.popEvent()).isPresent()) {
            Object event = option.get();
            log.debug("drop event {}, cause method throw exception!", event.getClass().getName());
        }
    }
}

package io.github.prclin.datastudio.server.infrastructure.context;

import java.util.ArrayDeque;
import java.util.Collections;
import java.util.Deque;
import java.util.Optional;

public final class RequestContext {
    public static final ThreadLocal<Identity> IDENTITY = new ThreadLocal<>();
    private static final ThreadLocal<Deque<Object>> EVENT_STACK = new ThreadLocal<>();

    public static void pushEvent(Object event) {
        Optional.ofNullable(EVENT_STACK.get())
                .ifPresentOrElse(
                        stack -> stack.push(event),
                        () -> EVENT_STACK.set(new ArrayDeque<>(Collections.singletonList(event)))
                );
    }

    public static Optional<Object> popEvent() {
        Deque<Object> stack = EVENT_STACK.get();
        if (stack == null) return Optional.empty();

        Object event = stack.pop();
        if (stack.isEmpty()) EVENT_STACK.remove();

        return Optional.ofNullable(event);
    }
}

package io.github.prclin.datastudio.server.infrastructure.context;

public final class RequestContext {
    public static final ThreadLocal<Identity> IDENTITY = new ThreadLocal<>();
}

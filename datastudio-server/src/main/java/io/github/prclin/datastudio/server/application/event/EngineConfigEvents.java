package io.github.prclin.datastudio.server.application.event;

public class EngineConfigEvents {
    public record EngineConfigCreated(String id, String creatorId) {
    }
}

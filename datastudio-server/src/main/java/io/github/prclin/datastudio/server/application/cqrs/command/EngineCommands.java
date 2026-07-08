package io.github.prclin.datastudio.server.application.cqrs.command;

import io.github.prclin.datastudio.server.domain.runtime.engineconfig.EngineConfig.Kind;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public abstract class EngineCommands {
    public record CreateConfig(String name, Kind kind, String configs,
                               List<MultipartFile> artifacts) {
    }
}

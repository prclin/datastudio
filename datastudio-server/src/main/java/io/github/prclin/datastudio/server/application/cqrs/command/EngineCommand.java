package io.github.prclin.datastudio.server.application.cqrs.command;

import io.github.prclin.datastudio.server.domain.runtime.engineconfig.EngineConfig.Kind;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public abstract class EngineCommand {
    public record CreateConfigCommand(@NotBlank String name, @NotNull Kind kind, String configs,
                                      List<MultipartFile> artifacts) {
    }
}

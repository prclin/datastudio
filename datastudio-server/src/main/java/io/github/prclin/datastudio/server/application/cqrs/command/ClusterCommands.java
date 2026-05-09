package io.github.prclin.datastudio.server.application.cqrs.command;

import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

public abstract class ClusterCommands {
    public record CreateCommand(String name, Byte kind, Map<String, String> configs,
                                List<MultipartFile> artifacts) {
    }
}

package io.github.prclin.datastudio.server.infrastructure.configuration.properties;

import io.github.prclin.datastudio.server.infrastructure.context.AvailableFileSystem;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.Collections;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@ConfigurationProperties("datastudio")
@Component
@Data
public class DatastudioProperties {
    private EngineConfigProperties engineConfig = new EngineConfigProperties();
    private Map<AvailableFileSystem, FileSystemProperties> filesystems = Arrays.stream(AvailableFileSystem.values())
            .collect(Collectors.toMap(Function.identity(), fs -> new FileSystemProperties(fs.getValue())));

    @Data
    public static class EngineConfigProperties {
        private String artifactsHome = "artifacts";
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class FileSystemProperties {
        private Map<String, String> hadoopConfigs = Collections.emptyMap();
    }
}

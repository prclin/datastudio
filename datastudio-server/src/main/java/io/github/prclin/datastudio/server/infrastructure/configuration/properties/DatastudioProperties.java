package io.github.prclin.datastudio.server.infrastructure.configuration.properties;

import io.github.prclin.datastudio.server.infrastructure.context.AvailableFileSystem;
import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.Arrays;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@ConfigurationProperties("datastudio")
@Component
@Data
public class DatastudioProperties {
    private EngineConfigProperties engineConfig = new EngineConfigProperties();
    private Map<AvailableFileSystem, Map<String, String>> hadoop = Arrays.stream(AvailableFileSystem.values())
            .collect(Collectors.toMap(Function.identity(), AvailableFileSystem::getValue));

    @Data
    public static class EngineConfigProperties {
        private String artifactsHome = "/tmp/datastudio/{orgId}/runtime/engine-config/{id}/artifacts";

        public String getArtifactsHome(Map<String, ?> variables) {
            return UriComponentsBuilder.fromUriString(this.artifactsHome)
                    .buildAndExpand(variables)
                    .toUriString();
        }
    }

}

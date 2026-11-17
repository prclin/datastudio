package io.github.prclin.datastudio.server.infrastructure.configuration.properties;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.Map;

@Component
@ConfigurationProperties("hadoop")
@Data
public class HadoopProperties {
    private Map<String, Map<String, String>> confs = Collections.emptyMap();
}

package io.github.prclin.datastudio.server.infrastructure.configuration.properties;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties("spicedb")
@Data
public class SpicedbProperties {
    private String grpcEndpoint;
    private String adminPat;
}

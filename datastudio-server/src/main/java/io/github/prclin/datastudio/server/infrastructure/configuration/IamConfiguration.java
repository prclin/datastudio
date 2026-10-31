package io.github.prclin.datastudio.server.infrastructure.configuration;

import com.zitadel.Zitadel;
import io.github.prclin.datastudio.server.infrastructure.configuration.properties.ZitadelProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class IamConfiguration {
    @Bean
    public Zitadel zitadel(ZitadelProperties props) {
        return Zitadel.withAccessToken(props.getHost(), props.getAdminPat());
    }
}

package io.github.prclin.datastudio.server.infrastructure.configuration.properties;

import com.zitadel.model.ApplicationServiceOIDCApplicationType;
import com.zitadel.model.ApplicationServiceOIDCAuthMethodType;
import com.zitadel.model.ApplicationServiceOIDCGrantType;
import com.zitadel.model.ApplicationServiceOIDCResponseType;
import com.zitadel.model.ApplicationServiceOIDCTokenType;
import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.util.List;

@ConfigurationProperties("zitadel")
@Component
@Data
public class ZitadelProperties {
    private String host;
    private String adminPat;
    private ZitadelSetupProperties setup;

    @Data
    public static class ZitadelSetupProperties {
        private String organizationName;
        private String projectName;
        private String appName;
        private List<String> redirectUris;
        private List<ApplicationServiceOIDCResponseType> responseTypes;
        private List<ApplicationServiceOIDCGrantType> grantTypes;
        private ApplicationServiceOIDCApplicationType applicationType;
        private ApplicationServiceOIDCAuthMethodType authMethodType;
        private Boolean developmentMode;
        private ApplicationServiceOIDCTokenType accessTokenType;
        private String clientSecretFile;

    }
}

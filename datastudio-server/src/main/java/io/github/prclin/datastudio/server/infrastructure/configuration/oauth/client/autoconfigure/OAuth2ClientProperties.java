package io.github.prclin.datastudio.server.infrastructure.configuration.oauth.client.autoconfigure;

import io.github.prclin.datastudio.server.infrastructure.configuration.oauth.client.AuthorizationGrantType;
import lombok.Data;
import org.jspecify.annotations.Nullable;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;
import java.util.Set;

@Data
@Component
@ConfigurationProperties("oauth2.client")
public class OAuth2ClientProperties {
    /**
     * OAuth provider details.
     */
    private final Map<String, ProviderProps> providers = new HashMap<>();
    /**
     * OAuth client registrations.
     */
    private final Map<String, RegistrationProps> registrations = new HashMap<>();

    @Data
    public static class RegistrationProps {
        /**
         * Reference to the OAuth 2.0 provider to use.
         */
        private String provider;

        /**
         * Client ID for the registration.
         */
        private String clientId;

        /**
         * Client secret of the registration.
         */
        private String clientSecret;

        /**
         * Client authentication method.
         */
        private String clientAuthenticationMethod;

        /**
         * Authorization grant type.
         */
        private AuthorizationGrantType authorizationGrantType = AuthorizationGrantType.AUTHORIZATION_CODE;

        /**
         * Redirect URI.
         */
        private String redirectUri = "{baseUrl}/api/oauth2/code/{registrationId}";

        /**
         * Authorization scopes. When left blank the provider's default scopes, if any, will be used.
         */
        private Set<String> scope;

        /**
         * Client name.
         */
        private String clientName;

        private Boolean requireProofKey = true;

    }

    @Data
    public static class ProviderProps {

        /**
         * Authorization URI for the provider.
         */
        private @Nullable String authorizationUri;

        /**
         * Jwt URI for the provider.
         */
        private @Nullable String tokenUri;

        /**
         * User info URI for the provider.
         */
        private @Nullable String userInfoUri;

        /**
         * User info authentication method for the provider.
         */
        private @Nullable String userInfoAuthenticationMethod;

        /**
         * Name of the attribute that will be used to extract the username from the call to 'userInfoUri'.
         */
        private @Nullable String userNameAttribute;

        /**
         * JWK set URI for the provider.
         */
        private @Nullable String jwkSetUri;

        /**
         * URI that can either be an OpenID Connect discovery endpoint or an OAuth 2.0 Authorization Server Metadata
         * endpoint defined by RFC 8414.
         */
        private @Nullable String issuerUri;
    }
}

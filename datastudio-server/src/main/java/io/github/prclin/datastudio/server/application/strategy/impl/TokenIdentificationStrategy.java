package io.github.prclin.datastudio.server.application.strategy.impl;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.core.type.TypeReference;
import com.zitadel.Zitadel;
import io.github.prclin.datastudio.server.application.strategy.IdentificationStrategy;
import io.github.prclin.datastudio.server.infrastructure.configuration.oauth.client.ClientRegistration;
import io.github.prclin.datastudio.server.infrastructure.configuration.oauth.client.OAuth2ClientManager;
import io.github.prclin.datastudio.server.infrastructure.configuration.oauth.client.OidcParameterNames;
import io.github.prclin.datastudio.server.infrastructure.constants.ZitadelClaims;
import io.github.prclin.datastudio.server.infrastructure.context.Identity;
import io.github.prclin.datastudio.server.infrastructure.util.RequestUtil;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class TokenIdentificationStrategy implements IdentificationStrategy {
    private final Zitadel zitadel;
    private final OAuth2ClientManager clientManager;

    @Override
    public boolean supports(HttpServletRequest request) {
        Cookie at = RequestUtil.getCookie(request, OidcParameterNames.ACCESS_TOKEN);
        return at != null;
    }

    @Override
    public Identity identify(HttpServletRequest request, HttpServletResponse response) {
        Cookie at = RequestUtil.getCookie(request, OidcParameterNames.ACCESS_TOKEN);
        Optional<ClientRegistration> optional = clientManager.getRegistration("datastudio");
        if (optional.isEmpty()) return null;
        ClientRegistration registration = optional.get();
        assert at != null;
        IntrospectionResult result = introspectToken(registration, at.getValue());
        if (!result.getActive()) return null;

        return Identity.builder()
                .id(result.getSub())
                .organizationId(result.getOrganizationId())
                .build();
    }

    private IntrospectionResult introspectToken(ClientRegistration registration, String accessToken) {
        // basic auth value =  base64( urlEncode(client_id) + ":" + urlEncode(client_secret) )
        String basicAuth = "Basic " + HttpHeaders.encodeBasicAuth(registration.getClientId(), registration.getClientSecret(), StandardCharsets.UTF_8);
        //response body type
        TypeReference<IntrospectionResult> reference = new TypeReference<>() {
        };
        //do request
        return zitadel.getApiClient()
                .invokeAPI("/oauth/v2/introspect", "POST", null, null,
                        null, null, Map.of(HttpHeaders.AUTHORIZATION, basicAuth), null,
                        Map.of("token", accessToken), null, MediaType.APPLICATION_FORM_URLENCODED_VALUE,
                        null, reference);
    }

    @Data
    static class IntrospectionResult {
        private Boolean active;
        private List<String> amr;
        private List<String> aud;
        private Long authTime;
        private String clientId;
        private Long exp;
        private String familyName;
        private String givenName;
        private Long iat;
        private String iss;
        private String jti;
        private String locale;
        private String name;
        private Long nbf;
        private String preferredUsername;
        private String scope;
        private String sub;
        private String username;
        private String tokenType;
        private Long updatedAt;
        @JsonProperty(ZitadelClaims.ORG_ID)
        private String organizationId;
        @JsonProperty(ZitadelClaims.ORG_NAME)
        private String organizationName;
        @JsonProperty(ZitadelClaims.ORG_DOMAIN)
        private String organizationDomain;
    }
}

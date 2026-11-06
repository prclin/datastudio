package io.github.prclin.datastudio.server.application.strategy.impl;

import com.nimbusds.jwt.JWTClaimsSet;
import io.github.prclin.datastudio.server.application.strategy.IdentificationStrategy;
import io.github.prclin.datastudio.server.infrastructure.configuration.oauth.client.AuthorizationGrantRequest;
import io.github.prclin.datastudio.server.infrastructure.configuration.oauth.client.AuthorizationGrantResponse;
import io.github.prclin.datastudio.server.infrastructure.configuration.oauth.client.AuthorizationGrantType;
import io.github.prclin.datastudio.server.infrastructure.configuration.oauth.client.AuthorizationRequest;
import io.github.prclin.datastudio.server.infrastructure.configuration.oauth.client.ClientRegistration;
import io.github.prclin.datastudio.server.infrastructure.configuration.oauth.client.OAuth2ClientManager;
import io.github.prclin.datastudio.server.infrastructure.configuration.oauth.client.OAuthException;
import io.github.prclin.datastudio.server.infrastructure.configuration.oauth.client.OidcParameterNames;
import io.github.prclin.datastudio.server.infrastructure.constants.ZitadelClaims;
import io.github.prclin.datastudio.server.infrastructure.context.Identity;
import io.github.prclin.datastudio.server.infrastructure.util.RequestUtil;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Slf4j
@Component
@RequiredArgsConstructor
public class RefreshIdentificationStrategy implements IdentificationStrategy {
    private final OAuth2ClientManager clientManager;

    @Override
    public boolean supports(HttpServletRequest request) {
        Cookie at = RequestUtil.getCookie(request, OidcParameterNames.ACCESS_TOKEN);
        Cookie rt = RequestUtil.getCookie(request, OidcParameterNames.REFRESH_TOKEN);
        return at == null && rt != null;
    }

    @Override
    public Identity identify(HttpServletRequest request, HttpServletResponse response) {
        Cookie rt = RequestUtil.getCookie(request, OidcParameterNames.REFRESH_TOKEN);
        Optional<ClientRegistration> optional = clientManager.getRegistration("datastudio");
        if (optional.isEmpty()) return null;
        ClientRegistration registration = optional.get();

        AuthorizationGrantRequest grantRequest = AuthorizationGrantRequest.builder()
                .request(AuthorizationRequest.builder().refreshToken(rt.getValue()).scopes(registration.getScopes()).build())
                .registration(registration)
                .grantType(AuthorizationGrantType.REFRESH_TOKEN)
                .build();
        AuthorizationGrantResponse grantResponse;
        try {
            grantResponse = grantRequest.retrieve();
        } catch (OAuthException e) {
            log.warn("retrieve token failed!", e);
            return null;
        }

        //set cookies
        grantResponse.saveToken(response);

        JWTClaimsSet claimsSet = grantResponse.getIdToken().getClaimsSet();
        return Identity.builder()
                .id(claimsSet.getSubject())
                .organizationId(grantResponse.getIdToken().getClaim(ZitadelClaims.ORG_ID))
                .build();
    }
}

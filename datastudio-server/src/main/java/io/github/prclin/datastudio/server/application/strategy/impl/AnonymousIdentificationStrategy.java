package io.github.prclin.datastudio.server.application.strategy.impl;

import io.github.prclin.datastudio.server.application.strategy.IdentificationStrategy;
import io.github.prclin.datastudio.server.infrastructure.configuration.oauth.client.OidcParameterNames;
import io.github.prclin.datastudio.server.infrastructure.context.Identity;
import io.github.prclin.datastudio.server.infrastructure.util.RequestUtil;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;

@Component
public class AnonymousIdentificationStrategy implements IdentificationStrategy {
    @Override
    public boolean supports(HttpServletRequest request) {
        Cookie at = RequestUtil.getCookie(request, OidcParameterNames.ACCESS_TOKEN);
        Cookie rt = RequestUtil.getCookie(request, OidcParameterNames.REFRESH_TOKEN);
        return at == null && rt == null;
    }

    @Override
    public Identity identify(HttpServletRequest request, HttpServletResponse response) {
        return Identity.builder()
                .id("anonymous")
                .organizationId("anonymous")
                .build();
    }
}

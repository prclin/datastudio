package io.github.prclin.datastudio.server.facade.filter;

import io.github.prclin.datastudio.server.application.strategy.IdentificationStrategy;
import io.github.prclin.datastudio.server.infrastructure.context.Identity;
import io.github.prclin.datastudio.server.infrastructure.context.RequestContext;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.util.List;

@Component
@RequiredArgsConstructor
public class IdentityFilter extends OncePerRequestFilter {
    private final List<IdentificationStrategy> strategies;


    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        Identity identity = strategies.stream().filter(strategy -> strategy.supports(request))
                .findFirst()
                .map(strategy -> strategy.identify(request, response))
                .orElse(null);

        if (identity == null) {
            String redirectUri = UriComponentsBuilder.fromUriString(request.getRequestURL().toString()).replacePath("/api/oauth2/authenticate/datastudio").build().toUriString();
            response.sendRedirect(redirectUri);
        }

        RequestContext.IDENTITY.set(identity);
        try {
            filterChain.doFilter(request, response);
        } finally {
            RequestContext.IDENTITY.remove();
        }
    }


}

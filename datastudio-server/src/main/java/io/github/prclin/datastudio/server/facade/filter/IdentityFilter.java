package io.github.prclin.datastudio.server.facade.filter;

import io.github.prclin.datastudio.server.application.dto.ResponseBody;
import io.github.prclin.datastudio.server.application.strategy.IdentificationStrategy;
import io.github.prclin.datastudio.server.infrastructure.context.Identity;
import io.github.prclin.datastudio.server.infrastructure.context.RequestContext;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.util.UriComponentsBuilder;
import tools.jackson.databind.ObjectMapper;
import tools.jackson.databind.node.ObjectNode;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.List;

@Component
@RequiredArgsConstructor
public class IdentityFilter extends OncePerRequestFilter {
    private final List<IdentificationStrategy> strategies;
    private final ObjectMapper mapper;


    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        Identity identity = strategies.stream().filter(strategy -> strategy.supports(request))
                .findFirst()
                .map(strategy -> strategy.identify(request, response))
                .orElse(null);

        if (identity == null) {
            String redirectUri = UriComponentsBuilder.fromUriString(request.getRequestURL().toString()).replacePath("/api/oauth2/authenticate/datastudio").build().toUriString();
            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
            response.setCharacterEncoding(StandardCharsets.UTF_8);
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            ResponseBody<ObjectNode> body = ResponseBody.clientError("Not logged in or exipred!", mapper.createObjectNode().put("auth_endpoint", redirectUri));
            response.getWriter().write(mapper.writeValueAsString(body));
            response.getWriter().flush();
            return;
        }

        RequestContext.IDENTITY.set(identity);
        try {
            filterChain.doFilter(request, response);
        } finally {
            RequestContext.IDENTITY.remove();
        }
    }


}

package io.github.prclin.datastudio.server.application.strategy;

import io.github.prclin.datastudio.server.infrastructure.context.Identity;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public interface IdentificationStrategy {
    boolean supports(HttpServletRequest request);

    Identity identify(HttpServletRequest request, HttpServletResponse response);
}

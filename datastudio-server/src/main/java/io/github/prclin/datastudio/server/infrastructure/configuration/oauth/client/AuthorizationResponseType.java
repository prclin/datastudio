package io.github.prclin.datastudio.server.infrastructure.configuration.oauth.client;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Getter
public enum AuthorizationResponseType {
    CODE("code");
    private final String value;

}

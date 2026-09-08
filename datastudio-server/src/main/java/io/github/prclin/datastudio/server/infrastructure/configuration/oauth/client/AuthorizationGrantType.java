package io.github.prclin.datastudio.server.infrastructure.configuration.oauth.client;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Getter
public enum AuthorizationGrantType {
    AUTHORIZATION_CODE("authorization_code"),
    REFRESH_TOKEN("refresh_token"),
    CLIENT_CREDENTIALS("client_credentials"),
    JWT_BEARER("urn:ietf:params:oauth:grant-type:jwt-bearer"),
    DEVICE_CODE("urn:ietf:params:oauth:grant-type:device_code"),
    TOKEN_EXCHANGE("urn:ietf:params:oauth:grant-type:token-exchange");

    private final String value;
}

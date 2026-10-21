package io.github.prclin.datastudio.server.infrastructure.configuration.oauth.client;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Getter
public enum ClientAuthenticationMethod {
    NONE("none"), CLIENT_SECRET_BASIC("client_secret_basic"), CLIENT_SECRET_POST("client_secret_post"), PRIVATE_KEY_JWT("private_key_jwt");
    private final String value;

    public static ClientAuthenticationMethod parse(String value) {
        for (ClientAuthenticationMethod method : values()) {
            if (method.value.equals(value)) {
                return method;
            }
        }
        return null;
    }
}

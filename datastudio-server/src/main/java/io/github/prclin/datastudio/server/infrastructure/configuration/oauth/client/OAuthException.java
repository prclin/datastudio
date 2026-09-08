package io.github.prclin.datastudio.server.infrastructure.configuration.oauth.client;

public class OAuthException extends Exception {
    public OAuthException(String message) {
        super(message);
    }

    public OAuthException(String message, Throwable cause) {
        super(message, cause);
    }
}

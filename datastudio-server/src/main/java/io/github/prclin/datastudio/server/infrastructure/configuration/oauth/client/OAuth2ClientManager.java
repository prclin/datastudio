package io.github.prclin.datastudio.server.infrastructure.configuration.oauth.client;

import lombok.Builder;
import lombok.Data;

import java.util.Map;
import java.util.Optional;

@Data
@Builder
public class OAuth2ClientManager {
    private Map<String, ClientRegistration> registrations;
    private Map<String, ServiceProvider> providers;

    public Optional<ClientRegistration> getRegistration(String registrationId) {
        return Optional.ofNullable(registrations.get(registrationId));
    }
}

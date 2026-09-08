package io.github.prclin.datastudio.server.infrastructure.configuration.oauth.client.autoconfigure;

import com.nimbusds.oauth2.sdk.auth.ClientAuthenticationMethod;
import io.github.prclin.datastudio.server.infrastructure.configuration.oauth.client.ClientRegistration;
import io.github.prclin.datastudio.server.infrastructure.configuration.oauth.client.ClientRegistration.ClientRegistrationBuilder;
import io.github.prclin.datastudio.server.infrastructure.configuration.oauth.client.OAuth2ClientManager;
import io.github.prclin.datastudio.server.infrastructure.configuration.oauth.client.ProviderMetadataKeys;
import io.github.prclin.datastudio.server.infrastructure.configuration.oauth.client.ServiceProvider;
import io.github.prclin.datastudio.server.infrastructure.configuration.oauth.client.ServiceProvider.ServiceProviderBuilder;
import io.github.prclin.datastudio.server.infrastructure.configuration.oauth.client.autoconfigure.OAuth2ClientProperties.ProviderProps;
import io.github.prclin.datastudio.server.infrastructure.configuration.oauth.client.autoconfigure.OAuth2ClientProperties.RegistrationProps;
import org.springframework.boot.context.properties.PropertyMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import tools.jackson.databind.JsonNode;

import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Spliterator;
import java.util.Spliterators;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

@Configuration
public class OAuth2Configuration {

    private static ClientAuthenticationMethod getClientAuthenticationMethod(
            List<com.nimbusds.oauth2.sdk.auth.ClientAuthenticationMethod> metadataAuthMethods) {
        if (metadataAuthMethods == null || metadataAuthMethods
                .contains(com.nimbusds.oauth2.sdk.auth.ClientAuthenticationMethod.CLIENT_SECRET_BASIC)) {
            // If null, the default includes client_secret_basic
            return ClientAuthenticationMethod.CLIENT_SECRET_BASIC;
        }
        if (metadataAuthMethods.contains(com.nimbusds.oauth2.sdk.auth.ClientAuthenticationMethod.CLIENT_SECRET_POST)) {
            return ClientAuthenticationMethod.CLIENT_SECRET_POST;
        }
        if (metadataAuthMethods.contains(com.nimbusds.oauth2.sdk.auth.ClientAuthenticationMethod.NONE)) {
            return ClientAuthenticationMethod.NONE;
        }
        return null;
    }

    @Bean
    public OAuth2ClientManager oauth2ClientManager(OAuth2ClientProperties props) {
        Map<String, ServiceProvider> providers = props.getProviders().entrySet().stream().map(entry -> {
            ProviderProps providerProps = entry.getValue();
            ServiceProviderBuilder builder = providerProps.getIssuerUri() == null ? ServiceProvider.builder() : ServiceProvider.fromIssuerLocation(providerProps.getIssuerUri());
            builder.providerId(entry.getKey());
            PropertyMapper map = PropertyMapper.get();
            map.from(providerProps::getAuthorizationUri).to(builder::authorizationUri);
            map.from(providerProps::getTokenUri).to(builder::tokenUri);
            map.from(providerProps::getUserInfoUri).to(builder::userInfoUri);
            map.from(providerProps::getUserInfoAuthenticationMethod).to(builder::userInfoAuthenticationMethod);
            map.from(providerProps::getUserNameAttribute).to(builder::userNameAttributeName);
            map.from(providerProps::getJwkSetUri).to(builder::jwkSetUri);
            return Map.entry(entry.getKey(), builder.build());
        }).collect(Collectors.toMap(Entry::getKey, Entry::getValue));

        Map<String, ClientRegistration> registrations = props.getRegistrations().entrySet().stream().map(entry -> {
            RegistrationProps registrationProps = entry.getValue();
            PropertyMapper map = PropertyMapper.get();
            ClientRegistrationBuilder builder = ClientRegistration.builder()
                    .registrationId(entry.getKey())
                    .clientName(entry.getKey());

            ServiceProvider provider = providers.get(registrationProps.getProvider());
            if (provider == null) throw new RuntimeException("provider not found!");
            builder.serviceProvider(provider);
            JsonNode methodsNode = provider.getConfigurationMetadata().path(ProviderMetadataKeys.TOKEN_ENDPOINT_AUTH_METHODS_SUPPORTED);
            if (methodsNode.isArray()) {
                List<ClientAuthenticationMethod> methods = StreamSupport.stream(
                                Spliterators.spliteratorUnknownSize(methodsNode.iterator(), Spliterator.ORDERED),
                                false
                        ).map(x -> ClientAuthenticationMethod.parse(x.asString()))
                        .toList();
                ClientAuthenticationMethod method = getClientAuthenticationMethod(methods);
                builder.clientAuthenticationMethod(method);
            }

            map.from(registrationProps::getClientId).to(builder::clientId);
            map.from(registrationProps::getClientSecret).to(builder::clientSecret);
            map.from(registrationProps::getClientAuthenticationMethod)
                    .as(ClientAuthenticationMethod::new)
                    .to(builder::clientAuthenticationMethod);
            map.from(registrationProps::getAuthorizationGrantType).to(builder::authorizationGrantType);
            map.from(registrationProps::getRedirectUri).to(builder::redirectUri);
            map.from(registrationProps::getScope).to(builder::scopes);
            map.from(registrationProps::getClientName).to(builder::clientName);
            map.from(registrationProps::getRequireProofKey).to(builder::requireProofKey);


            return Map.entry(entry.getKey(), builder.build());
        }).collect(Collectors.toMap(Entry::getKey, Entry::getValue));

        return OAuth2ClientManager.builder().providers(providers).registrations(registrations).build();
    }

}

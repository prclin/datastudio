package io.github.prclin.datastudio.server.infrastructure.configuration.oauth.client;

import lombok.Builder;
import lombok.Data;
import org.springframework.http.RequestEntity;
import org.springframework.util.Assert;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponents;
import org.springframework.web.util.UriComponentsBuilder;
import tools.jackson.databind.node.ObjectNode;

import java.util.List;
import java.util.function.Supplier;

@Data
@Builder
public class ServiceProvider {
    private static final String OIDC_METADATA_PATH = "/.well-known/openid-configuration";
    private static final String OAUTH_METADATA_PATH = "/.well-known/oauth-authorization-server";
    private String providerId;
    private ObjectNode configurationMetadata;
    private String authorizationUri;
    private String tokenUri;
    private String userInfoUri;
    @Builder.Default
    private String userInfoAuthenticationMethod = "Bearer";
    private String userNameAttributeName;
    private String jwkSetUri;
    private String issuerUri;

    public static ServiceProviderBuilder fromIssuerLocation(String issuer) {
        IllegalArgumentException exception = new IllegalArgumentException("Unable to resolve Configuration with the provided Issuer of \"" + issuer + "\"");
        for (Supplier<ServiceProviderBuilder> supplier : List.of(
                metadataSupplier(issuer, oidcUri(issuer)),
                metadataSupplier(issuer, oidcRfc8414Uri(issuer)),
                metadataSupplier(issuer, oauthUri(issuer))
        )) {
            try {
                return supplier.get();
            } catch (Exception e) {
                exception.addSuppressed(e);
            }
        }
        throw exception;
    }

    static Supplier<ServiceProviderBuilder> metadataSupplier(String issuer, UriComponents uri) {
        return () -> {
            RestTemplate rest = new RestTemplate();
            RequestEntity<Void> request = RequestEntity.get(uri.toUriString()).build();
            ObjectNode metadata = rest.exchange(request, ObjectNode.class).getBody();
            Assert.notNull(metadata, "metadata endpoint returned empty body");
            String metadataIssuer = metadata.path("issuer").asString();
            Assert.state(issuer.equals(metadataIssuer), () -> "The Issuer \"" + metadataIssuer + "\" provided in the configuration metadata did not match the requested issuer \"" + issuer + "\"");
            return builder().configurationMetadata(metadata)
                    .authorizationUri(metadata.path(ProviderMetadataKeys.AUTHORIZATION_ENDPOINT).asString(null))
                    .tokenUri(metadata.path(ProviderMetadataKeys.TOKEN_ENDPOINT).asString(null))
                    .userInfoUri(metadata.path(ProviderMetadataKeys.USERINFO_ENDPOINT).asString(null))
                    .jwkSetUri(metadata.path(ProviderMetadataKeys.JWKS_URI).asString(null))
                    //todo 使用nimbusds的常量
                    .userNameAttributeName("sub")
                    .userInfoAuthenticationMethod("Bearer")
                    .issuerUri(issuer);
        };
    }

    static UriComponents oidcUri(String issuer) {
        UriComponents uri = UriComponentsBuilder.fromUriString(issuer).build();
        return UriComponentsBuilder.newInstance().uriComponents(uri)
                .replacePath(uri.getPath() + OIDC_METADATA_PATH)
                .build();
    }

    static UriComponents oidcRfc8414Uri(String issuer) {
        UriComponents uri = UriComponentsBuilder.fromUriString(issuer).build();
        return UriComponentsBuilder.newInstance().uriComponents(uri)
                .replacePath(OIDC_METADATA_PATH + uri.getPath())
                .build();
    }

    static UriComponents oauthUri(String issuer) {
        UriComponents uri = UriComponentsBuilder.fromUriString(issuer).build();
        return UriComponentsBuilder.newInstance().uriComponents(uri)
                .replacePath(OAUTH_METADATA_PATH + uri.getPath())
                .build();
    }


}
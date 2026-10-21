package io.github.prclin.datastudio.server.infrastructure.configuration.oauth.client;

import lombok.Builder;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.util.CollectionUtils;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestClient;
import tools.jackson.databind.node.ObjectNode;

import java.util.List;
import java.util.Set;

@Slf4j
@Data
@Builder
public class AuthorizationGrantRequest {
    private final RestClient restClient = RestClient.builder().build();
    private AuthorizationGrantType grantType;
    private ClientRegistration registration;
    private AuthorizationRequest request;
    private AuthorizationResponse response;

    public static boolean supports(ClientRegistration registration) {
        return Set.of(ClientAuthenticationMethod.NONE, ClientAuthenticationMethod.CLIENT_SECRET_BASIC, ClientAuthenticationMethod.CLIENT_SECRET_POST).contains(registration.getClientAuthenticationMethod());
    }

    public AuthorizationGrantResponse retrieve() throws OAuthException {
        if (!supports(registration)) throw new IllegalArgumentException(String.format(
                "This class supports `client_secret_basic`, `client_secret_post`, and `none` by default. Client [%s] is using [%s] instead.",
                registration.getRegistrationId(), registration.getClientAuthenticationMethod().getValue()));

        //send request
        ObjectNode body = restClient.post()
                .uri(registration.getServiceProvider().getTokenUri())
                .headers(headers -> headers.addAll(headers()))
                .body(params())
                .retrieve()
                .body(ObjectNode.class);

        if (body == null)
            throw new OAuthException(String.format("grant request to %s for %s returned empty body!", registration.getServiceProvider().getTokenUri(), registration.getRegistrationId()));

        return AuthorizationGrantResponse.from(registration.getJwtDecoder(), body);
    }

    public HttpHeaders headers() {
        HttpHeaders headers = new HttpHeaders();
        headers.setAccept(List.of(MediaType.APPLICATION_JSON));
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
        if (ClientAuthenticationMethod.CLIENT_SECRET_BASIC.equals(registration.getClientAuthenticationMethod()))
            headers.setBasicAuth(registration.getClientId(), registration.getClientSecret());
        return headers;
    }

    public MultiValueMap<String, String> params() {
        MultiValueMap<String, String> parameters = new LinkedMultiValueMap<>();
        parameters.set(OidcParameterNames.GRANT_TYPE, grantType.getValue());
        if (!ClientAuthenticationMethod.CLIENT_SECRET_BASIC.equals(registration.getClientAuthenticationMethod())) {
            parameters.set(OidcParameterNames.CLIENT_ID, registration.getClientId());
        }
        if (ClientAuthenticationMethod.CLIENT_SECRET_POST.equals(registration.getClientAuthenticationMethod())) {
            parameters.set(OidcParameterNames.CLIENT_SECRET, registration.getClientSecret());
        }

        MultiValueMap<String, String> defaultParams = switch (grantType) {
            case AUTHORIZATION_CODE -> authorizationCodeParams();
            case REFRESH_TOKEN -> refreshTokenParams();
            case CLIENT_CREDENTIALS -> clientCredentialParams();
            default -> null;
        };

        if (defaultParams != null) parameters.addAll(defaultParams);
        return parameters;
    }

    public MultiValueMap<String, String> authorizationCodeParams() {
        MultiValueMap<String, String> parameters = new LinkedMultiValueMap<>();
        parameters.set(OidcParameterNames.CODE, response.getCode());
        String redirectUri = request.getRedirectUri();
        if (redirectUri != null)
            parameters.set(OidcParameterNames.REDIRECT_URI, redirectUri);
        String codeVerifier = (String) request.getAttributes().get(OidcParameterNames.CODE_VERIFIER);
        if (codeVerifier != null)
            parameters.set(OidcParameterNames.CODE_VERIFIER, codeVerifier);
        return parameters;
    }

    public MultiValueMap<String, String> refreshTokenParams() {
        MultiValueMap<String, String> parameters = new LinkedMultiValueMap<>();
        if (!CollectionUtils.isEmpty(request.getScopes()))
            parameters.set(OidcParameterNames.SCOPE, StringUtils.collectionToDelimitedString(request.getScopes(), " "));
        parameters.set(OidcParameterNames.REFRESH_TOKEN, request.getRefreshToken());
        return parameters;
    }

    MultiValueMap<String, String> clientCredentialParams() {
        MultiValueMap<String, String> parameters = new LinkedMultiValueMap<>();
        if (!CollectionUtils.isEmpty(registration.getScopes()))
            parameters.set(OidcParameterNames.SCOPE, StringUtils.collectionToDelimitedString(registration.getScopes(), " "));
        return parameters;
    }
}

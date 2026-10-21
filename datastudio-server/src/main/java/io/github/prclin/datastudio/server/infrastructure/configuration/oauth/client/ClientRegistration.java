package io.github.prclin.datastudio.server.infrastructure.configuration.oauth.client;

import com.nimbusds.jwt.JWT;
import com.nimbusds.openid.connect.sdk.OIDCScopeValue;
import io.github.prclin.datastudio.server.infrastructure.configuration.oauth.client.AuthorizationRequest.AuthorizationRequestBuilder;
import jakarta.servlet.http.HttpServletRequest;
import lombok.Builder;
import lombok.Data;
import org.springframework.util.Assert;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;
import org.springframework.web.util.UriComponents;
import org.springframework.web.util.UriComponentsBuilder;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.text.ParseException;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;

@Data
@Builder
public class ClientRegistration {
    private Set<String> scopes;
    private ServiceProvider serviceProvider;
    private String registrationId;
    private String clientId;
    private String clientSecret;
    private ClientAuthenticationMethod clientAuthenticationMethod;
    private AuthorizationGrantType authorizationGrantType;
    private String redirectUri;
    private String clientName;
    private Boolean requireProofKey;
    private JwtDecoder jwtDecoder;

    private static String generateKey() {
        byte[] bytes = new byte[96];
        new SecureRandom().nextBytes(bytes);
        return Base64.getUrlEncoder()
                .withoutPadding()
                .encodeToString(bytes);
    }

    private static String createHash(String value) {
        MessageDigest md;
        try {
            md = MessageDigest.getInstance("SHA-256");
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException(e);
        }
        byte[] digest = md.digest(value.getBytes(StandardCharsets.US_ASCII));
        return Base64.getUrlEncoder().withoutPadding().encodeToString(digest);
    }

    public static boolean validateNonce(AuthorizationRequest authorizationRequest, JWT idToken) throws ParseException {
        String requestNonce = (String) authorizationRequest.getAttributes().get(OidcParameterNames.NONCE);
        if (requestNonce == null) return true;
        String nonceHash = createHash(requestNonce);
        String nonceHashClaim = idToken.getJWTClaimsSet().getStringClaim(OidcParameterNames.NONCE);
        return nonceHashClaim.equals(nonceHash);
    }

    private static void applyNonce(AuthorizationRequestBuilder builder) {
        String nonce = generateKey();
        String nonceHash = createHash(nonce);
        builder.attribute(OidcParameterNames.NONCE, nonce);
        builder.param(OidcParameterNames.NONCE, nonceHash);
    }

    private static void applyPkce(AuthorizationRequestBuilder builder) {
        String codeVerifier = generateKey();
        builder.attribute(OidcParameterNames.CODE_VERIFIER, codeVerifier);
        String codeChallenge = createHash(codeVerifier);
        builder.param(OidcParameterNames.CODE_CHALLENGE, codeChallenge)
                .param(OidcParameterNames.CODE_CHALLENGE_METHOD, "S256");

    }

    private String expandRedirectUri(HttpServletRequest request) {
        Map<String, String> uriVariables = new HashMap<>();
        uriVariables.put("registrationId", registrationId);
        // @formatter:off
        UriComponents uriComponents = UriComponentsBuilder.fromUriString(request.getRequestURL().toString())
                .replacePath(request.getContextPath())
                .replaceQuery(null)
                .fragment(null)
                .build();
        // @formatter:on
        String scheme = uriComponents.getScheme();
        uriVariables.put("baseScheme", (scheme != null) ? scheme : "");
        String host = uriComponents.getHost();
        uriVariables.put("baseHost", (host != null) ? host : "");
        // following logic is based on HierarchicalUriComponents#toUriString()
        int port = uriComponents.getPort();
        uriVariables.put("basePort", (port == -1) ? "" : ":" + port);
        String path = uriComponents.getPath();
        if (StringUtils.hasLength(path)) {
            if (path.charAt(0) != '/') {
                path = '/' + path;
            }
        }
        uriVariables.put("basePath", (path != null) ? path : "");
        uriVariables.put("baseUrl", uriComponents.toUriString());
        return UriComponentsBuilder.fromUriString(redirectUri)
                .buildAndExpand(uriVariables)
                .toUriString();
    }

    public AuthorizationRequest authorizationRequest(HttpServletRequest request) {
        //verify todo 移动到properties或注册时校验
        Assert.hasText(serviceProvider.getAuthorizationUri(), "authorizationUri cannot be empty");
        Assert.hasText(clientId, "clientId cannot be empty");

        //expand redirect uri
        String redirectUri = expandRedirectUri(request);

        AuthorizationRequestBuilder builder = AuthorizationRequest.builder()
                .registrationId(registrationId)
                .clientId(clientId)
                .authorizationUri(serviceProvider.getAuthorizationUri())
                .redirectUri(redirectUri)
                .scopes(scopes)
                .state(generateKey());

        if (!CollectionUtils.isEmpty(scopes) && scopes.contains(OIDCScopeValue.OPENID.getValue())) {
            // Section 3.1.2.1 Authentication Request -
            // https://openid.net/specs/openid-connect-core-1_0.html#AuthRequest scope
            // REQUIRED. OpenID Connect requests MUST contain the "openid" scope
            // value.
            applyNonce(builder);
        }

        //apply pkce
        if (requireProofKey) applyPkce(builder);
        return builder.build();
    }


    public JwtDecoder getJwtDecoder() {
        if (jwtDecoder == null) {
            jwtDecoder = new JwtDecoder(serviceProvider.getJwkSetUri());
        }
        return jwtDecoder;
    }

}
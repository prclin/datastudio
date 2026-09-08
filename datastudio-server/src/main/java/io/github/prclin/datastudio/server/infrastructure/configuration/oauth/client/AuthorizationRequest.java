package io.github.prclin.datastudio.server.infrastructure.configuration.oauth.client;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.util.CollectionUtils;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.util.StringUtils;
import org.springframework.web.util.UriComponentsBuilder;
import org.springframework.web.util.UriUtils;
import tools.jackson.databind.ObjectMapper;

import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.Base64;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Optional;
import java.util.Set;

import static io.github.prclin.datastudio.server.infrastructure.configuration.oauth.client.AuthorizationGrantType.AUTHORIZATION_CODE;

@Data
@Builder
@Slf4j
@NoArgsConstructor
@AllArgsConstructor
public class AuthorizationRequest {
    public static final String COOKIE_NAME = "authorization_request";
    public static final String COOKIE_PATH = "/api/oauth2/code/";
    public static final String SAME_SITE = "Lax";
    public static final boolean HTTP_ONLY = true;
    private static final ObjectMapper mapper = new ObjectMapper();
    @Builder.Default
    private AuthorizationGrantType authorizationGrantType = AUTHORIZATION_CODE;
    @Builder.Default
    private AuthorizationResponseType responseType = AuthorizationResponseType.CODE;
    private String registrationId;
    private String clientId;
    private String redirectUri;
    private Set<String> scopes;
    private String state;
    @Builder.Default
    private Map<String, Object> params = new HashMap<>();
    @Builder.Default
    private Map<String, Object> attributes = new HashMap<>();
    private String authorizationUri;
    private String authorizationRequestUri;
    private String refreshToken;

    public static void saveAuthorizationRequest(AuthorizationRequest req, HttpServletResponse response) {
        String json = mapper.writeValueAsString(req);
        String cookieValue = Base64.getUrlEncoder().withoutPadding().encodeToString(json.getBytes(StandardCharsets.UTF_8));
        String cookie = ResponseCookie.from(COOKIE_NAME, cookieValue)
                .path(COOKIE_PATH)
                .httpOnly(HTTP_ONLY)
                .sameSite(SAME_SITE)
                .build().toString();
        response.addHeader(HttpHeaders.SET_COOKIE, cookie);
    }

    public static AuthorizationRequest removeAuthorizationRequest(HttpServletRequest request, HttpServletResponse response) {
        Cookie[] cookies = request.getCookies();
        if (cookies == null) return null;

        Optional<Cookie> first = Arrays.stream(cookies).filter(cookie -> cookie.getName().equals(AuthorizationRequest.COOKIE_NAME))
                .findFirst();
        if (first.isEmpty()) return null;

        AuthorizationRequest req;
        try {
            //            todo 解析问题
            req = mapper.readValue(new String(Base64.getUrlDecoder().decode(first.get().getValue().getBytes(StandardCharsets.UTF_8))), AuthorizationRequest.class);
        } catch (Exception e) {
            log.info("invalid authorization request cookie value!", e);
            return null;
        }

        String cookie = ResponseCookie.from(COOKIE_NAME, null)
                .path(COOKIE_PATH)
                .httpOnly(HTTP_ONLY)
                .sameSite(SAME_SITE)
                .maxAge(0)
                .build().toString();
        response.addHeader(HttpHeaders.SET_COOKIE, cookie);

        return req;
    }

    private static String encodeQueryParam(String value) {
        return UriUtils.encodeQueryParam(value, StandardCharsets.UTF_8);
    }


    public String getAuthorizationRequestUri() {
        if (authorizationRequestUri == null) {
            this.authorizationRequestUri = buildAuthorizationRequestUri();
        }
        return this.authorizationRequestUri;
    }

    private String buildAuthorizationRequestUri() {
        Map<String, Object> parameters = getParameters(); // Not encoded
        MultiValueMap<String, String> queryParams = new LinkedMultiValueMap<>();
        parameters.forEach((k, v) -> {
            String key = encodeQueryParam(k);
            if (v instanceof Iterable) {
                ((Iterable<?>) v).forEach((value) -> queryParams.add(key, encodeQueryParam(String.valueOf(value))));
            } else if (v != null && v.getClass().isArray()) {
                Object[] values = (Object[]) v;
                for (Object value : values) {
                    queryParams.add(key, encodeQueryParam(String.valueOf(value)));
                }
            } else {
                queryParams.set(key, encodeQueryParam(String.valueOf(v)));
            }
        });
        return UriComponentsBuilder.fromUriString(authorizationUri).queryParams(queryParams)
                .encode(StandardCharsets.UTF_8)
                .build(true)
                .toUriString();
    }

    private Map<String, Object> getParameters() {
        Map<String, Object> parameters = new LinkedHashMap<>();
        parameters.put(OidcParameterNames.RESPONSE_TYPE, this.responseType.getValue());
        parameters.put(OidcParameterNames.CLIENT_ID, this.clientId);
        if (!CollectionUtils.isEmpty(this.scopes)) {
            parameters.put(OidcParameterNames.SCOPE, StringUtils.collectionToDelimitedString(this.scopes, " "));
        }
        if (this.state != null) {
            parameters.put(OidcParameterNames.STATE, this.state);
        }
        if (this.redirectUri != null) {
            parameters.put(OidcParameterNames.REDIRECT_URI, this.redirectUri);
        }
        parameters.putAll(this.params);
        return parameters;
    }

    public static class AuthorizationRequestBuilder {

        public AuthorizationRequestBuilder param(String key, Object value) {
            if (this.params$value == null) {
                this.params$value = new HashMap<>();
                this.params$set = true;
            }
            this.params$value.put(key, value);
            return this;
        }

        @SuppressWarnings("UnusedReturnValue")
        public AuthorizationRequestBuilder attribute(String key, Object value) {
            if (this.attributes$value == null) {
                this.attributes$value = new HashMap<>();
                this.attributes$set = true;
            }
            this.attributes$value.put(key, value);
            return this;
        }


    }
}
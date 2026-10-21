package io.github.prclin.datastudio.server.infrastructure.configuration.oauth.client;

import com.nimbusds.jwt.JWT;
import jakarta.servlet.http.HttpServletResponse;
import lombok.Builder;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import tools.jackson.databind.node.ObjectNode;

import java.text.ParseException;
import java.time.Duration;
import java.time.Instant;

@Slf4j
@Data
@Builder
public class AuthorizationGrantResponse {
    public static final String COOKIE_PATH = "/";
    public static final boolean HTTP_ONLY = true;
    public static final String SAME_SITE = "Lax";
    private JWT idToken;
    private String accessToken;
    private Integer expireIn;
    private String refreshToken;
    private ObjectNode body;


    public static AuthorizationGrantResponse from(JwtDecoder jwtDecoder, ObjectNode body) throws OAuthException {
        JWT idToken = jwtDecoder.decode(body.path(OidcParameterNames.ID_TOKEN).asString());
        return builder()
                .idToken(idToken)
                .accessToken(body.path(OidcParameterNames.ACCESS_TOKEN).asString())
                .expireIn(body.path(OidcParameterNames.EXPIRES_IN).asInt())
                .refreshToken(body.path(OidcParameterNames.REFRESH_TOKEN).asString())
                .body(body)
                .build();

    }


    public void saveToken(HttpServletResponse response) throws ParseException {
        String idValue = ResponseCookie.from(OidcParameterNames.ID_TOKEN, idToken.serialize())
                .path(COOKIE_PATH)
                .httpOnly(HTTP_ONLY)
                .sameSite(SAME_SITE)
                .maxAge(Duration.between(Instant.now(), idToken.getJWTClaimsSet().getExpirationTime().toInstant()))
                .build()
                .toString();
        response.addHeader(HttpHeaders.SET_COOKIE, idValue);

        String accessValue = ResponseCookie.from(OidcParameterNames.ACCESS_TOKEN, accessToken)
                .path(COOKIE_PATH)
                .httpOnly(HTTP_ONLY)
                .sameSite(SAME_SITE)
                .maxAge(expireIn)
                .build()
                .toString();
        response.addHeader(HttpHeaders.SET_COOKIE, accessValue);


        String refreshValue = ResponseCookie.from(OidcParameterNames.REFRESH_TOKEN, refreshToken)
                .path(COOKIE_PATH)
                .httpOnly(HTTP_ONLY)
                .sameSite(SAME_SITE)
                .maxAge(-1)
                .build()
                .toString();
        response.addHeader(HttpHeaders.SET_COOKIE, refreshValue);
    }
}

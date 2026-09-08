package io.github.prclin.datastudio.server.infrastructure.configuration.oauth.client;

import com.nimbusds.jose.JWSAlgorithm;
import com.nimbusds.jose.jwk.source.JWKSource;
import com.nimbusds.jose.jwk.source.JWKSourceBuilder;
import com.nimbusds.jose.proc.JWSKeySelector;
import com.nimbusds.jose.proc.JWSVerificationKeySelector;
import com.nimbusds.jose.proc.SecurityContext;
import com.nimbusds.jwt.JWT;
import com.nimbusds.jwt.JWTParser;
import com.nimbusds.jwt.proc.BadJWTException;
import com.nimbusds.jwt.proc.ConfigurableJWTProcessor;
import com.nimbusds.jwt.proc.DefaultJWTProcessor;

import java.net.MalformedURLException;
import java.net.URL;
import java.util.Date;
import java.util.Set;

public class JwtDecoder {
    private final String jwtSetUri;
    private ConfigurableJWTProcessor<SecurityContext> processor;

    public JwtDecoder(String jwkSetUri) {
        this.jwtSetUri = jwkSetUri;
    }

    private void init() throws MalformedURLException {
        if (this.processor != null) return;
        // 从远程 JWK Set 获取公钥
        JWKSource<SecurityContext> keySource = JWKSourceBuilder.create(new URL(this.jwtSetUri)).build();

        DefaultJWTProcessor<SecurityContext> processor = new DefaultJWTProcessor<>();

        // JWT 签名算法
        JWSKeySelector<SecurityContext> keySelector = new JWSVerificationKeySelector<>(Set.of(JWSAlgorithm.RS256), keySource);

        processor.setJWSKeySelector(keySelector);
        processor.setJWTClaimsSetVerifier((claims, context) -> {
            if (claims.getExpirationTime().before(new Date())) throw new BadJWTException("token expired!");
        });
        this.processor = processor;
    }

    public JWT decode(String token) throws OAuthException {
        return decode(token, true);
    }

    public JWT decode(String token, boolean verify) throws OAuthException {
        try {
            JWT jwt = JWTParser.parse(token);
            if (verify) {
                init();
                processor.process(token, null);
            }
            return jwt;
        } catch (Exception e) {
            throw new OAuthException("parse and verify jwt failed!", e);
        }
    }


}

package io.github.prclin.datastudio.server.infrastructure.configuration.oauth.client;

import com.nimbusds.jose.Header;
import com.nimbusds.jose.util.Base64URL;
import com.nimbusds.jwt.JWT;
import com.nimbusds.jwt.JWTClaimsSet;
import lombok.Data;

import java.text.ParseException;

@Data
public class Jwt implements JWT {
    private JWT jwt;
    private JWTClaimsSet claimsSet;

    public Jwt(JWT jwt) throws ParseException {
        this.jwt = jwt;
        this.claimsSet = jwt.getJWTClaimsSet();
    }

    public <T> T getClaim(String name) {
        return (T) claimsSet.getClaim(name);
    }

    @Override
    public Header getHeader() {
        return jwt.getHeader();
    }

    @Override
    public JWTClaimsSet getJWTClaimsSet() throws ParseException {
        return jwt.getJWTClaimsSet();
    }

    @Override
    public Base64URL[] getParsedParts() {
        return jwt.getParsedParts();
    }

    @Override
    public String getParsedString() {
        return jwt.getParsedString();
    }

    @Override
    public String serialize() {
        return jwt.serialize();
    }
}

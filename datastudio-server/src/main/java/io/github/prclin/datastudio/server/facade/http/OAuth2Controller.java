package io.github.prclin.datastudio.server.facade.http;

import io.github.prclin.datastudio.server.application.dto.ResponseBody;
import io.github.prclin.datastudio.server.infrastructure.configuration.oauth.client.AuthorizationGrantRequest;
import io.github.prclin.datastudio.server.infrastructure.configuration.oauth.client.AuthorizationGrantResponse;
import io.github.prclin.datastudio.server.infrastructure.configuration.oauth.client.AuthorizationGrantType;
import io.github.prclin.datastudio.server.infrastructure.configuration.oauth.client.AuthorizationRequest;
import io.github.prclin.datastudio.server.infrastructure.configuration.oauth.client.AuthorizationResponse;
import io.github.prclin.datastudio.server.infrastructure.configuration.oauth.client.ClientRegistration;
import io.github.prclin.datastudio.server.infrastructure.configuration.oauth.client.OAuth2ClientManager;
import io.github.prclin.datastudio.server.infrastructure.configuration.oauth.client.OAuthException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.text.ParseException;
import java.util.Optional;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/oauth2")
public class OAuth2Controller {
    private final OAuth2ClientManager clientManager;


    /**
     * 重定向到对应系统授权端点?continue
     */
    @GetMapping("/authenticate/{registrationId}")
    public ResponseBody<Void> getAuthenticate(HttpServletRequest request, HttpServletResponse response, @PathVariable String registrationId) throws IOException {
        Optional<ClientRegistration> optional = clientManager.getRegistration(registrationId);
        if (optional.isEmpty())
            return ResponseBody.clientError(String.format("no service provider %s found", registrationId));
        ClientRegistration registration = optional.get();

        AuthorizationRequest req = registration.authorizationRequest(request);
        AuthorizationRequest.saveAuthorizationRequest(req, response);

        response.sendRedirect(req.getAuthorizationRequestUri());

        return ResponseBody.ok();
    }


    /**
     * 授权码接收
     */
    @GetMapping("/code/{registrationId}")
    public ResponseBody<Void> getAuthenticateCallback(HttpServletRequest request, HttpServletResponse response, @PathVariable String registrationId) {
        //if response is valid
        AuthorizationResponse resp = AuthorizationResponse.fromRequest(request);
        if (!resp.isAuthorizationResponse())
            return ResponseBody.clientError("invalid authorization response!");

        //get ClientRegistration
        Optional<ClientRegistration> optional = clientManager.getRegistration(registrationId);
        if (optional.isEmpty())
            return ResponseBody.clientError(String.format("no service provider %s found", registrationId));
        ClientRegistration registration = optional.get();

        //if the response is sent by current system
        AuthorizationRequest req = AuthorizationRequest.removeAuthorizationRequest(request, response);
        if (req == null) return ResponseBody.clientError("authorization request not found!");

        //if response is error
        if (resp.isAuthorizationResponseError())
            return ResponseBody.clientError(String.format("authorization request failed, cause:[%s]%s!", resp.getError(), resp.getErrorDescription()));

        //if state valid
        if (!req.getState().equals(resp.getState()))
            return ResponseBody.clientError("invalid state value, inconsistent with authorization request state!");

        //retrieve token
        if (!AuthorizationGrantRequest.supports(registration)) {
            return ResponseBody.serverError(String.format("Client [%s] is using authentication method [%s] which is not supported!", registration.getRegistrationId(), registration.getClientAuthenticationMethod().getValue()));
        }
        AuthorizationGrantRequest grantRequest = AuthorizationGrantRequest.builder()
                .request(req).response(resp).registration(registration)
                .grantType(AuthorizationGrantType.AUTHORIZATION_CODE)
                .build();

        AuthorizationGrantResponse grantResponse;
        try {
            grantResponse = grantRequest.retrieve();
        } catch (OAuthException e) {
            log.warn("retrieve token failed!", e);
            return ResponseBody.serverError("retrieve token failed!");
        }

        // validate nonce
        try {
            boolean nonceValid = ClientRegistration.validateNonce(req, grantResponse.getIdToken());
            if (!nonceValid) return ResponseBody.clientError("nonce value invalid!");
        } catch (ParseException e) {
            return ResponseBody.serverError("validate nonce failed!");
        }

        //set cookies
        try {
            grantResponse.saveToken(response);
        } catch (ParseException e) {
            log.warn("set cookies failed!", e);
            return ResponseBody.serverError("set credential failed!");
        }
        return ResponseBody.ok();
    }
}

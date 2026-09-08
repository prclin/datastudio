package io.github.prclin.datastudio.server.infrastructure.configuration.oauth.client;

import jakarta.servlet.http.HttpServletRequest;
import lombok.Builder;
import lombok.Data;
import org.springframework.util.MultiValueMap;
import org.springframework.util.StringUtils;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.stream.Collectors;

@Data
@Builder
public class AuthorizationResponse {
    private String code;
    private String state;
    private String error;
    private String errorUri;
    private String errorDescription;
    private MultiValueMap<String, String> params;

    public static AuthorizationResponse fromRequest(HttpServletRequest request) {
        Map<String, List<String>> paramMap = request.getParameterMap().entrySet().stream()
                .map(entry -> Map.entry(entry.getKey(), Arrays.asList(entry.getValue())))
                .collect(Collectors.toMap(Entry::getKey, Entry::getValue));
        MultiValueMap<String, String> params = MultiValueMap.fromMultiValue(paramMap);
        return AuthorizationResponse.builder()
                .params(params)
                .state(params.getFirst(OidcParameterNames.STATE))
                .code(params.getFirst(OidcParameterNames.CODE))
                .error(params.getFirst(OidcParameterNames.ERROR))
                .errorDescription(params.getFirst(OidcParameterNames.ERROR_DESCRIPTION))
                .errorUri(params.getFirst(OidcParameterNames.ERROR_URI))
                .build();
    }

    public boolean isAuthorizationResponse() {
        return isAuthorizationResponseSuccess() || isAuthorizationResponseError();
    }

    public boolean isAuthorizationResponseSuccess() {
        return StringUtils.hasText(code)
                && StringUtils.hasText(state);
    }

    public boolean isAuthorizationResponseError() {
        return StringUtils.hasText(error)
                && StringUtils.hasText(state);
    }
}

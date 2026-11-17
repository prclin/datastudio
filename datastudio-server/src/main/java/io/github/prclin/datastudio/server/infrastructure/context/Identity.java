package io.github.prclin.datastudio.server.infrastructure.context;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class Identity {
    @JsonProperty("sub")
    private String id;
    @JsonProperty("urn:zitadel:iam:user:resourceowner:id")
    private String organizationId;
}

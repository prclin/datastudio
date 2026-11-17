package io.github.prclin.datastudio.server.infrastructure.support.spicedb;

import com.authzed.api.v1.PermissionsServiceGrpc;
import com.authzed.api.v1.PermissionsServiceGrpc.PermissionsServiceBlockingStub;
import com.authzed.api.v1.SchemaServiceGrpc;
import com.authzed.api.v1.SchemaServiceGrpc.SchemaServiceBlockingStub;
import com.authzed.api.v1.WatchServiceGrpc;
import com.authzed.api.v1.WatchServiceGrpc.WatchServiceBlockingStub;
import com.authzed.grpcutil.BearerToken;
import io.github.prclin.datastudio.server.infrastructure.configuration.properties.SpicedbProperties;
import io.grpc.Channel;
import io.grpc.ManagedChannelBuilder;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

//todo 完善工具
@Component
@RequiredArgsConstructor
public class SpicedbClient {
    private final SpicedbProperties properties;
    public Channel channel;
    public BearerToken token;
    public PermissionsServiceBlockingStub permissionStub;
    public SchemaServiceBlockingStub schemaStub;
    public WatchServiceBlockingStub watchStub;

    @PostConstruct
    public void init() {
        this.channel = ManagedChannelBuilder.forTarget("spicedb.k8s.minikube/grpc").useTransportSecurity().build();
        this.token = new BearerToken(properties.getAdminPat());
        this.permissionStub = PermissionsServiceGrpc.newBlockingStub(channel).withCallCredentials(token);
        this.schemaStub = SchemaServiceGrpc.newBlockingStub(channel).withCallCredentials(token);
        this.watchStub = WatchServiceGrpc.newBlockingStub(channel).withCallCredentials(token);
    }

}

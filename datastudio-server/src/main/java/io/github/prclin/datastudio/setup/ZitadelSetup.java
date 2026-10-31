package io.github.prclin.datastudio.setup;

import com.zitadel.Zitadel;
import com.zitadel.api.ApplicationServiceApi;
import com.zitadel.api.OrganizationServiceApi;
import com.zitadel.api.ProjectServiceApi;
import com.zitadel.model.ApplicationServiceApplication;
import com.zitadel.model.ApplicationServiceApplicationNameFilter;
import com.zitadel.model.ApplicationServiceApplicationSearchFilter;
import com.zitadel.model.ApplicationServiceCreateApplicationRequest;
import com.zitadel.model.ApplicationServiceCreateApplicationResponse;
import com.zitadel.model.ApplicationServiceCreateOIDCApplicationRequest;
import com.zitadel.model.ApplicationServiceCreateOIDCApplicationResponse;
import com.zitadel.model.ApplicationServiceListApplicationsRequest;
import com.zitadel.model.ApplicationServiceListApplicationsResponse;
import com.zitadel.model.ApplicationServiceProjectIDFilter;
import com.zitadel.model.ApplicationServiceTextFilterMethod;
import com.zitadel.model.OrganizationServiceAddOrganizationRequest;
import com.zitadel.model.OrganizationServiceAddOrganizationResponse;
import com.zitadel.model.OrganizationServiceListOrganizationsRequest;
import com.zitadel.model.OrganizationServiceListOrganizationsResponse;
import com.zitadel.model.OrganizationServiceOrganization;
import com.zitadel.model.OrganizationServiceOrganizationNameQuery;
import com.zitadel.model.OrganizationServiceSearchQuery;
import com.zitadel.model.OrganizationServiceTextQueryMethod;
import com.zitadel.model.ProjectServiceCreateProjectRequest;
import com.zitadel.model.ProjectServiceCreateProjectResponse;
import com.zitadel.model.ProjectServiceListProjectsRequest;
import com.zitadel.model.ProjectServiceListProjectsResponse;
import com.zitadel.model.ProjectServiceProject;
import com.zitadel.model.ProjectServiceProjectNameFilter;
import com.zitadel.model.ProjectServiceProjectOrganizationIDFilter;
import com.zitadel.model.ProjectServiceProjectSearchFilter;
import com.zitadel.model.ProjectServiceTextFilterMethod;
import io.github.prclin.datastudio.server.infrastructure.configuration.IamConfiguration;
import io.github.prclin.datastudio.server.infrastructure.configuration.properties.ZitadelProperties;
import io.github.prclin.datastudio.server.infrastructure.configuration.properties.ZitadelProperties.ZitadelSetupProperties;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.bind.Binder;
import org.springframework.boot.env.YamlPropertySourceLoader;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.PropertySource;
import org.springframework.core.env.SimpleCommandLinePropertySource;
import org.springframework.core.env.StandardEnvironment;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardOpenOption;
import java.util.List;

@Slf4j
public class ZitadelSetup {
    private static Binder binder;
    private static ConfigurableEnvironment environment;
    private static ZitadelProperties props;
    private static Zitadel zitadel;

    static void init(String[] args) {
        Resource resource = new ClassPathResource("application.yaml");

        List<PropertySource<?>> sources;
        try {
            sources = new YamlPropertySourceLoader().load("yaml", resource);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

        environment = new StandardEnvironment();
        environment.getPropertySources().addFirst(new SimpleCommandLinePropertySource(args));
        sources.forEach(source -> environment.getPropertySources().addLast(source));
        binder = Binder.get(environment);
        props = getProperties(ZitadelProperties.class);
        zitadel = new IamConfiguration().zitadel(props);
    }

    public static void main(String[] args) {
        init(args);
        setupZitadel();
    }

    public static void setupZitadel() {
        ZitadelSetupProperties setup = props.getSetup();
        //create organization
        String organizationId = createOrganization(setup);
        //create project
        String projectId = createProject(organizationId, setup);

        //create app
        ApplicationServiceCreateOIDCApplicationResponse oidcConfiguration = createApplication(projectId, setup);
        if (oidcConfiguration == null) return;

        String clientId = oidcConfiguration.getClientId();
        String clientSecret = oidcConfiguration.getClientSecret();
        String out = """
                DATASTUDIO_CLIENT_ID=%s
                DATASTUDIO_CLIENT_SECRET=%s
                """.formatted(clientId, clientSecret)
                .stripIndent();
        //写入文件
        try {
            Path path = Path.of(setup.getClientSecretFile());
            if (Files.notExists(path.getParent())) Files.createDirectories(path.getParent());
            Files.writeString(path, out,
                    StandardCharsets.UTF_8,
                    StandardOpenOption.CREATE,
                    StandardOpenOption.APPEND);
        } catch (IOException ignored) {
        }
        //打印
        System.out.println(out);
    }

    public static OrganizationServiceOrganization queryOrganizationByName(String name) {
        OrganizationServiceApi organizations = zitadel.getOrganizations();
        OrganizationServiceListOrganizationsResponse resp = organizations.listOrganizations(
                new OrganizationServiceListOrganizationsRequest()
                        .queries(List.of(
                                        new OrganizationServiceSearchQuery().nameQuery(
                                                new OrganizationServiceOrganizationNameQuery()
                                                        .name(name)
                                                        .method(OrganizationServiceTextQueryMethod.TEXT_QUERY_METHOD_EQUALS)
                                        )
                                )
                        )
        );
        List<OrganizationServiceOrganization> result = resp.getResult();
        if (result == null || result.isEmpty()) return null;
        return result.getFirst();
    }

    public static String createOrganization(ZitadelSetupProperties setup) {
        OrganizationServiceApi organizations = zitadel.getOrganizations();
        OrganizationServiceOrganization org = queryOrganizationByName(setup.getOrganizationName());
        if (org != null) {
            log.info("organization {} already existed!", setup.getOrganizationName());
            return org.getId();
        }
        OrganizationServiceAddOrganizationResponse resp = organizations.addOrganization(
                new OrganizationServiceAddOrganizationRequest()
                        .name(setup.getOrganizationName())
        );
        return resp.getOrganizationId();
    }


    public static ProjectServiceProject queryProjectByName(String organizationId, String name) {
        ProjectServiceApi projects = zitadel.getProjects();
        ProjectServiceListProjectsResponse resp = projects.listProjects(
                new ProjectServiceListProjectsRequest()
                        .filters(List.of(
                                        new ProjectServiceProjectSearchFilter().organizationIdFilter(
                                                new ProjectServiceProjectOrganizationIDFilter()
                                                        .organizationId(organizationId)
                                        )
                                        ,
                                        new ProjectServiceProjectSearchFilter().projectNameFilter(
                                                new ProjectServiceProjectNameFilter()
                                                        .projectName(name)
                                                        .method(ProjectServiceTextFilterMethod.TEXT_FILTER_METHOD_EQUALS)
                                        )
                                )
                        )
        );

        List<ProjectServiceProject> result = resp.getProjects();
        if (result == null || result.isEmpty()) return null;
        return result.getFirst();
    }

    public static String createProject(String organizationId, ZitadelSetupProperties setup) {
        ProjectServiceProject project = queryProjectByName(organizationId, setup.getProjectName());
        if (project != null) {
            log.info("project {} already existed in organization {}!", setup.getProjectName(), setup.getOrganizationName());
            return project.getProjectId();
        }

        ProjectServiceCreateProjectResponse resp = zitadel.getProjects()
                .createProject(
                        new ProjectServiceCreateProjectRequest()
                                .organizationId(organizationId)
                                .name(setup.getProjectName())
                );
        return resp.getProjectId();
    }

    public static ApplicationServiceApplication queryApplicationByName(String projectId, String name) {
        ApplicationServiceApi applications = zitadel.getApplications();
        ApplicationServiceListApplicationsResponse resp = applications.listApplications(
                new ApplicationServiceListApplicationsRequest()
                        .filters(List.of(
                                        new ApplicationServiceApplicationSearchFilter().projectIdFilter(
                                                new ApplicationServiceProjectIDFilter()
                                                        .projectId(projectId)
                                        ),
                                        new ApplicationServiceApplicationSearchFilter().nameFilter(
                                                new ApplicationServiceApplicationNameFilter()
                                                        .name(name)
                                                        .method(ApplicationServiceTextFilterMethod.TEXT_FILTER_METHOD_EQUALS)
                                        )

                                )

                        )
        );

        List<ApplicationServiceApplication> result = resp.getApplications();
        if (result == null || result.isEmpty()) return null;
        return result.getFirst();
    }

    public static ApplicationServiceCreateOIDCApplicationResponse createApplication(String projectId, ZitadelSetupProperties setup) {
        ApplicationServiceApplication application = queryApplicationByName(projectId, setup.getAppName());
        if (application != null) {
            log.info("application {} already existed in project {}!", setup.getProjectName(), setup.getProjectName());
            return null;
        }

        ApplicationServiceCreateApplicationResponse resp = zitadel.getApplications()
                .createApplication(
                        new ApplicationServiceCreateApplicationRequest()
                                .projectId(projectId)
                                .name(setup.getAppName())
                                .oidcConfiguration(
                                        new ApplicationServiceCreateOIDCApplicationRequest()
                                                .redirectUris(setup.getRedirectUris())
                                                .responseTypes(setup.getResponseTypes())
                                                .grantTypes(setup.getGrantTypes())
                                                .applicationType(setup.getApplicationType())
                                                .authMethodType(setup.getAuthMethodType())
                                                .developmentMode(setup.getDevelopmentMode())
                                                .accessTokenType(setup.getAccessTokenType())
                                )
                );
        return resp.getOidcConfiguration();
    }


    public static <T> T getProperties(Class<T> clazz) {
        String prefix = clazz.getAnnotation(ConfigurationProperties.class).value();
        return binder.bind(prefix, clazz).orElseThrow(() -> new IllegalStateException("Missing configuration: " + prefix));
    }

}

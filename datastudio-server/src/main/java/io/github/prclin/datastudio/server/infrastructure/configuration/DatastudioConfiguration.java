package io.github.prclin.datastudio.server.infrastructure.configuration;

import io.github.prclin.datastudio.server.infrastructure.configuration.properties.DatastudioProperties;
import io.github.prclin.datastudio.server.infrastructure.configuration.properties.DatastudioProperties.FileSystemProperties;
import io.github.prclin.datastudio.server.infrastructure.context.AvailableFileSystem;
import lombok.RequiredArgsConstructor;
import org.apache.hadoop.fs.FileSystem;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.Map.Entry;

@Configuration
@RequiredArgsConstructor
public class DatastudioConfiguration {
    private final DatastudioProperties properties;

    @Bean
    public Map<AvailableFileSystem, FileSystem> filesystems() throws IOException {
        Map<AvailableFileSystem, FileSystem> filesystems = new HashMap<>(properties.getFilesystems().size());
        for (Entry<AvailableFileSystem, FileSystemProperties> entry : properties.getFilesystems().entrySet()) {
            org.apache.hadoop.conf.Configuration conf = new org.apache.hadoop.conf.Configuration();
            entry.getValue().getHadoopConfigs().forEach(conf::set);
            filesystems.put(entry.getKey(), FileSystem.get(conf));
        }
        return filesystems;
    }
}

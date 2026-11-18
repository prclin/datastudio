package io.github.prclin.datastudio.server.infrastructure.configuration;

import io.github.prclin.datastudio.server.infrastructure.configuration.properties.DatastudioProperties;
import io.github.prclin.datastudio.server.infrastructure.context.AvailableFileSystem;
import io.github.prclin.datastudio.server.infrastructure.support.hadoop.HadoopContext;
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
    public HadoopContext hadoopContext() throws IOException {
        Map<AvailableFileSystem, Map<String, String>> confs = properties.getHadoop();
        Map<AvailableFileSystem, org.apache.hadoop.conf.Configuration> configs = new HashMap<>();
        Map<AvailableFileSystem, FileSystem> fileSystems = new HashMap<>();
        for (Entry<AvailableFileSystem, Map<String, String>> entry : confs.entrySet()) {
            org.apache.hadoop.conf.Configuration conf = new org.apache.hadoop.conf.Configuration();
            entry.getValue().forEach(conf::set);
            configs.put(entry.getKey(), conf);
            fileSystems.put(entry.getKey(), FileSystem.get(conf));
        }

        return HadoopContext.builder().configs(configs).fileSystems(fileSystems).build();
    }
}

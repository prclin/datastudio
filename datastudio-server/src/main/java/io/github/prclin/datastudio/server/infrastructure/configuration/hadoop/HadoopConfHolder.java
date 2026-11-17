package io.github.prclin.datastudio.server.infrastructure.configuration.hadoop;


import io.github.prclin.datastudio.server.infrastructure.configuration.properties.HadoopProperties;
import jakarta.annotation.PostConstruct;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.apache.hadoop.fs.FileSystem;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.Map.Entry;

@Component
@RequiredArgsConstructor
@Data
public class HadoopConfHolder {
    private final HadoopProperties props;
    private Map<String, org.apache.hadoop.conf.Configuration> configs;
    private Map<String, FileSystem> fileSystems;

    @PostConstruct
    private void init() throws IOException {
        Map<String, Map<String, String>> confs = props.getConfs();
        this.configs = new HashMap<>();
        this.fileSystems = new HashMap<>();
        for (Entry<String, Map<String, String>> entry : confs.entrySet()) {
            org.apache.hadoop.conf.Configuration conf = new org.apache.hadoop.conf.Configuration();
            entry.getValue().forEach(conf::set);
            configs.put(entry.getKey(), conf);
            fileSystems.put(entry.getKey(), FileSystem.get(conf));
        }
    }

    public FileSystem getFileSystem(String name) {
        return fileSystems.get(name);
    }
}

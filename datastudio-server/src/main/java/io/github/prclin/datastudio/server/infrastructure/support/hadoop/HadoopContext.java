package io.github.prclin.datastudio.server.infrastructure.support.hadoop;


import io.github.prclin.datastudio.server.infrastructure.context.AvailableFileSystem;
import lombok.Builder;
import lombok.Data;
import org.apache.hadoop.fs.FileSystem;

import java.util.Map;

@Data
@Builder
public class HadoopContext {
    private Map<AvailableFileSystem, org.apache.hadoop.conf.Configuration> configs;
    private Map<AvailableFileSystem, FileSystem> fileSystems;

    public FileSystem getFileSystem(AvailableFileSystem fs) {
        return fileSystems.get(fs);
    }
}

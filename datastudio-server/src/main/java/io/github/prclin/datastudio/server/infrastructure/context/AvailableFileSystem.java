package io.github.prclin.datastudio.server.infrastructure.context;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.apache.hadoop.fs.CommonConfigurationKeysPublic;

import java.util.Map;

@Getter
@RequiredArgsConstructor
public enum AvailableFileSystem {
    Local(Map.of(CommonConfigurationKeysPublic.FS_DEFAULT_NAME_KEY, CommonConfigurationKeysPublic.FS_DEFAULT_NAME_DEFAULT,
            "fs.file.impl", "org.apache.hadoop.fs.RawLocalFileSystem"));

    private final Map<String, String> value;

}

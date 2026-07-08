package io.github.prclin.datastudio.server.infrastructure.util;

import io.github.prclin.datastudio.server.infrastructure.context.AvailableFileSystem;
import lombok.RequiredArgsConstructor;
import org.apache.hadoop.fs.FileStatus;
import org.apache.hadoop.fs.FileSystem;
import org.apache.hadoop.fs.Path;
import org.apache.hadoop.io.IOUtils;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.Map;

import static org.apache.hadoop.fs.CommonConfigurationKeysPublic.IO_FILE_BUFFER_SIZE_DEFAULT;

@Component
@RequiredArgsConstructor
public class FileSystemUtil {
    private final Map<AvailableFileSystem, FileSystem> filesystems;

    private static Path checkDest(String srcName, FileSystem dstFS, Path dst,
                                  boolean overwrite) throws IOException {
        if (dstFS.exists(dst)) {
            FileStatus sdst = dstFS.getFileStatus(dst);
            if (sdst.isDirectory()) {
                if (null == srcName) {
                    throw new IOException("Target " + dst + " is a directory");
                }
                return checkDest(null, dstFS, new Path(dst, srcName), overwrite);
            } else if (!overwrite) {
                throw new IOException("Target " + dst + " already exists");
            }
        }
        return dst;
    }

    public void copy(InputStream in, Path dstPath) throws IOException {
        boolean overwrite = true;
        FileSystem dstFs = filesystems.get(AvailableFileSystem.Local);

        checkDest(null, dstFs, dstPath, overwrite);
        OutputStream out = dstFs.create(dstPath, overwrite);
        IOUtils.copyBytes(in, out, IO_FILE_BUFFER_SIZE_DEFAULT, true);
    }

    public void copy(InputStream in, String dst) throws IOException {
        Path dstPath = new Path(dst);
        copy(in, dstPath);
    }
}

package io.github.prclin.datastudio.server.infrastructure.util;

import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.fs.FileSystem;
import org.apache.hadoop.fs.FileUtil;
import org.apache.hadoop.fs.Path;
import org.apache.hadoop.io.IOUtils;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;

import static org.apache.hadoop.fs.CommonConfigurationKeysPublic.IO_FILE_BUFFER_SIZE_DEFAULT;

public class FileSystemUtil {
    public static void copy(InputStream in, OutputStream out) throws IOException {
        IOUtils.copyBytes(in, out, IO_FILE_BUFFER_SIZE_DEFAULT, true);
    }

    public static void copy(FileSystem srcFs, String src, FileSystem dstFs, String dst, boolean delSrc, boolean overwrite, Configuration conf) throws IOException {
        Path srcPath = new Path(src);
        Path dstPath = new Path(dst);
        FileUtil.copy(srcFs, srcPath, dstFs, dstPath, delSrc, overwrite, conf);
    }

    public static void copy(FileSystem srcFs, Path src, FileSystem dstFs, Path dst, boolean delSrc, boolean overwrite, Configuration conf) throws IOException {
        FileUtil.copy(srcFs, src, dstFs, dst, delSrc, overwrite, conf);
    }
}

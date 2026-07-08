package io.github.prclin.datastuio.common.constants;


import java.time.format.DateTimeFormatter;

/**
 * 格式相关常量
 *
 * @author prclin
 */
public final class FormatConstants {
    public static final DateTimeFormatter YEAR_MONTH_HYPHEN = DateTimeFormatter.ofPattern("yyyy-MM");
    public static final DateTimeFormatter DATE_HYPHEN = DateTimeFormatter.ofPattern("yyyy-MM-dd");
    public static final DateTimeFormatter DATETIME_HYPHEN_COLON = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
}

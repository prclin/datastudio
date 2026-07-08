package io.github.prclin.datastudio.server.infrastructure.po;

import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.time.LocalDateTime;

@TableName("data_capture.crawler_task_instance")
@Data
public class EngineConfigPO {
    @TableId
    private Long id;
    private String name;
    private String configs;
    private String extra;
    private LocalDateTime createTime;
    private LocalDateTime updateTime;
}

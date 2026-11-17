package io.github.prclin.datastudio.server.infrastructure.util;

import lombok.Getter;
import org.jspecify.annotations.NonNull;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.stereotype.Component;

@Component
public class SpringContextUtil implements ApplicationContextAware {
    @Getter
    private static ApplicationContext applicationContext;


    public static <T> T getBean(Class<T> clazz) {
        return applicationContext.getBean(clazz);
    }


    public static Object getBean(String beanName) {
        return applicationContext.getBean(beanName);
    }


    public static <T> T getBean(String beanName, Class<T> clazz) {
        return applicationContext.getBean(beanName, clazz);
    }

    @Override
    public void setApplicationContext(@NonNull ApplicationContext applicationContext) {
        SpringContextUtil.applicationContext = applicationContext;
    }
}

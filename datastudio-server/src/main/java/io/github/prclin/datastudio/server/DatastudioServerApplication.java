package io.github.prclin.datastudio.server;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.EnableAspectJAutoProxy;

@SpringBootApplication
@EnableAspectJAutoProxy(exposeProxy = true)
public class DatastudioServerApplication {

    public static void main(String[] args) {
        SpringApplication.run(DatastudioServerApplication.class, args);
    }

}

package org.onekin.splminer;


import org.onekin.splminer.controller.ControllerMarker;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Import;
import org.springframework.context.annotation.ImportResource;

@EnableAutoConfiguration
@ComponentScan(basePackageClasses = {ControllerMarker.class})
@ImportResource({"classpath:META-INF/sql/queries.xml", "classpath:META-INF/sql/snapshot-queries.xml"})
public class SPLMinerApplication extends SpringBootServletInitializer {

    @Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
        return application.sources(SPLMinerApplication.class);
    }

    public static void main(String[] args) {
        SpringApplication.run(SPLMinerApplication.class, args);
    }
}

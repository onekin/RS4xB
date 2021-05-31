package org.onekin.splminer.main;


import com.onekin.featurecloud.config.MvcConfig;
        import com.onekin.featurecloud.controller.ControllerMarker;
        import com.onekin.featurecloud.dao.DaoMarker;
        import com.onekin.featurecloud.service.ServiceMarker;
        import com.onekin.featurecloud.repository.RepositoryMarker;
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
@ImportResource({"classpath:META-INF/sql/queries.xml","classpath:META-INF/sql/snapshot-queries.xml"})
@Import(MvcConfig.class)
public class SPLMinerApplication extends SpringBootServletInitializer {

    @Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
        return application.sources(FeatureCloudApplication.class);
    }

    public static void main(String[] args) {
        SpringApplication.run(FeatureCloudApplication.class, args);
    }
}

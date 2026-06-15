package com.josefita.catalogo.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Value("${app.imagenes.ruta}")
    private String rutaImagenes;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Las imágenes quedan accesibles en: http://localhost:8080/imagenes/nombre.jpg
        registry.addResourceHandler("/imagenes/**")
                .addResourceLocations("file:" + rutaImagenes + "/");
    }
}

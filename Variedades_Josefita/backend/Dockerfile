# =============================================
# ETAPA 1: Compilación con Maven
# =============================================
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app

# Copia primero solo el pom.xml para aprovechar el caché de Docker
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copia el código fuente y compila
COPY src ./src
RUN mvn clean package -DskipTests

# =============================================
# ETAPA 2: Imagen de ejecución (más liviana)
# =============================================
FROM eclipse-temurin:17-jre
WORKDIR /app

# Crea la carpeta donde se guardarán las fotos subidas
RUN mkdir -p /app/imagenes

# Copia el JAR generado en la etapa anterior
COPY --from=build /app/target/catalogo-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]

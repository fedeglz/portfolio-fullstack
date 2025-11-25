# 1. Etapa de Construcción
FROM maven:3.8.5-openjdk-17 AS build
WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests

# 2. Etapa de Ejecución
# Usamos eclipse-temurin en lugar de openjdk
FROM eclipse-temurin:17-jdk-alpine
COPY --from=build /app/target/portfolio-backend-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","app.jar"]
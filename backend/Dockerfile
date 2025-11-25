# 1. Etapa de Construcción (Usamos Maven para crear el .jar)
FROM maven:3.8.5-openjdk-17 AS build
WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests

# 2. Etapa de Ejecución (Usamos un Java ligero para correrlo)
FROM openjdk:17-jdk-slim
COPY --from=build /app/target/portfolio-backend-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","app.jar"]
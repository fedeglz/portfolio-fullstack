# 1. Etapa de Construcción
FROM maven:3.8.5-openjdk-17 AS build
WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests

# 2. Etapa de Ejecución
FROM eclipse-temurin:17-jdk-alpine
# CAMBIO AQUÍ: Usamos *.jar para que agarre el archivo sea cual sea su nombre
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","app.jar"]
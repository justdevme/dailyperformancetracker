# Sử dụng image JDK
FROM eclipse-temurin:22-jdk-alpine

# Đặt thư mục làm việc trong container
WORKDIR /app

# Copy file JAR vào container
COPY target/*.jar app.jar

# Expose port
EXPOSE 8080

# Lệnh chạy ứng dụng
ENTRYPOINT ["java", "-jar", "app.jar"]

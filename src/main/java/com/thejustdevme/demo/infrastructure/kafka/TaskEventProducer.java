package com.thejustdevme.demo.infrastructure.kafka;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import java.util.concurrent.ExecutionException;

import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class TaskEventProducer {

    private final KafkaTemplate<String, String> kafkaTemplate;
    private final ObjectMapper objectMapper;

    @Value("${app.kafka.topic}")
    private String topic;

    public void send(String eventType, Object data, String key) {
        try {
            Map<String, Object> payload = Map.of(
                    "type", eventType,
                    "data", data,
                    "ts", Instant.now().toString()
            );

            kafkaTemplate
                    .send(topic, key, objectMapper.writeValueAsString(payload))
                    .get();

            System.out.println(">>> PRODUCED OK topic=" + topic + " key=" + key);

        } catch (Exception e) { // bắt luôn cho giai đoạn test
            throw new RuntimeException("Send kafka failed", e);
        }
    }

}

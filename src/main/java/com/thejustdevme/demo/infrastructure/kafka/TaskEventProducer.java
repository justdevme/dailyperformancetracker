package com.thejustdevme.demo.infrastructure.kafka;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;

import java.util.UUID;
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

    public <T> void send(EventType eventType, String key, T data) {
        try {
            EventEnvelope<T> envelope = EventEnvelope.<T>builder()
                            .eventId(UUID.randomUUID().toString())
                            .type(eventType.name())
                            .version(1)
                            .occurredAt(Instant.now())
                            .key(key)
                            .data(data)
                            .build();

            kafkaTemplate.send(topic, key, objectMapper.writeValueAsString(envelope));
            System.out.println(">>> PRODUCED OK topic=" + topic + " key=" + key);

        } catch (Exception e) { // bắt luôn cho giai đoạn test
            throw new RuntimeException("Send kafka failed", e);
        }
    }

}

package com.thejustdevme.demo.infrastructure.kafka;

import com.thejustdevme.demo.infrastructure.mongo.TaskEventDocument;
import com.thejustdevme.demo.infrastructure.mongo.TaskEventMongoRepository;
import lombok.RequiredArgsConstructor;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import java.time.Instant;

@Component
@RequiredArgsConstructor
public class TaskEventConsumer {

    private final TaskEventMongoRepository repo;

    @KafkaListener(
            topics = "${app.kafka.topic}",
            groupId = "${spring.kafka.consumer.group-id}"
    )
    @KafkaListener(topics = "${app.kafka.topic}", groupId = "${spring.kafka.consumer.group-id}")
    public void consume(ConsumerRecord<String, String> record) {
        System.out.println(">>> CONSUMED key=" + record.key());

        try {
            TaskEventDocument doc = TaskEventDocument.builder()
                    .type("TASK_EVENT")
                    .key(record.key())
                    .payload(record.value())
                    .createdAt(Instant.now())
                    .build();

            TaskEventDocument saved = repo.save(doc);
            System.out.println(">>> SAVED TO MONGO id=" + saved.getId());
        } catch (Exception e) {
            System.out.println(">>> MONGO SAVE FAILED: " + e.getMessage());
            e.printStackTrace();
        }
    }

}

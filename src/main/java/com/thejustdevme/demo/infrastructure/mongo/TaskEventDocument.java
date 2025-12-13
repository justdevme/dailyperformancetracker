package com.thejustdevme.demo.infrastructure.mongo;

import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Document("task_events")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TaskEventDocument {
    @Id
    private String id;

    private String type;
    private String key;
    private String payload;
    private Instant createdAt;
}

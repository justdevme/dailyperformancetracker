package com.thejustdevme.demo.infrastructure.kafka;

import lombok.Builder;
import lombok.Data;

import java.time.Instant;

@Data
@Builder
public class EventEnvelope<T> {
    private String eventId;
    private String type;
    private int version;
    private Instant occurredAt;
    private String key;
    private T data;
}

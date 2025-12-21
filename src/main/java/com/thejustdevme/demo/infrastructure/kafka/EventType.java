package com.thejustdevme.demo.infrastructure.kafka;

public enum EventType {
    TASK_CREATED,
    TASK_UPDATED,
    TASK_DELETED,
    TASK_STATUS_CHANGED,
    FOCUS_SESSION_STARTED,
    FOCUS_SESSION_ENDED,
}

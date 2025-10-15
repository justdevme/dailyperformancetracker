package com.thejustdevme.demo.domain.dto;

import com.thejustdevme.demo.domain.entities.TaskPriority;
import com.thejustdevme.demo.domain.entities.TaskStatus;

import java.time.LocalDateTime;
import java.util.UUID;

public record TaskDto(
        UUID id,
        String title,
        String description,
        LocalDateTime dueDate,
        TaskPriority priority,
        TaskStatus status
) {

}

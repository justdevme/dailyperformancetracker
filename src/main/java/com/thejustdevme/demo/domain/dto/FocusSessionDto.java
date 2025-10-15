package com.thejustdevme.demo.domain.dto;

import java.time.Instant;
import java.util.UUID;

public record FocusSessionDto(
        UUID id,
        Instant startTime,
        Instant endTime,
        Long durationSeconds
) {
}

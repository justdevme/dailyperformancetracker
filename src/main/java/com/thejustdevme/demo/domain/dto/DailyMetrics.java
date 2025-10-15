package com.thejustdevme.demo.domain.dto;

import java.time.LocalDate;

public record DailyMetrics(
        LocalDate date,
        int score,
        long tasksDone,
        int focusMinutes
) {
}

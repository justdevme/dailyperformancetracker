package com.thejustdevme.demo.domain.dto;

import java.util.List;

public record WeeklyMetricsDto(
        List<DailyMetrics> days
) {
}

package com.thejustdevme.demo.services;


import com.thejustdevme.demo.domain.dto.DailyMetrics;

import java.time.LocalDate;

public interface MetricsService {
    DailyMetrics getDailyMetrics(LocalDate date);
}

package com.thejustdevme.demo.controllers;

import com.thejustdevme.demo.domain.dto.DailyMetrics;
import com.thejustdevme.demo.domain.dto.WeeklyMetricsDto;
import com.thejustdevme.demo.services.MetricsService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@RestController
@RequestMapping(path = "/api/metrics")
public class MetricsController {
    private final MetricsService metricsService;
    public MetricsController(MetricsService metricsService) {
        this.metricsService = metricsService;
    }
    @GetMapping("/day")
    public DailyMetrics getDailyMetrics(@RequestParam LocalDate date) {
        return metricsService.getDailyMetrics(date);
    }

    @GetMapping("/week")
    public WeeklyMetricsDto getWeeklyMetrics(@RequestParam LocalDate start) {
        List<DailyMetrics> days = IntStream.range(0, 7)
                .mapToObj(i -> metricsService.getDailyMetrics(start.plusDays(i)))
                .collect(Collectors.toList());
        return new WeeklyMetricsDto(days);
    }
}

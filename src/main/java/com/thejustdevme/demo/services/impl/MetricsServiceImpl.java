package com.thejustdevme.demo.services.impl;

import com.thejustdevme.demo.domain.dto.DailyMetrics;
import com.thejustdevme.demo.repositories.FocusSessionRepository;
import com.thejustdevme.demo.repositories.TaskRepository;
import com.thejustdevme.demo.services.MetricsService;
import org.hibernate.annotations.SecondaryRow;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
public class MetricsServiceImpl implements MetricsService {
    private final TaskRepository taskRepository;
    private final FocusSessionRepository focusSessionRepository;

    public MetricsServiceImpl(TaskRepository taskRepository, FocusSessionRepository focusSessionRepository) {
        this.taskRepository = taskRepository;
        this.focusSessionRepository = focusSessionRepository;
    }
    @Override
    public DailyMetrics getDailyMetrics(LocalDate date) {
        long tasksDone = taskRepository.countCompletedTasksByDate(
                date.atStartOfDay(),
                date.plusDays(1).atStartOfDay()
        );

        int totalFocusMinutes = focusSessionRepository.sumFocusMinutesByDate(date);
        double taskScore = Math.min(tasksDone * 10, 50); // 5 tasks = 50
        double focusScore = Math.min(totalFocusMinutes / 10.0, 50); // 500 mins = 50
        double score = taskScore + focusScore;

        return new DailyMetrics(date, (int) score, tasksDone, totalFocusMinutes);
    }
}

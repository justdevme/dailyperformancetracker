package com.thejustdevme.demo.services.impl;

import com.thejustdevme.demo.domain.entities.FocusSession;
import com.thejustdevme.demo.domain.entities.Task;
import com.thejustdevme.demo.repositories.FocusSessionRepository;
import com.thejustdevme.demo.repositories.TaskRepository;
import com.thejustdevme.demo.services.FocusSessionService;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
public class FocusSessionServiceImpl implements FocusSessionService {

    private final FocusSessionRepository focusSessionRepository;
    private final TaskRepository taskRepository;

    public FocusSessionServiceImpl(FocusSessionRepository focusSessionRepository,
                                   TaskRepository taskRepository) {
        this.focusSessionRepository = focusSessionRepository;
        this.taskRepository = taskRepository;
    }

    @Override
    public FocusSession startSession(UUID taskId) {
        FocusSession focusSession = new FocusSession();
        focusSession.setStartTime(Instant.now());
        if (taskId != null) {
            Task task = taskRepository.findById(taskId).orElseThrow(() -> new RuntimeException("Task not found"));

            focusSession.setTask(task);
        }
        return focusSessionRepository.save(focusSession);
    }

    @Override
    public FocusSession stopSession(UUID sessionId) {
        FocusSession focusSession = focusSessionRepository.findById(sessionId).orElse(null);
        if(focusSession.getEndTime() != null) {
            throw  new RuntimeException("Session has already ended");
        }
        Instant end = Instant.now();
        focusSession.setEndTime(end);
        focusSession.setDurationSeconds(
                Duration.between(focusSession.getStartTime(), focusSession.getEndTime()).toSeconds()
        );
        return focusSessionRepository.save(focusSession);
    }

    @Override
    public List<FocusSession> getSessionsByTaskId(UUID taskId) {
        return focusSessionRepository.findByTaskId(taskId);
    }

}

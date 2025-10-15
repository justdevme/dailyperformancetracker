package com.thejustdevme.demo.controllers;

import com.thejustdevme.demo.domain.dto.FocusSessionDto;
import com.thejustdevme.demo.domain.entities.FocusSession;
import com.thejustdevme.demo.domain.mappers.FocusSessionMapper;
import com.thejustdevme.demo.services.FocusSessionService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping(path = "/tasks/{task_id}/focusSession")
public class FocusSessionController {
    private FocusSessionService focusSessionService;
    private FocusSessionMapper focusSessionMapper;

    public FocusSessionController(FocusSessionService focusSessionService, FocusSessionMapper focusSessionMapper) {
        this.focusSessionService = focusSessionService;
        this.focusSessionMapper = focusSessionMapper;
    }
    @PostMapping(path = "/start")
    public FocusSessionDto startFocusSession(@PathVariable("task_id")UUID taskId) {
        FocusSession session = focusSessionService.startSession(taskId);
        return focusSessionMapper.toDto(session);
    }
    @PostMapping(path = "/stop/{session_id}")
    public FocusSessionDto stopFocusSession(
            @PathVariable("task_id") UUID taskId,
            @PathVariable("session_id")UUID sessionId
    ) {
            FocusSession session = focusSessionService.stopSession(sessionId);
            return focusSessionMapper.toDto(session);
    }

    @GetMapping
    public List<FocusSessionDto> getSessionsByTaskId(@PathVariable("task_id")UUID taskId) {
        return focusSessionService.getSessionsByTaskId(taskId).stream().map(focusSessionMapper::toDto).collect(Collectors.toList());
    }
}

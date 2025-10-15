package com.thejustdevme.demo.services;

import com.thejustdevme.demo.domain.entities.FocusSession;

import java.util.List;
import java.util.UUID;


public interface FocusSessionService {
    FocusSession startSession(UUID taskId);
    FocusSession stopSession(UUID sessionId);
    List<FocusSession> getSessionsByTaskId(UUID taskId);

}

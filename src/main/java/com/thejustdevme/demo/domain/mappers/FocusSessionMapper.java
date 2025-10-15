package com.thejustdevme.demo.domain.mappers;

import com.thejustdevme.demo.domain.dto.FocusSessionDto;
import com.thejustdevme.demo.domain.dto.TaskDto;
import com.thejustdevme.demo.domain.entities.FocusSession;

public interface FocusSessionMapper {
    FocusSession fromDto(FocusSessionDto focusSessionDto);
    FocusSessionDto toDto(FocusSession focusSession);
}

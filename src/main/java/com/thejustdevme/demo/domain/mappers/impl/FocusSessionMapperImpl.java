package com.thejustdevme.demo.domain.mappers.impl;

import com.thejustdevme.demo.domain.dto.FocusSessionDto;
import com.thejustdevme.demo.domain.entities.FocusSession;
import com.thejustdevme.demo.domain.mappers.FocusSessionMapper;
import org.springframework.stereotype.Component;

@Component
public class FocusSessionMapperImpl implements FocusSessionMapper {

    @Override
    public FocusSession fromDto(FocusSessionDto focusSessionDto) {
        return new FocusSession(
                focusSessionDto.id(),
                focusSessionDto.startTime(),
                focusSessionDto.endTime(),
                null,
                focusSessionDto.durationSeconds()
        );
    }

    @Override
    public FocusSessionDto toDto(FocusSession focusSession) {
        return new FocusSessionDto(
                focusSession.getId(),
                focusSession.getStartTime(),
                focusSession.getEndTime(),
                focusSession.getDurationSeconds()
        );
    }
}

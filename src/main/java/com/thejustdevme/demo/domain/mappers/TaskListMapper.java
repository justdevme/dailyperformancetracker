package com.thejustdevme.demo.domain.mappers;

import com.thejustdevme.demo.domain.dto.TaskListDto;
import com.thejustdevme.demo.domain.entities.TaskList;

public interface TaskListMapper {

    TaskList fromDto(TaskListDto taskListDto);
    TaskListDto toDto(TaskList taskList);
}

package com.thejustdevme.demo.domain.mappers;

import com.thejustdevme.demo.domain.dto.TaskDto;
import com.thejustdevme.demo.domain.entities.Task;

// Mapper dùng để chuyển đổi qua lại khi nào cần dùng Entity, khi nào cần dùng DTO
public interface TaskMapper {

    Task fromDto(TaskDto taskDto);

    TaskDto toDto(Task task);

}

package com.thejustdevme.demo.services.impl;

import com.thejustdevme.demo.domain.entities.TaskList;
import com.thejustdevme.demo.repositories.TaskListRepository;
import com.thejustdevme.demo.services.TaskListService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;

@Service
public class TaskListServiceImpl implements TaskListService {

    private final TaskListRepository taskListRepository;

    public TaskListServiceImpl(TaskListRepository taskListRepository) {
        this.taskListRepository = taskListRepository;
    }

    @Override
    public List<TaskList> listTaskLists() {
        return taskListRepository.findAll();
    }

    @Override
    public TaskList createTaskList(TaskList taskList) {
        if(null != taskList.getId()) {
            throw new IllegalArgumentException("Task list already exists!");
        }
        if (null == taskList.getTitle() || taskList.getTitle().isEmpty()) {
            throw new IllegalArgumentException("Task list title is empty!");
        }
        LocalDateTime now = LocalDateTime.now();
        return taskListRepository.save(new TaskList(
                        null,
                        taskList.getTitle(),
                        taskList.getDescription(),
                        null,
                        now,
                        now
                )
        );
    }

    @Override
    public Optional<TaskList> getTaskList(UUID id) {
        return taskListRepository.findById(id);
    }

    @Override
    public TaskList updateTaskList(UUID taskListId, TaskList taskList) {
        if( taskList.getId() == null) {
            throw new IllegalArgumentException("Task list id is empty!");
        }
        if(!Objects.equals(taskList.getId(), taskListId)) {
            throw new IllegalArgumentException("Task list id does not match!");
        }
        TaskList existingTaskList = taskListRepository.findById(taskListId).orElseThrow(()->
                new IllegalArgumentException("Task list id does not exist!"));
        existingTaskList.setTitle(taskList.getTitle());
        existingTaskList.setDescription(taskList.getDescription());
        existingTaskList.setUpdated(LocalDateTime.now());
        return taskListRepository.save(existingTaskList);
    }

    @Override
    public void deleteTaskList(UUID id) {
        taskListRepository.deleteById(id);
    }
}

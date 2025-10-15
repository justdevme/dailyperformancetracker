package com.thejustdevme.demo.services.impl;

import com.thejustdevme.demo.domain.entities.Task;
import com.thejustdevme.demo.domain.entities.TaskList;
import com.thejustdevme.demo.domain.entities.TaskPriority;
import com.thejustdevme.demo.domain.entities.TaskStatus;
import com.thejustdevme.demo.repositories.TaskListRepository;
import com.thejustdevme.demo.repositories.TaskRepository;
import com.thejustdevme.demo.services.TaskService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;

@Service
public class TaskServiceImpl implements TaskService {

    private final TaskRepository taskRepository;
    private final TaskListRepository taskListRepository;

    public TaskServiceImpl(TaskRepository taskRepository,  TaskListRepository taskListRepository) {
        this.taskRepository = taskRepository;
        this.taskListRepository = taskListRepository;
    }
    @Override
    public List<Task> listTasks(UUID taskListId) {
       return taskRepository.findByTaskListId(taskListId);
    }

    @Override
    public Task createTask(UUID taskListId, Task task) {
        if(null != task.getId()) {
            throw new IllegalArgumentException("Task already exists");
        }
        if(null == task.getTitle() || task.getTitle().isEmpty()) {
            throw new IllegalArgumentException("Task title is required");
        }
        TaskPriority taskPriority = Optional.ofNullable(task.getPriority()).orElse(TaskPriority.MEDIUM);
        TaskStatus taskStatus = TaskStatus.OPEN;

        TaskList taskList = taskListRepository.findById(taskListId)
                .orElseThrow(() -> new IllegalArgumentException("Task list not found"));
        LocalDateTime now = LocalDateTime.now();
        Task taskToSave = new Task(
                null,
                task.getTitle(),
                task.getDescription(),
                task.getDueDate(),
                taskStatus,
                taskPriority,
                now,
                now,
                taskList
        );
        return taskRepository.save(taskToSave);
    }

    @Override
    public Optional<Task> getTask(UUID taskListId, UUID taskId) {
        return taskRepository.findByTaskListIdAndId(taskListId, taskId);
    }

    @Override
    public Task updateTask(UUID taskListId, UUID taskId, Task task) {
        if (null == task.getId()) {
            throw new IllegalArgumentException("Task id is required");
        }
        if (!Objects.equals(task.getId(), taskId)) {
            throw new IllegalArgumentException("Task id does not match");
        }
        if (null == task.getPriority()) {
            throw new IllegalArgumentException("Task priority is required");
        }
        if (null == task.getStatus()) {
            throw new IllegalArgumentException("Task status is required");
        }
        Task existingTask = taskRepository.findByTaskListIdAndId(taskListId, taskId)
                .orElseThrow(() -> new IllegalArgumentException("Task list not found"));
        existingTask.setTitle(task.getTitle());
        existingTask.setDescription(task.getDescription());
        existingTask.setDueDate(task.getDueDate());
        existingTask.setPriority(task.getPriority());
        existingTask.setStatus(task.getStatus());
        existingTask.setUpdated(LocalDateTime.now());

        return taskRepository.save(existingTask);
    }

    @Override
    public void deleteTask(UUID taskListId, UUID taskId) {
        taskRepository.deleteByTaskListIdAndId(taskListId, taskId);
    }
}

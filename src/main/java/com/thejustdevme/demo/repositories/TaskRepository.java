package com.thejustdevme.demo.repositories;

import com.thejustdevme.demo.domain.entities.Task;
import com.thejustdevme.demo.domain.entities.TaskList;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface TaskRepository extends JpaRepository<Task, UUID> {
    List<Task> findByTaskListId(UUID taskListId);
    Optional<Task> findByTaskListIdAndId(UUID taskListId, UUID id);
    void deleteByTaskListIdAndId(UUID taskListId, UUID id);
    @Query("SELECT COUNT(t) FROM Task t " +
            "WHERE t.status = com.thejustdevme.demo.domain.entities.TaskStatus.CLOSED " +
            "AND t.updated BETWEEN :start AND :end")
    long countCompletedTasksByDate(@Param("start") LocalDateTime start,
                                   @Param("end") LocalDateTime end);
}

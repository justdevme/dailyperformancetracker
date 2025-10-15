package com.thejustdevme.demo.repositories;

import com.thejustdevme.demo.domain.entities.FocusSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Repository
public interface FocusSessionRepository extends JpaRepository<FocusSession, UUID> {

    List<FocusSession> findByTaskId(UUID taskId);

    @Query("SELECT COALESCE(SUM(f.durationSeconds), 0) " +
            "FROM FocusSession f " +
            "WHERE DATE(f.startTime) = :date")
    int sumFocusMinutesByDate(LocalDate date);
}

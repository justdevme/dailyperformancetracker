package com.thejustdevme.demo.domain.entities;

import jakarta.persistence.*;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "focus_sessions")
public class FocusSession {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @Column(name = "start_time")
    private Instant startTime;

    @Column (name = "end_time")
    private Instant endTime;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "task_id")
    private Task task;

    @Column(name = "duration_seconds")
    private Long durationSeconds;

    public FocusSession() {
    }

    public FocusSession(UUID id, Instant startTime, Instant endTime, Task task, Long durationSeconds) {
        this.id = id;
        this.startTime = startTime;
        this.endTime = endTime;
        this.task = task;
        this.durationSeconds = durationSeconds;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public Instant getStartTime() {
        return startTime;
    }

    public void setStartTime(Instant startTime) {
        this.startTime = startTime;
    }

    public Instant getEndTime() {
        return endTime;
    }

    public void setEndTime(Instant endTime) {
        this.endTime = endTime;
    }

    public Task getTask() {
        return task;
    }

    public void setTask(Task task) {
        this.task = task;
    }

    public Long getDurationSeconds() {
        return durationSeconds;
    }

    public void setDurationSeconds(Long durationSeconds) {
        this.durationSeconds = durationSeconds;
    }

    @Override
    public String toString() {
        return "FocusSession{" +
                "id=" + id +
                ", startTime=" + startTime +
                ", endTime=" + endTime +
                ", task=" + task +
                ", durationSeconds=" + durationSeconds +
                '}';
    }
}

import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./FocusSession.css";
import Sidebar from "../components/Sidebar";
import { 
  startFocusSession, 
  stopFocusSession, 
  getFocusSessionsByTask 
} from "../apis/focusSessionService";

export default function FocusSession() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // ✅ Nhận task data từ TaskDetail
  const taskFromState = location.state?.task;
  
  const [selectedTask, setSelectedTask] = useState(taskFromState || null);
  const [timer, setTimer] = useState(25 * 60); // 25 phút mặc định
  const [isRunning, setIsRunning] = useState(false);
  const [sessionType, setSessionType] = useState("work"); // work, shortBreak, longBreak
  const [currentSession, setCurrentSession] = useState(null); // Session đang chạy
  
  // Stats
  const [stats, setStats] = useState({
    sessionsToday: 0,
    totalFocusTime: 0,
    completedSessions: 0
  });

  // Load focus sessions history khi có task
  useEffect(() => {
    if (selectedTask?.id) {
      loadFocusSessionStats();
    }
  }, [selectedTask]);

  const loadFocusSessionStats = async () => {
    try {
      const sessions = await getFocusSessionsByTask(selectedTask.id);
      console.log("Loaded sessions:", sessions);
      
      // Tính stats
      const today = new Date().setHours(0, 0, 0, 0);
      const sessionsToday = sessions.filter(s => {
        if (!s.startTime) return false;
        return new Date(s.startTime).setHours(0, 0, 0, 0) === today;
      }).length;
      
      const totalSeconds = sessions.reduce((sum, s) => sum + (s.durationSeconds || 0), 0);
      const totalHours = (totalSeconds / 3600).toFixed(1);
      
      setStats({
        sessionsToday,
        totalFocusTime: totalHours,
        completedSessions: sessions.length
      });
    } catch (err) {
      console.error("Error loading stats:", err);
    }
  };

  // Timer countdown
  useEffect(() => {
    let interval = null;
    
    if (isRunning && timer > 0) {
      interval = setInterval(() => {
        setTimer((time) => time - 1);
      }, 1000);
    } else if (timer === 0 && isRunning) {
      // Khi hết giờ
      handleSessionComplete();
    }
    
    return () => clearInterval(interval);
  }, [isRunning, timer]);

  // Xử lý khi session hoàn thành
  const handleSessionComplete = async () => {
    setIsRunning(false);
    
    if (sessionType === "work" && selectedTask && currentSession) {
      // Dừng work session trong database
      try {
        await stopFocusSession(selectedTask.id, currentSession.id);
        
        alert("🎉 Work session completed! Session saved.");
        
        setCurrentSession(null);
        
        // Reload stats
        await loadFocusSessionStats();
        
        // Chuyển sang break
        setSessionType("shortBreak");
        setTimer(5 * 60);
      } catch (err) {
        console.error("Error stopping session:", err);
        alert("Session completed but failed to save.");
      }
    } else {
      // Break session hoàn thành
      alert(`☕ ${sessionType === "shortBreak" ? "Short" : "Long"} break completed!`);
      setSessionType("work");
      setTimer(25 * 60);
    }
  };

  // Format time display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Control functions
  const handleStart = async () => {
    if (!selectedTask) {
      alert("⚠️ Please select a task first!");
      return;
    }
    
    if (sessionType === "work" && !currentSession) {
      // Bắt đầu work session mới trong database
      try {
        const session = await startFocusSession(selectedTask.id);
        console.log("Session started:", session);
        setCurrentSession(session);
        setIsRunning(true);
      } catch (err) {
        console.error("Error starting session:", err);
        alert("Failed to start session. Please try again.");
      }
    } else {
      // Break session hoặc resume
      setIsRunning(true);
    }
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    
    if (sessionType === "work") {
      setTimer(25 * 60);
    } else if (sessionType === "shortBreak") {
      setTimer(5 * 60);
    } else {
      setTimer(15 * 60);
    }
  };

  const handleStop = async () => {
    if (!window.confirm("Are you sure you want to stop this session? It will be saved with current progress.")) {
      return;
    }
    
    setIsRunning(false);
    
    // Nếu là work session và có session đang chạy
    if (sessionType === "work" && selectedTask && currentSession) {
      try {
        await stopFocusSession(selectedTask.id, currentSession.id);
        alert("Session stopped and saved.");
        
        setCurrentSession(null);
        await loadFocusSessionStats();
      } catch (err) {
        console.error("Error stopping session:", err);
        alert("Failed to stop session properly.");
      }
    }
    
    // Reset timer
    if (sessionType === "work") {
      setTimer(25 * 60);
    } else if (sessionType === "shortBreak") {
      setTimer(5 * 60);
    } else {
      setTimer(15 * 60);
    }
    
    setCurrentSession(null);
  };

  // Session type switchers
  const handleWorkSession = () => {
    if (isRunning) {
      alert("⚠️ Please pause the current session first!");
      return;
    }
    if (currentSession) {
      alert("⚠️ Please stop the current work session first!");
      return;
    }
    setSessionType("work");
    setTimer(25 * 60);
  };

  const handleShortBreak = () => {
    if (isRunning) {
      alert("⚠️ Please pause the current session first!");
      return;
    }
    if (currentSession) {
      alert("⚠️ Please stop the current work session first!");
      return;
    }
    setSessionType("shortBreak");
    setTimer(5 * 60);
  };

  const handleLongBreak = () => {
    if (isRunning) {
      alert("⚠️ Please pause the current session first!");
      return;
    }
    if (currentSession) {
      alert("⚠️ Please stop the current work session first!");
      return;
    }
    setSessionType("longBreak");
    setTimer(15 * 60);
  };

  return (
    <div className="layout">
      <Sidebar />
      <div className="main">
        <div className="focus-session-container">
          
          {/* ✅ Hiển thị thông tin task nếu có */}
          {selectedTask ? (
            <div className="task-info-card">
              <div className="task-info-header">
                <h3>📋 Current Task</h3>
                <button 
                  className="back-to-task-btn"
                  onClick={() => navigate(`/task/${selectedTask.listId}/${selectedTask.id}`)}
                >
                  View Details
                </button>
              </div>
              <h2 className="task-title">{selectedTask.title}</h2>
              {selectedTask.description && (
                <p className="task-description">{selectedTask.description}</p>
              )}
              {selectedTask.priority && (
                <span className={`priority-badge ${selectedTask.priority.toLowerCase()}`}>
                  {selectedTask.priority}
                </span>
              )}
              {currentSession && (
                <div className="session-status">
                  <span className="status-indicator">🟢</span>
                  <span>Session Active (ID: {currentSession.id?.substring(0, 8)}...)</span>
                </div>
              )}
            </div>
          ) : (
            <div className="no-task-card">
              <p>⚠️ No task selected. Choose a task from TaskWeek to start a focus session.</p>
              <button 
                className="go-to-tasks-btn"
                onClick={() => navigate("/taskweek")}
              >
                Go to Tasks
              </button>
            </div>
          )}

          {/* Timer Section */}
          <div className="timer-card">
            <div className="session-type-selector">
              <button 
                className={`session-btn ${sessionType === "work" ? "active" : ""}`}
                onClick={handleWorkSession}
                disabled={isRunning || currentSession !== null}
              >
                Work (25min)
              </button>
              <button 
                className={`session-btn ${sessionType === "shortBreak" ? "active" : ""}`}
                onClick={handleShortBreak}
                disabled={isRunning || currentSession !== null}
              >
                Short Break (5min)
              </button>
              <button 
                className={`session-btn ${sessionType === "longBreak" ? "active" : ""}`}
                onClick={handleLongBreak}
                disabled={isRunning || currentSession !== null}
              >
                Long Break (15min)
              </button>
            </div>

            <div className="timer-display">
              <h1 className="timer-text">{formatTime(timer)}</h1>
              <p className="session-label">
                {sessionType === "work" ? "🎯 Focus Time" : "☕ Break Time"}
              </p>
              {currentSession && (
                <p className="session-info">
                  Started at: {new Date(currentSession.startTime).toLocaleTimeString()}
                </p>
              )}
            </div>

            <div className="timer-controls">
              {!isRunning ? (
                <button 
                  className="control-btn start-btn" 
                  onClick={handleStart}
                  disabled={!selectedTask && sessionType === "work"}
                >
                  ▶️ Start
                </button>
              ) : (
                <button className="control-btn pause-btn" onClick={handlePause}>
                  ⏸️ Pause
                </button>
              )}
              <button className="control-btn reset-btn" onClick={handleReset}>
                🔄 Reset
              </button>
              {(isRunning || currentSession) && (
                <button className="control-btn stop-btn" onClick={handleStop}>
                  ⏹️ Stop & Save
                </button>
              )}
            </div>
          </div>

          {/* Stats Section */}
          <div className="stats-section">
            <div className="stat-card">
              <div className="stat-value">{stats.sessionsToday}</div>
              <div className="stat-label">Sessions Today</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{stats.totalFocusTime}h</div>
              <div className="stat-label">Total Focus Time</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{stats.completedSessions}</div>
              <div className="stat-label">Completed Sessions</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
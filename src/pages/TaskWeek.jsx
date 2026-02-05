import React, { useMemo, useState } from "react";
import "./TaskWeek.css";
import Sidebar from "../components/Sidebar";
import AddTaskModal from "../components/AddTaskModal";
import { apiFetch } from "./api.js";
import {
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";

// ====== Helpers ======
const uuid = () => (crypto?.randomUUID ? crypto.randomUUID() : String(Date.now() + Math.random()));

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

export default function TaskWeek() {
  // khai báo dữ liệu
  // ====== Habits (Library) ======
  const [habitsLibrary, setHabitsLibrary] = useState([
    // demo data (bạn có thể xóa)
    { id: uuid(), title: "Drink 2L water", description: "", priority: "MEDIUM", active: true },
    { id: uuid(), title: "Read 20 minutes", description: "", priority: "LOW", active: true },
  ]);

  // ====== Entries per day (Tracking) ======
  // tasksByList[day] = list entries for that day
  const [tasksByList, setTasksByList] = useState(() => {
    // init entries from demo habits
    const init = {};
    DAYS.forEach((day) => (init[day] = []));
    // auto insert demo habits
    const demoHabits = [
      { id: uuid(), title: "Drink 2L water", priority: "MEDIUM" },
      { id: uuid(), title: "Read 20 minutes", priority: "LOW" },
    ];
   
    return init;
  });
  // khai báo dữ liệu
  const [loading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // ====== Actions ====== Thao tác với dữ liệu
  const openAddHabitModal = () => setShowModal(true);

  // Add habit to library + auto insert entries into all days
  const handleSubmitHabit = async (data) => {
    const habit = {
      id: uuid(),
      title: data.title?.trim() || "New habit",
      description: data.description || "",
      priority: data.priority || "MEDIUM",
      active: true,
    };

    setHabitsLibrary((prev) => [...prev, habit]);

    setTasksByList((prev) => { // tự động insert vào các thứ trong tuần
      const next = { ...prev };
      DAYS.forEach((day) => {
        const entry = {
          id: uuid(),
          habitId: habit.id,
          title: habit.title,
          priority: habit.priority,
          status: "OPEN", // OPEN / CLOSED
        };
        next[day] = [...(next[day] || []), entry];
      });
      return next;
    });

    setShowModal(false);
  };

  // Toggle completion for a specific day entry
  const handleToggleHabitEntry = (day, entry) => {
    const nextStatus = entry.status === "CLOSED" ? "OPEN" : "CLOSED";
    setTasksByList((prev) => ({
      ...prev,
      [day]: (prev[day] || []).map((t) => (t.id === entry.id ? { ...t, status: nextStatus } : t)),
    }));
  };

  // Remove habit template + remove all entries across days
  const handleDeleteHabitFromLibrary = (habitId) => {
    setHabitsLibrary((prev) => prev.filter((h) => h.id !== habitId));
    setTasksByList((prev) => {
      const next = { ...prev };
      DAYS.forEach((day) => {
        next[day] = (next[day] || []).filter((e) => e.habitId !== habitId);
      });
      return next;
    });
  };

  // ====== Analytics ======
  const chartData = useMemo(() => {
    return DAYS.map((day) => {
      const entries = tasksByList?.[day] || [];
      const done = entries.filter((e) => e.status === "CLOSED").length;
      const open = entries.filter((e) => e.status === "OPEN").length;
      const total = entries.length;
      return { day: day.substring(0, 3), completed: done, pending: open, total };
    });
  }, [tasksByList]);

  const totalEntries = useMemo(() => Object.values(tasksByList).flat().length, [tasksByList]);
  const completedEntries = useMemo(
    () => Object.values(tasksByList).flat().filter((e) => e.status === "CLOSED").length,
    [tasksByList]
  );
  const completionRate = totalEntries > 0 ? ((completedEntries / totalEntries) * 100).toFixed(0) : 0;

  const pieData = [
    { name: "Completed", value: completedEntries, color: "#10b981" },
    { name: "Pending", value: Math.max(0, totalEntries - completedEntries), color: "#3b82f6" },
  ];

  if (loading) {
    return (
      <div className="layout">
        <Sidebar />
        <div className="main">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading your habits...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="layout">
      <Sidebar />
      <div className="main">
        <div className="taskweek">
          {/* Header Section */}
          <div className="taskweek-header">
            <div className="header-content">
              <h1 className="page-title">Habit Tracker</h1>
              <p className="page-subtitle">Add habits in Library → track them daily (Mon–Fri)</p>
            </div>

            <div className="header-stats">
              <div className="stat-badge">
                <span className="stat-value">{habitsLibrary.length}</span>
                <span className="stat-label">Habits</span>
              </div>
              <div className="stat-badge success">
                <span className="stat-value">{completedEntries}</span>
                <span className="stat-label">Done</span>
              </div>
              <div className="stat-badge primary">
                <span className="stat-value">{completionRate}%</span>
                <span className="stat-label">Success Rate</span>
              </div>
            </div>
          </div>

          {/* Board */}
          <div className="taskboard">
            {DAYS.map((day, index) => {
              const entries = tasksByList[day] || [];
              const dayDone = entries.filter((e) => e.status === "CLOSED").length;
              const dayTotal = entries.length;
              const dayProgress = dayTotal > 0 ? (dayDone / dayTotal) * 100 : 0;

              return (
                <div key={day} className="task-column" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="column-header">
                    <h3>{day}</h3>
                    <div className="progress-indicator">
                      <span className="progress-text">
                        {dayDone}/{dayTotal}
                      </span>
                      <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${dayProgress}%` }}></div>
                      </div>
                    </div>
                  </div>

                  <div className="tasks">
                    {entries.length === 0 ? (
                      <div className="empty-state">
                        <span className="empty-icon">🌱</span>
                        <p>No habits yet (add from Library)</p>
                      </div>
                    ) : (
                      entries.map((e, entryIndex) => (
                        <div
                          key={e.id}
                          className={`task-item ${e.status === "CLOSED" ? "closed" : ""} priority-${e.priority?.toLowerCase?.()}`}
                          style={{ animationDelay: `${entryIndex * 0.05}s` }}
                        >
                          <input
                            type="checkbox"
                            checked={e.status === "CLOSED"}
                            onChange={(ev) => {
                              ev.stopPropagation();
                              handleToggleHabitEntry(day, e);
                            }}
                          />

                          <div className="task-content">
                            <span className="task-title">{e.title}</span>
                            {e.priority && (
                              <span className={`priority-tag ${e.priority.toLowerCase()}`}>
                                {e.priority}
                              </span>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  
                </div>
              );
            })}

            {/* Habits Library (Archives) */}
            <div className="archive-column">
              <div className="column-header">
                <h3>🧩 Habits Library</h3>
                <span className="archive-count">{habitsLibrary.length} habits</span>
              </div>

              <div className="archive-list">
                {habitsLibrary.length === 0 ? (
                  <div className="empty-state">
                    <span className="empty-icon">✨</span>
                    <p>Add habits you want to track</p>
                  </div>
                ) : (
                  habitsLibrary.map((h) => (
                    <div key={h.id} className="archive-item">
                      <span className="archive-check">•</span>
                      <div className="archive-content">
                        <span className="archive-title">{h.title}</span>
                        <span className="archive-day">Auto added to Mon–Fri</span>
                      </div>

                      <button
                        className="delete-btn"
                        onClick={() => handleDeleteHabitFromLibrary(h.id)}
                        title="Remove habit"
                      >
                        ✖
                      </button>
                    </div>
                  ))
                )}
              </div>

              <button className="add-btn" onClick={openAddHabitModal}>
                <span className="add-icon">+</span>
                Add Habit
              </button>
            </div>
          </div>

          {/* Analytics */}
          <div className="analytics-section">
            <h2 className="section-title">
              <span className="title-icon">📊</span>
              Weekly Analytics
            </h2>

            <div className="charts-grid">
              <div className="chart-card large">
                <h3 className="chart-title">Habit Completion Trends</h3>
                <ResponsiveContainer width="100%" height={280}>
                  <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorPending" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="day" stroke="rgba(255,255,255,0.5)" />
                    <YAxis stroke="rgba(255,255,255,0.5)" />
                    <Tooltip
                      contentStyle={{
                        background: "rgba(30, 30, 46, 0.95)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: "12px",
                        color: "#fff",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="completed"
                      stroke="#10b981"
                      fillOpacity={1}
                      fill="url(#colorCompleted)"
                    />
                    <Area
                      type="monotone"
                      dataKey="pending"
                      stroke="#3b82f6"
                      fillOpacity={1}
                      fill="url(#colorPending)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="chart-card">
                <h3 className="chart-title">Completion Distribution</h3>
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      dataKey="value"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        background: "rgba(30, 30, 46, 0.95)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: "12px",
                        color: "#fff",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Modal */}
          {showModal && (
            <AddTaskModal
              day={"Habit Library"}
              onClose={() => setShowModal(false)}
              onSubmit={handleSubmitHabit}
            />
          )}
        </div>
      </div>
    </div>
  );
}

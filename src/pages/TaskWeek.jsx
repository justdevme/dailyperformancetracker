import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./TaskWeek.css";
import Sidebar from "../components/Sidebar";
import AddTaskModal from "../components/AddTaskModal";
import {
  LineChart,
  Line,
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
import {
  getTaskLists,
  createTaskList,
  getTasksInList,
  createTaskInList,
  updateTaskInList,
  deleteTaskInList,
} from "../apis/taskService";

export default function TaskWeek() {
  const navigate = useNavigate();
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  const [taskLists, setTaskLists] = useState([]);
  const [tasksByList, setTasksByList] = useState({});
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedDay, setSelectedDay] = useState("");

  // 🔹 Load tất cả task lists + tasks trong tuần
  useEffect(() => {
    const loadAll = async () => {
      try {
        const lists = await getTaskLists();
        setTaskLists(lists);

        const tasksPromises = lists.map((list) =>
          getTasksInList(list.id).then((tasks) => ({
            id: list.id,
            title: list.title,
            tasks,
          }))
        );

        const result = await Promise.all(tasksPromises);
        const tasksMap = {};
        result.forEach((r) => {
          tasksMap[r.title] = r.tasks;
        });
        setTasksByList(tasksMap);
      } catch (err) {
        console.error("Error loading:", err);
      } finally {
        setLoading(false);
      }
    };

    loadAll();
  }, []);

  const handleAddTask = (day) => {
    setSelectedDay(day);
    setShowModal(true);
  };

  const handleSubmitTask = async (data) => {
    try {
      let list = taskLists.find((l) => l.title === selectedDay);

      if (!list) {
        const created = await createTaskList({
          title: selectedDay,
          description: `Tasks for ${selectedDay}`,
        });

        list = created;
        setTaskLists([...taskLists, created]);
      }

      const newTask = await createTaskInList(list.id, {
        title: data.title,
        description: data.description,
        dueDate: data.dueDate || null,
        status: "OPEN",
        priority: data.priority,
      });

      setTasksByList((prev) => ({
        ...prev,
        [selectedDay]: [...(prev[selectedDay] || []), newTask],
      }));

      setShowModal(false);
    } catch (err) {
      console.error("Create Task Error:", err.response?.data || err.message);
    }
  };

  const handleCompleteTask = async (day, task) => {
    try {
      const list = taskLists.find((l) => l.title === day);
      if (!list) return console.error("TaskList not found for day", day);

      const updated = await updateTaskInList(list.id, task.id, {
        ...task,
        status: "CLOSED",
      });

      setTasksByList((prev) => ({
        ...prev,
        [day]: prev[day].map((t) => (t.id === task.id ? updated : t)),
      }));
    } catch (err) {
      console.error("Error completing task:", err.response?.data || err.message);
    }
  };

  const handleDeleteTask = async (day, taskId) => {
    try {
      const list = taskLists.find((l) => l.title === day);
      if (!list) return;

      await deleteTaskInList(list.id, taskId);
      setTasksByList((prev) => ({
        ...prev,
        [day]: prev[day].filter((t) => t.id !== taskId),
      }));
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  const handleTaskClick = (day, task) => {
    const list = taskLists.find((l) => l.title === day);
    if (list) {
      navigate(`/task/${list.id}/${task.id}`);
    }
  };

  if (loading) {
    return (
      <div className="layout">
        <Sidebar />
        <div className="main">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading your tasks...</p>
          </div>
        </div>
      </div>
    );
  }

  // 🔹 Dữ liệu cho biểu đồ
  const chartData = days.map((day) => {
    const tasks = tasksByList?.[day] || [];
    const closed = tasks.filter((t) => t.status === "CLOSED").length;
    const open = tasks.filter((t) => t.status === "OPEN").length;
    const total = tasks.length;
    return { day: day.substring(0, 3), completed: closed, pending: open, total };
  });

  const totalTasks = Object.values(tasksByList).flat().length;
  const completedTasks = Object.values(tasksByList)
    .flat()
    .filter((t) => t.status === "CLOSED").length;
  const completionRate = totalTasks > 0 ? ((completedTasks / totalTasks) * 100).toFixed(0) : 0;

  const pieData = [
    {
      name: "Completed",
      value: completedTasks,
      color: "#10b981",
    },
    {
      name: "Pending",
      value: totalTasks - completedTasks,
      color: "#3b82f6",
    },
  ];

  return (
    <div className="layout">
      <Sidebar />
      <div className="main">
        <div className="taskweek">
          {/* Header Section */}
          <div className="taskweek-header">
            <div className="header-content">
              <h1 className="page-title">Weekly Tasks</h1>
              <p className="page-subtitle">Plan and track your week efficiently</p>
            </div>
            <div className="header-stats">
              <div className="stat-badge">
                <span className="stat-value">{totalTasks}</span>
                <span className="stat-label">Total Tasks</span>
              </div>
              <div className="stat-badge success">
                <span className="stat-value">{completedTasks}</span>
                <span className="stat-label">Completed</span>
              </div>
              <div className="stat-badge primary">
                <span className="stat-value">{completionRate}%</span>
                <span className="stat-label">Success Rate</span>
              </div>
            </div>
          </div>

          {/* Taskboard */}
          <div className="taskboard">
            {days.map((day, index) => {
              const tasks = tasksByList[day] || [];
              const dayCompleted = tasks.filter((t) => t.status === "CLOSED").length;
              const dayTotal = tasks.length;
              const dayProgress = dayTotal > 0 ? (dayCompleted / dayTotal) * 100 : 0;

              return (
                <div key={day} className="task-column" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="column-header">
                    <h3>{day}</h3>
                    <div className="progress-indicator">
                      <span className="progress-text">{dayCompleted}/{dayTotal}</span>
                      <div className="progress-bar">
                        <div 
                          className="progress-fill" 
                          style={{ width: `${dayProgress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  <div className="tasks">
                    {tasks.length === 0 ? (
                      <div className="empty-state">
                        <span className="empty-icon">📋</span>
                        <p>No tasks yet</p>
                      </div>
                    ) : (
                      tasks.map((t, taskIndex) => (
                        <div
                          key={t.id}
                          className={`task-item ${t.status === "CLOSED" ? "closed" : ""} priority-${t.priority?.toLowerCase()}`}
                          style={{ animationDelay: `${taskIndex * 0.05}s` }}
                        >
                          <input
                            type="checkbox"
                            checked={t.status === "CLOSED"}
                            onChange={(e) => {
                              e.stopPropagation();
                              handleCompleteTask(day, t);
                            }}
                          />
                          <div className="task-content" onClick={() => handleTaskClick(day, t)}>
                            <span className="task-title">{t.title}</span>
                            {t.priority && (
                              <span className={`priority-tag ${t.priority.toLowerCase()}`}>
                                {t.priority}
                              </span>
                            )}
                          </div>
                          <button
                            className="delete-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteTask(day, t.id);
                            }}
                          >
                            ✖
                          </button>
                        </div>
                      ))
                    )}
                  </div>

                  <button className="add-btn" onClick={() => handleAddTask(day)}>
                    <span className="add-icon">+</span>
                    Add Task
                  </button>
                </div>
              );
            })}

            {/* Archive column */}
            <div className="archive-column">
              <div className="column-header">
                <h3>✅ Archive</h3>
                <span className="archive-count">
                  {Object.values(tasksByList)
                    .flat()
                    .filter((t) => t.status === "CLOSED").length} completed
                </span>
              </div>
              <div className="archive-list">
                {Object.entries(tasksByList)
                  .flatMap(([day, list]) =>
                    (list || [])
                      .filter((t) => t.status === "CLOSED")
                      .map((t) => ({ ...t, day }))
                  )
                  .map((t) => (
                    <div key={t.id} className="archive-item">
                      <span className="archive-check">✓</span>
                      <div className="archive-content">
                        <span className="archive-title">{t.title}</span>
                        <span className="archive-day">{t.day}</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* Chart Section */}
          <div className="analytics-section">
            <h2 className="section-title">
              <span className="title-icon">📊</span>
              Weekly Analytics
            </h2>
            
            <div className="charts-grid">
              {/* Area Chart - Task Trends */}
              <div className="chart-card large">
                <h3 className="chart-title">Task Completion Trends</h3>
                <ResponsiveContainer width="100%" height={280}>
                  <AreaChart
                    data={chartData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorPending" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
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

              {/* Pie Chart */}
              <div className="chart-card">
                <h3 className="chart-title">Task Distribution</h3>
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
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
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

          {showModal && (
            <AddTaskModal
              day={selectedDay}
              onClose={() => setShowModal(false)}
              onSubmit={handleSubmitTask}
            />
          )}
        </div>
      </div>
    </div>
  );
}
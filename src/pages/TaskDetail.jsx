import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./TaskDetail.css";
import Sidebar from "../components/Sidebar";
import { getTasksInList, updateTaskInList, deleteTaskInList } from "../apis/taskService";

export default function TaskDetail() {
  const { listId, taskId } = useParams();
  const navigate = useNavigate();
  
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "OPEN",
    priority: "MEDIUM",
    dueDate: ""
  });

  // Load task data
  useEffect(() => {
    const loadTask = async () => {
      try {
        console.log('Loading task:', { listId, taskId });
        const tasks = await getTasksInList(listId);
        console.log('All tasks:', tasks);
        
        // ✅ So sánh string UUID, không cần parseInt
        const foundTask = tasks.find(t => String(t.id) === String(taskId));
        
        console.log('Found task:', foundTask);
        
        if (foundTask) {
          setTask(foundTask);
          setFormData({
            title: foundTask.title || "",
            description: foundTask.description || "",
            status: foundTask.status || "OPEN",
            priority: foundTask.priority || "MEDIUM",
            dueDate: foundTask.dueDate || ""
          });
        } else {
          console.error('Task not found in list');
        }
      } catch (err) {
        console.error("Error loading task:", err);
      } finally {
        setLoading(false);
      }
    };

    loadTask();
  }, [listId, taskId]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Save changes
  const handleSave = async () => {
    try {
      const updated = await updateTaskInList(listId, taskId, formData);
      setTask(updated);
      setIsEditing(false);
      alert("Task updated successfully!");
    } catch (err) {
      console.error("Error updating task:", err);
      alert("Failed to update task");
    }
  };

  // Delete task
  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await deleteTaskInList(listId, taskId);
        alert("Task deleted successfully!");
        navigate("/taskweek");
      } catch (err) {
        console.error("Error deleting task:", err);
        alert("Failed to delete task");
      }
    }
  };

  if (loading) {
    return (
      <div className="layout">
        <Sidebar />
        <div className="main">
          <p style={{ color: "white", padding: "20px" }}>Loading task...</p>
        </div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="layout">
        <Sidebar />
        <div className="main">
          <div style={{ color: "white", padding: "20px" }}>
            <h2>Task not found</h2>
            <button 
              onClick={() => navigate("/taskweek")}
              style={{
                marginTop: "20px",
                padding: "10px 20px",
                background: "#4caf50",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer"
              }}
            >
              Back to Tasks
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="layout">
      <Sidebar />
      <div className="main">
        <div className="task-detail-container">
          <div className="task-detail-header">
            <button className="back-btn" onClick={() => navigate("/taskweek")}>
              ← Back to Tasks
            </button>
            <div className="header-actions">
              {!isEditing ? (
                <>
                  <button 
                    className="focus-btn" 
                    onClick={() => navigate("/focussession", { 
                      state: { 
                        task: {
                          id: task.id,
                          title: task.title,
                          description: task.description,
                          priority: task.priority,
                          listId: listId
                        }
                      } 
                    })}
                  >
                    🎯 Start Focus Session
                  </button>
                  <button className="edit-btn" onClick={() => setIsEditing(true)}>
                    ✏️ Edit
                  </button>
                  <button className="delete-btn" onClick={handleDelete}>
                    🗑️ Delete
                  </button>
                </>
              ) : (
                <>
                  <button className="save-btn" onClick={handleSave}>
                    💾 Save
                  </button>
                  <button className="cancel-btn" onClick={() => {
                    setIsEditing(false);
                    setFormData({
                      title: task.title || "",
                      description: task.description || "",
                      status: task.status || "OPEN",
                      priority: task.priority || "MEDIUM",
                      dueDate: task.dueDate || ""
                    });
                  }}>
                    ✖ Cancel
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="task-detail-content">
            <div className="form-group">
              <label>Title</label>
              {isEditing ? (
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="form-input"
                />
              ) : (
                <h2>{task.title}</h2>
              )}
            </div>

            <div className="form-group">
              <label>Description</label>
              {isEditing ? (
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="form-textarea"
                  rows="5"
                />
              ) : (
                <p className="description-text">
                  {task.description || "No description"}
                </p>
              )}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Status</label>
                {isEditing ? (
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="form-select"
                  >
                    <option value="OPEN">Open</option>
                    <option value="CLOSED">Closed</option>
                  </select>
                ) : (
                  <span className={`status-badge ${task.status.toLowerCase()}`}>
                    {task.status}
                  </span>
                )}
              </div>

              <div className="form-group">
                <label>Priority</label>
                {isEditing ? (
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    className="form-select"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                  </select>
                ) : (
                  <span className={`priority-badge ${task.priority.toLowerCase()}`}>
                    {task.priority}
                  </span>
                )}
              </div>

              <div className="form-group">
                <label>Due Date</label>
                {isEditing ? (
                  <input
                    type="date"
                    name="dueDate"
                    value={formData.dueDate}
                    onChange={handleChange}
                    className="form-input"
                  />
                ) : (
                  <p>{task.dueDate || "No due date"}</p>
                )}
              </div>
            </div>

            <div className="task-metadata">
              <div className="metadata-item">
                <span className="metadata-label">Task ID:</span>
                <span>{task.id}</span>
              </div>
              <div className="metadata-item">
                <span className="metadata-label">List ID:</span>
                <span>{listId}</span>
              </div>
              {task.createdAt && (
                <div className="metadata-item">
                  <span className="metadata-label">Created:</span>
                  <span>{new Date(task.createdAt).toLocaleString()}</span>
                </div>
              )}
              {task.updatedAt && (
                <div className="metadata-item">
                  <span className="metadata-label">Updated:</span>
                  <span>{new Date(task.updatedAt).toLocaleString()}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
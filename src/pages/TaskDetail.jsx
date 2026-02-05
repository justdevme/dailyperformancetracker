import React, { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import "./TaskDetail.css";
import { apiFetch } from "./api.js"; // chỉnh path nếu api.js nằm chỗ khác

// Backend enums
const STATUS = ["PENDING", "IN_PROGRESS", "COMPLETED"];
const PRIORITY = ["LOW", "MEDIUM", "HIGH"];

// Map dayId (frontend) -> DayOfWeek (backend)
const REVERSE_DAYS_ENUM = {
  mon: "MONDAY",
  tue: "TUESDAY",
  wed: "WEDNESDAY",
  thu: "THURSDAY",
  fri: "FRIDAY",
  sat: "SATURDAY",
};

const DAY_OFFSET = {
  mon: 0,
  tue: 1,
  wed: 2,
  thu: 3,
  fri: 4,
  sat: 5,
};

function computeDueDate(weekStart, dayId) {
  if (!weekStart) return null;
  const offset = DAY_OFFSET[dayId] ?? 0;
  const d = new Date(`${weekStart}T00:00:00`);
  d.setDate(d.getDate() + offset);
  return d.toISOString().slice(0, 10); // "YYYY-MM-DD" for LocalDate
}

export default function TaskDetail() {
  const navigate = useNavigate();
  const { state } = useLocation();

  // Context passed from WeekGoals:
  // state: { week, dayId, weekId, weekStart, mode }
  const ctx = useMemo(() => {
    return {
      week: state?.week || "Week 1",
      dayId: state?.dayId || "mon",
      weekId: state?.weekId ?? null,
      weekStart: state?.weekStart ?? null,
      mode: state?.mode || "CREATE",
    };
  }, [state]);

  const [form, setForm] = useState({
    title: "",
    description: "",
    fileUrl: "", // UI only (backend chưa hỗ trợ)
    status: "PENDING",
    priority: "MEDIUM",
  });

  const [saving, setSaving] = useState(false);

  const onChange = (key) => (e) =>
    setForm((p) => ({ ...p, [key]: e.target.value }));

  const handleSave = async () => {
    if (!form.title.trim()) return alert("Title is required");

    // weekId is required by backend CreateTaskRequest
    if (!ctx.weekId) {
      return alert(
        "Missing weekId. Bạn cần truyền weekId khi navigate từ WeekGoals."
      );
    }

    const dayOfWeek = REVERSE_DAYS_ENUM[ctx.dayId];
    if (!dayOfWeek) return alert(`Invalid dayId: ${ctx.dayId}`);

    const req = {
      title: form.title.trim(),
      description: form.description?.trim() || "",
      status: form.status, // PENDING / IN_PROGRESS / COMPLETED
      priority: form.priority, // LOW / MEDIUM / HIGH
      dayOfWeek, // MONDAY...
      dueDate: computeDueDate(ctx.weekStart, ctx.dayId), // "YYYY-MM-DD" or null
      weekId: ctx.weekId, // Long
    };

    try {
      setSaving(true);

      // Controller: @RequestMapping("/api/v1") + @PostMapping -> POST /api/v1
      const saved = await apiFetch("/api/v1", {
        method: "POST",
        body: JSON.stringify(req),
      });

      // Convert backend Task -> UI task format used in WeekGoals
      const uiTask = {
        id: saved.id,
        name: saved.title,
        completed: String(saved.status).toUpperCase() === "COMPLETED",
        backend: saved,
      };

      navigate("/weekgoals", {
        state: {
          action: "CREATE_TASK",
          payload: { week: ctx.week, dayId: ctx.dayId, task: uiTask },
        },
        replace: true,
      });
    } catch (e) {
      alert(e.message || "Create task failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="layout">
      <Sidebar />

      <div className="main">
        <div className="taskweek">
          <div className="taskweek-header">
            <div className="header-content">
              <h1 className="page-title">Task Detail</h1>
              <p className="page-subtitle">
                Create a task for <b>{ctx.week}</b> — <b>{ctx.dayId}</b>
              </p>
            </div>

            <div className="header-stats">
              <div className="stat-badge">
                <span className="stat-value">{ctx.week}</span>
                <span className="stat-label">Week</span>
              </div>
              <div className="stat-badge primary">
                <span className="stat-value">{ctx.dayId}</span>
                <span className="stat-label">Day</span>
              </div>
            </div>
          </div>

          <div className="taskdetail-grid">
            <div className="taskdetail-card">
              <div className="taskdetail-card-header">
                <h3>Create new task</h3>
                <p>Fill in the details then hit save.</p>
              </div>

              <div className="taskdetail-form">
                <div className="taskdetail-field">
                  <label>Title</label>
                  <input
                    className="taskdetail-input"
                    value={form.title}
                    onChange={onChange("title")}
                    placeholder="e.g., Finish report / Study calculus..."
                    disabled={saving}
                  />
                </div>

                <div className="taskdetail-field">
                  <label>Description</label>
                  <textarea
                    className="taskdetail-textarea"
                    value={form.description}
                    onChange={onChange("description")}
                    placeholder="Add details..."
                    disabled={saving}
                  />
                </div>

                <div className="taskdetail-field">
                  <label>File / URL (UI only)</label>
                  <input
                    className="taskdetail-input"
                    value={form.fileUrl}
                    onChange={onChange("fileUrl")}
                    placeholder="https://... or file link"
                    disabled={saving}
                  />
                  <small style={{ opacity: 0.75 }}>
                    Backend hiện chưa lưu field này, nên nó chỉ dùng để nhập tạm trên UI.
                  </small>
                </div>

                <div className="taskdetail-row">
                  <div className="taskdetail-field">
                    <label>Status</label>
                    <select
                      className="taskdetail-input"
                      value={form.status}
                      onChange={onChange("status")}
                      disabled={saving}
                    >
                      {STATUS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="taskdetail-field">
                    <label>Priority</label>
                    <select
                      className="taskdetail-input"
                      value={form.priority}
                      onChange={onChange("priority")}
                      disabled={saving}
                    >
                      {PRIORITY.map((p) => (
                        <option key={p} value={p}>
                          {p}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="taskdetail-actions">
                  <button
                    className="taskdetail-btn secondary"
                    onClick={() => navigate(-1)}
                    disabled={saving}
                  >
                    Cancel
                  </button>
                  <button
                    className="taskdetail-btn primary"
                    onClick={handleSave}
                    disabled={saving}
                  >
                    {saving ? "Saving..." : "Save"}
                  </button>
                </div>
              </div>
            </div>

            <div className="taskdetail-card hint">
              <h3>Tips</h3>
              <ul>
                <li>Use Priority HIGH for important tasks.</li>
                <li>Status COMPLETED will mark it as completed.</li>
                <li>You can attach a file link / URL for references (UI only).</li>
              </ul>
              <div style={{ marginTop: 12, opacity: 0.8, fontSize: 13 }}>
                <div>
                  <b>weekId:</b> {String(ctx.weekId ?? "(missing)")}
                </div>
                <div>
                  <b>weekStart:</b> {String(ctx.weekStart ?? "(missing)")}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

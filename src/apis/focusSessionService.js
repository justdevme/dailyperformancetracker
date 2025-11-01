import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080",
});

// 🧭 Thêm token vào mỗi request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// 🧭 FOCUS SESSIONS

// ✅ Bắt đầu focus session
export const startFocusSession = async (taskId) => {
  const res = await api.post(`/tasks/${taskId}/focusSession/start`);
  return res.data;
};

// ✅ Dừng focus session
export const stopFocusSession = async (taskId, sessionId) => {
  const res = await api.post(`/tasks/${taskId}/focusSession/stop/${sessionId}`);
  return res.data;
};

// ✅ Lấy tất cả focus sessions của một task
export const getFocusSessionsByTask = async (taskId) => {
  const res = await api.get(`/tasks/${taskId}/focusSession`);
  return res.data;
};
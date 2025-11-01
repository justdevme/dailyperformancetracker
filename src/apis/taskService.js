import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api/v1",
});

// 🧭 Thêm token vào mỗi request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;

// 🧭 TASK LISTS
export const getTaskLists = async () => {
  const res = await api.get("/task-lists");
  return res.data;
};

export const createTaskList = async (data) => {
  const res = await api.post("/task-lists", data);
  return res.data;
};

// 🧭 TASKS trong mỗi LIST
export const getTasksInList = async (taskListId) => {
  const res = await api.get(`/task-lists/${taskListId}/tasks`);
  return res.data;
};

export const createTaskInList = async (taskListId, data) => {
  const res = await api.post(`/task-lists/${taskListId}/tasks`, data);
  return res.data;
};

export const updateTaskInList = async (taskListId, taskId, data) => {
  const res = await api.put(`/task-lists/${taskListId}/tasks/${taskId}`, data);
  return res.data;
};

export const deleteTaskInList = async (taskListId, taskId) => {
  await api.delete(`/task-lists/${taskListId}/tasks/${taskId}`);
};

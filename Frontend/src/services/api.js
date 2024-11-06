// src/services/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080", // Adjust the port if your backend is running on a different port
});

export const getTasks = () => api.get("/tasks/all");
export const getTaskById = (id) => api.get(`/task/${id}`);
// export const createTask = (task) => api.post("/task/create", task);
export const createTask = (task) => api.post("/task/create", task);
export const updateTask = (id, task) => api.put(`/task/update/${id}`, task);
export const deleteTask = (id) => api.delete(`/task/delete/${id}`);

export default api;

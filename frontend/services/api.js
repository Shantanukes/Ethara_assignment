import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// ── Axios instance ────────────────────────────────────────────────────────────
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// ── Request interceptor: inject auth token ────────────────────────────────────
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('taskflow_token');
  if (token) config.headers['Authorization'] = `Bearer ${token}`;
  return config;
});

// ── Response interceptor: normalize + handle 401 ─────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('taskflow_token');
      localStorage.removeItem('taskflow_user');
      window.dispatchEvent(new CustomEvent('auth:logout'));
    }
    return Promise.reject(error);
  }
);

// ── Helper: extract data from { success, data } envelope ─────────────────────
const unwrap = (res) => res.data?.data ?? res.data;
const errMsg = (err) =>
  err.response?.data?.error || err.response?.data?.message || err.message || 'Something went wrong';

// ── Auth ──────────────────────────────────────────────────────────────────────
export const login = async (email, password) => {
  const res = await api.post('/users/login', { email, password });
  return unwrap(res);
};

export const register = async (payload) => {
  const res = await api.post('/users/add', payload);
  return unwrap(res);
};

// ── Users ─────────────────────────────────────────────────────────────────────
export const fetchUsers = async () => {
  const res = await api.get('/users/');
  return unwrap(res);
};

export const updateUserRole = async (id, role) => {
  const res = await api.post(`/users/update/${id}`, { role });
  return res.data;
};

export const deleteUser = async (id) => {
  const res = await api.delete(`/users/${id}`);
  return res.data;
};

// ── Projects ──────────────────────────────────────────────────────────────────
export const fetchProjects = async () => {
  const res = await api.get('/projects/');
  return unwrap(res);
};

export const createProject = async (payload) => {
  const res = await api.post('/projects/add', payload);
  return unwrap(res);
};

export const updateProject = async (id, payload) => {
  const res = await api.post(`/projects/update/${id}`, payload);
  return unwrap(res);
};

export const deleteProject = async (id) => {
  const res = await api.delete(`/projects/${id}`);
  return res.data;
};

// ── Tasks ─────────────────────────────────────────────────────────────────────
export const fetchTasks = async () => {
  const res = await api.get('/tasks/');
  return unwrap(res);
};

export const createTask = async (payload) => {
  const res = await api.post('/tasks/add', payload);
  return unwrap(res);
};

export const updateTask = async (id, payload) => {
  const res = await api.post(`/tasks/update/${id}`, payload);
  return unwrap(res);
};

export const deleteTask = async (id) => {
  const res = await api.delete(`/tasks/${id}`);
  return res.data;
};

export const deleteTasksByProject = async (projectId) => {
  const res = await api.delete(`/tasks/byProject/${projectId}`);
  return res.data;
};

export { errMsg };
export default api;

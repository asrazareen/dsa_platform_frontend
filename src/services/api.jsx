import axios from "axios";

const API = axios.create({
  baseURL: `${process.env.BACKEND_URL}/api`,
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export const registerUser = (data) => API.post("/auth/register", data);
export const loginUser = (data) => API.post("/auth/login", data);
export const fetchMe = () => API.get("/auth/me");

export const fetchTopics = () => API.get("/topics");

export const markComplete = (problemId) =>
  API.post("/progress/complete", { problemId });
export const markUncomplete = (problemId) =>
  API.post("/progress/uncomplete", { problemId });
export const fetchProgress = () => API.get("/progress");

export default API;

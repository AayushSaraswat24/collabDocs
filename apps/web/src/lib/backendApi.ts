import axios from "axios";

export const backendApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_EXPRESS_BASE_URL, 
  withCredentials: true,
});

backendApi.interceptors.request.use(async (config) => {

  const res = await fetch("/api/sessionToken");
  const { token } = await res.json();

  if (token) {
    config.headers["x-session-token"] = token;
  }

  return config;
});
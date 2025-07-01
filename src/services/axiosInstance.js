// src/services/axiosInstance.js
import axios from "axios";
import { DEV_BASE_URL, DEV_DOMAIN, DEV_TOKEN } from '../config/devHelper';

const axiosInstance = axios.create({
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  mode: "cors",
  cache: "no-cache",
});

// Request Interceptor for Token and Domain
axiosInstance.interceptors.request.use((config) => {
  let token = "";
  let domain = "";
  let baseURL = "";
  if (import.meta.env.MODE == "development") {
    // Development environment
    baseURL = DEV_BASE_URL;
    domain = DEV_DOMAIN;
    token = DEV_TOKEN;

  } else {
    // Production or other environments
    
      // Use environment variable if available
      baseURL = window.location.origin;
      domain = window.location.hostname;
      token = JSON.parse(localStorage.getItem("MMClientVars"))?.Token || "";
console.log("baseURL", {baseURL,domain,token});
    
    // // Get token from localStorage
    // token = localStorage.getItem("Token") || "";
  }

  config.baseURL = baseURL;
  config.headers.Authorization = `Bearer ${token}`;
  config.headers.domain = domain;

  return config;
}, error => Promise.reject(error));

// Response interceptor for token refresh or error
axiosInstance.interceptors.response.use(
  response => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await refreshTokenWithWebMethodCall();
        // After refreshing token, retry the original request
        return axiosInstance.request(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;

// Standalone async function for token refresh
export async function refreshTokenWithWebMethodCall() {
  try {
    const response = await axiosInstance.request({
      url: "/intranet/Members/Home/Home.aspx/GenerateTokenByRefreshToken",
      method: "post",
    });
    const resp = response.data;
    if (resp.d.Status === 200) {
      const MMClientVars = JSON.parse(localStorage.getItem("MMClientVars") || "{}");
      MMClientVars.Token = resp.d.Data.AccessToken;
      localStorage.setItem("MMClientVars", JSON.stringify(MMClientVars));
    } else {
      throw new Error("Token refresh failed: Invalid status");
    }
  } catch (error) {
    console.error("Token refresh error:", error);
    throw error; // Important: rethrow so retry logic knows it failed
  }
}



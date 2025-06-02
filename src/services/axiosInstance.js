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
  if (import.meta.env.MODE === "development") {
    // Development environment
    baseURL = DEV_BASE_URL;
    domain = DEV_DOMAIN;
    token = DEV_TOKEN;
    console.log("configCheck_Dev", baseURL,domain);

  } else {
    // Production or other environments
    const envBaseUrl = import.meta.env.BASE_URL;
    
    if (envBaseUrl) {
      // Use environment variable if available
      baseURL = `${window.location.origin}${envBaseUrl}`;
      domain = window.location.hostname;
    } 
    console.log("configCheck", baseURL,domain);
    
    // Get token from localStorage
    token = localStorage.getItem("Token") || "";
  }

  config.baseURL = baseURL;
  config.headers.Authorization = `Bearer ${token}`;
  config.headers.domain = domain;
  console.log("Request config:", { baseURL, domain });

  return config;
}, error => Promise.reject(error));

// Optional: Response interceptor for token refresh or error
axiosInstance.interceptors.response.use(
  response => response,
  async (error) => {
    if (error.response?.status === 401) {
      // implement token refresh logic here if needed
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;


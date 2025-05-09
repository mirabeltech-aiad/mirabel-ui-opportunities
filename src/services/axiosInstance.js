// src/services/axiosInstance.js
import axios from "axios";

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
  let token = ""; // same token logic from your apiCall
  let domain = "";
  let baseURL = "";
  console.log("config", config,import.meta.env);

//   const TokenDetails = JSON.parse(localStorage.getItem("TokenData") || "{}");

  if (import.meta.env.MODE === "development") {
    baseURL = `https://mirabeldev-qa.magazinemanager.com`;
    domain = "mirabeldev-qa";
    token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJMb2dnZWRJblVzZXJJRCI6IjE4OCIsIkxvZ2dlZEluU2l0ZUNsaWVudElEIjoiOTk0MSIsIkxvZ2dlZEluU2l0ZUN1bHR1cmVVSSI6ImVuLVVTIiwiRGF0ZVRpbWUiOiI1LzYvMjAyNSA1OjE0OjM5IEFNIiwiTG9nZ2VkSW5TaXRlQ3VycmVuY3lTeW1ib2wiOiIkIiwiTG9nZ2VkSW5TaXRlRGF0ZUZvcm1hdCI6IiIsIkRvbWFpbiI6Im1pcmFiZWxkZXYtcWEiLCJMb2dnZWRJblNpdGVUaW1lQWRkIjpbIjAiLCIwIl0sIlNvdXJjZSI6IlRNTSIsIkVtYWlsIjoic2FAbWFnYXppbmVtYW5hZ2VyLmNvbSIsIklzQVBJVXNlciI6IkZhbHNlIiwibmJmIjoxNzQ2NTA4NDc5LCJleHAiOjE3NDY4MDg0NzksImlhdCI6MTc0NjUwODQ3OSwiaXNzIjoiTWFnYXppbmVNYW5hZ2VyIiwiYXVkIjoiKiJ9.4n4h4r8Vj1_6fc8ZyWlLl8MeuhQyKb_FIviaVR20gR4"
  } else {
    baseURL = process.env.REACT_APP_API_BASE_URL;
    domain = "your_production_domain"; // replace with getGlobalMessage if needed
    token = localStorage.getItem("Token");
  }

  config.baseURL = baseURL;
  config.headers.Authorization = `Bearer ${token}`;
  config.headers.domain = domain;
  console.log("tokennddd", config);


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


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
    token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJMb2dnZWRJblVzZXJJRCI6IjEiLCJMb2dnZWRJblNpdGVDbGllbnRJRCI6Ijk5MjAiLCJMb2dnZWRJblNpdGVDdWx0dXJlVUkiOiJlbi11cyIsIkRhdGVUaW1lIjoiNS8xMy8yMDI1IDY6MjM6NTkgUE0iLCJMb2dnZWRJblNpdGVDdXJyZW5jeVN5bWJvbCI6IiQiLCJMb2dnZWRJblNpdGVEYXRlRm9ybWF0IjoiIiwiRG9tYWluIjoibWlyYWJlbGRldiIsIkxvZ2dlZEluU2l0ZVRpbWVBZGQiOlsiMCIsIjAiXSwiU291cmNlIjoiVE1NIiwiRW1haWwiOiJzYUBtYWdhemluZW1hbmFnZXIuY29tIiwiSXNBUElVc2VyIjoiRmFsc2UiLCJuYmYiOjE3NDcxNjA2MzksImV4cCI6MTc0NzQ2MDYzOSwiaWF0IjoxNzQ3MTYwNjM5LCJpc3MiOiJNYWdhemluZU1hbmFnZXIiLCJhdWQiOiIqIn0._tLCZ3Gu32HBXeSy5BSxGnRdWpJYRmQXxH-AntS1mus"
  } else {
    baseURL = process.env.REACT_APP_API_BASE_URL;
    domain = import.meta.url // replace with getGlobalMessage if needed
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


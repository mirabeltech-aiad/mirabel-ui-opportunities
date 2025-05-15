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
  let token = "";
  let domain = "";
  let baseURL = "";
  if (import.meta.env.MODE === "development") {
    // Development environment
    baseURL = `https://tier1-feature18.magazinemanager.com/`;
    domain = "tier1-feature18";
    token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJMb2dnZWRJblVzZXJJRCI6IjEiLCJMb2dnZWRJblNpdGVDbGllbnRJRCI6Ijk5NzAiLCJMb2dnZWRJblNpdGVDdWx0dXJlVUkiOiJlbi1VUyIsIkRhdGVUaW1lIjoiNS8xNS8yMDI1IDc6NTY6NDkgQU0iLCJMb2dnZWRJblNpdGVDdXJyZW5jeVN5bWJvbCI6IiQiLCJMb2dnZWRJblNpdGVEYXRlRm9ybWF0IjoiZXVyb3BlYW4iLCJEb21haW4iOiJ0aWVyMS1mZWF0dXJlMTgiLCJMb2dnZWRJblNpdGVUaW1lQWRkIjpbIjAiLCIwIl0sIlNvdXJjZSI6IlRNTSIsIkVtYWlsIjoic2FAbWFnYXppbmVtYW5hZ2VyLmNvbSIsIklzQVBJVXNlciI6IkZhbHNlIiwibmJmIjoxNzQ3Mjk1ODA5LCJleHAiOjE3NDczMTAyMDksImlhdCI6MTc0NzI5NTgwOSwiaXNzIjoiTWFnYXppbmVNYW5hZ2VyIiwiYXVkIjoiKiJ9.4cxrlKy_Y_m99w7cG9b1weBufAOy1G7mx3iogEQMhjU";
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


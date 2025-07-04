// src/services/axiosInstance.js
import axios from "axios";
import { DEV_BASE_URL, DEV_DOMAIN, DEV_TOKEN } from '../config/devHelper';
import { getSessionValue, setSessionValue } from '../utils/sessionHelpers';
import { isTokenValid, AUTH_ERRORS } from '../utils/authHelpers';
import { isDevelopmentMode } from '../utils/developmentHelper';

const axiosInstance = axios.create({
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  timeout: 30000, // 30 seconds timeout
  mode: "cors",
  cache: "no-cache",
});

// Token refresh status to prevent multiple simultaneous refresh attempts
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

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
  } else {
    // Production or other environments
    baseURL = window.location.origin;
    domain = window.location.hostname;
    token = getSessionValue("Token") || "";
  }

  // Validate token before making request
  if (token && !isTokenValid(token)) {
    console.warn("Token is invalid or expired, attempting refresh...");
    // Token is invalid, we'll let the response interceptor handle it
  }

  config.baseURL = baseURL;
  config.headers.Authorization = token ? `Bearer ${token}` : '';
  config.headers.domain = domain;
  config.headers['X-Requested-With'] = 'XMLHttpRequest';

  // Add request timestamp for debugging
  config.metadata = { startTime: new Date() };

  console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`, {
    baseURL,
    domain,
    hasToken: !!token,
    tokenValid: token ? isTokenValid(token) : false
  });

  return config;
}, (error) => {
  console.error("Request interceptor error:", error);
  return Promise.reject(error);
});

// Response interceptor for token refresh and error handling
axiosInstance.interceptors.response.use(
  (response) => {
    // Log response time for debugging
    const endTime = new Date();
    const duration = endTime - response.config.metadata.startTime;
    console.log(`API Response: ${response.status} ${response.config.url} (${duration}ms)`);

    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Log error details
    console.error("API Error:", {
      url: originalRequest?.url,
      method: originalRequest?.method,
      status: error.response?.status,
      message: error.message,
      data: error.response?.data
    });

    // Handle 401 Unauthorized errors
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If we're already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return axiosInstance(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newToken = await refreshTokenWithWebMethodCall();
        processQueue(null, newToken);

        // Retry the original request with new token
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);

        // In development mode, don't redirect to login - just log the error
        if (isDevelopmentMode()) {
          console.error("Token refresh failed in development mode:", refreshError);
          return Promise.reject(refreshError);
        }

        // Redirect to login page or show auth error (production only)
        console.error("Token refresh failed, redirecting to login");

        // Clear auth data
        localStorage.removeItem("MMClientVars");

        // You can dispatch a custom event or use a global state management solution
        window.dispatchEvent(new CustomEvent('auth:logout', {
          detail: { reason: 'token_refresh_failed' }
        }));

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Handle specific error types
    if (error.response?.status === 403) {
      console.error("Access forbidden - insufficient permissions");
      return Promise.reject(new Error("You don't have permission to access this resource"));
    }

    if (error.response?.status === 404) {
      console.error("Resource not found");
      return Promise.reject(new Error("The requested resource was not found"));
    }

    if (error.response?.status >= 500) {
      console.error("Server error");
      return Promise.reject(new Error("Server error - please try again later"));
    }

    // Handle network errors
    if (!error.response) {
      console.error("Network error - no response received");
      return Promise.reject(new Error("Network error - please check your connection"));
    }

    return Promise.reject(error);
  }
);

// Enhanced token refresh function
export async function refreshTokenWithWebMethodCall() {
  try {
    const refreshToken = getSessionValue("RefreshToken");
    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    console.log("Attempting token refresh...");

    const response = await axios.post(
      `${import.meta.env.MODE === "development" ? DEV_BASE_URL : window.location.origin}/intranet/Members/Home/Home.aspx/GenerateTokenByRefreshToken`,
      { refreshToken },
      {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 10000 // 10 second timeout for refresh
      }
    );

    const resp = response.data;

    if (resp.d?.Status === 200 && resp.d?.Data?.AccessToken) {
      const newToken = resp.d.Data.AccessToken;
      const newRefreshToken = resp.d.Data.RefreshToken;

      // Update stored tokens
      setSessionValue("Token", newToken);
      if (newRefreshToken) {
        setSessionValue("RefreshToken", newRefreshToken);
      }

      console.log("Token refresh successful");
      return newToken;
    } else {
      throw new Error(`Token refresh failed: ${resp.d?.Message || "Invalid response"}`);
    }
  } catch (error) {
    console.error("Token refresh error:", error);
    throw new Error(AUTH_ERRORS.REFRESH_FAILED);
  }
}

// Add request/response logging in development
if (import.meta.env.MODE === "development") {
  axiosInstance.interceptors.request.use(
    (config) => {
      console.group(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
      console.log("Config:", config);
      console.groupEnd();
      return config;
    },
    (error) => {
      console.error("Request Error:", error);
      return Promise.reject(error);
    }
  );

  axiosInstance.interceptors.response.use(
    (response) => {
      console.group(`✅ API Response: ${response.status} ${response.config.url}`);
      console.log("Response:", response.data);
      console.groupEnd();
      return response;
    },
    (error) => {
      console.group(`❌ API Error: ${error.response?.status} ${error.config?.url}`);
      console.error("Error:", error);
      console.groupEnd();
      return Promise.reject(error);
    }
  );
}

// Helper function to create authenticated requests
export const createAuthenticatedRequest = (token) => {
  return axios.create({
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    timeout: 30000,
  });
};

// Export configured instance
export default axiosInstance;




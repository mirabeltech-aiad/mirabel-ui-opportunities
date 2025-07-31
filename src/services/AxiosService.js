import axios from "axios";
import { devApiConfig, isDevelopmentMode } from '../utils/developmentHelper';
import { getSessionValue, setSessionValue } from '../utils/sessionHelpers';
import { AUTH_API, STATIC_URLS } from '../utils/apiUrls';

/**
 * Consolidated AxiosService with built-in axios instance configuration
 * Includes authentication, token refresh, error handling, and convenience methods
 * Can be used directly without 'new' keyword: AxiosService.get()
 */

// Configuration
const CONFIG = {
  timeout: 30000,
};

// Token refresh queue management
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

// Environment configuration
const getEnvironmentConfig = () => {
  if (import.meta.env.MODE === "development") {
    return {
      baseURL: devApiConfig.baseUrl,
      domain: devApiConfig.domain,
      token: devApiConfig.token
    };
  }
  
  return {
    baseURL: window.location.origin,
    domain: window.location.hostname,
    token: getSessionValue("Token") || ""
  };
};

// Create axios instance with environment-specific CORS configuration
const axiosInstance = axios.create({
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  timeout: CONFIG.timeout,
  // In development, don't send credentials to avoid CORS issues
  withCredentials: !isDevelopmentMode(),
});

// Request Interceptor
axiosInstance.interceptors.request.use((config) => {
  const envConfig = getEnvironmentConfig();
  
  config.baseURL = envConfig.baseURL;
  config.headers.Authorization = envConfig.token ? `Bearer ${envConfig.token}` : '';
  config.headers.domain = envConfig.domain;
  config.headers['X-Requested-With'] = 'XMLHttpRequest';
  
  // In development mode, adjust configuration for CORS
  if (isDevelopmentMode()) {
    config.metadata = { startTime: new Date() };
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    
    // Remove authorization header in development to avoid CORS preflight
    if (!envConfig.token) {
      delete config.headers.Authorization;
    }
  }

  return config;
}, (error) => {
  console.error("Request interceptor error:", error);
  return Promise.reject(error);
});

// Error handling helper
const createErrorMessage = (status) => {
  const errorMessages = {
    403: "You don't have permission to access this resource",
    404: "The requested resource was not found",
    500: "Server error - please try again later",
    network: "Network error - please check your connection"
  };
  
  if (status >= 500) return errorMessages[500];
  return errorMessages[status] || `Request failed with status ${status}`;
};

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    if (isDevelopmentMode() && response.config.metadata) {
      const duration = new Date() - response.config.metadata.startTime;
      console.log(`✅ API Response: ${response.status} ${response.config.url} (${duration}ms)`);
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (isDevelopmentMode()) {
      console.error("❌ API Error:", {
        url: originalRequest?.url,
        status: error.response?.status,
        message: error.message
      });
    }

    // Handle 401 Unauthorized - Token refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return axiosInstance(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newToken = await refreshTokenWithWebMethodCall();
        processQueue(null, newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        
        if (!isDevelopmentMode()) {
          localStorage.removeItem("MMClientVars");
          window.location.href = `${envConfig.baseURL}${STATIC_URLS.LOGOUT}`;
        }
        
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Handle other errors
    const status = error.response?.status;
    if (status && status !== 401) {
      return Promise.reject(new Error(createErrorMessage(status)));
    }

    if (!error.response) {
      return Promise.reject(new Error(createErrorMessage('network')));
    }

    return Promise.reject(error);
  }
);

// Token refresh function
async function refreshTokenWithWebMethodCall() {
  const refreshToken = getSessionValue("RefreshToken");
  if (!refreshToken) {
    throw new Error("No refresh token available");
  }

  if (isDevelopmentMode()) {
    console.log("🔄 Attempting token refresh...");
  }

  const envConfig = getEnvironmentConfig();
  const response = await axios.post(
    `${envConfig.baseURL}${AUTH_API.REFRESH_TOKEN}`,
    { refreshToken },
    {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true,
      timeout: 10000
    }
  );

  const resp = response.data;
  if (resp.d?.Status === 200 && resp.d?.Data?.AccessToken) {
    const newToken = resp.d.Data.AccessToken;
    const newRefreshToken = resp.d.Data.RefreshToken;

    setSessionValue("Token", newToken);
    if (newRefreshToken) {
      setSessionValue("RefreshToken", newRefreshToken);
    }

    if (isDevelopmentMode()) {
      console.log("✅ Token refresh successful");
    }
    return newToken;
  } else {
    throw new Error(`Token refresh failed: ${resp.d?.Message || "Invalid response"}`);
  }
}

/**
 * Unified error handling for all methods
 */
const handleError = (error) => {
  if (isDevelopmentMode()) {
    console.error('AxiosService Error:', error);
  }

  // If it's already a handled error with a message, return it
  if (error.message && typeof error.message === 'string') {
    return error;
  }

  // Handle axios errors
  if (error.response) {
    const status = error.response.status;
    const message = error.response.data?.message || 
                   error.response.data?.error || 
                   `Request failed with status ${status}`;
    return new Error(message);
  }

  // Handle network errors
  if (error.request) {
    return new Error('Network error - please check your connection');
  }

  // Handle other errors
  return new Error(error.message || 'An unexpected error occurred');
};

/**
 * Extract content from response data if available
 * Returns response.data.content if it exists, otherwise returns response.data
 */
const extractResponseContent = (responseData) => {
  // If the response has a content property, return it
  if (responseData && typeof responseData === 'object' && responseData.content !== undefined) {
    return responseData.content;
  }
  
  // Otherwise return the full response data
  return responseData;
};

/**
 * AxiosService singleton object with all functionality consolidated
 */
const axiosService = {
  // Basic HTTP methods
  async get(url, config = {}) {
    try {
      const response = await axiosInstance.get(url, config);
      return extractResponseContent(response.data);
    } catch (error) {
      throw handleError(error);
    }
  },

  async post(url, data = {}, config = {}) {
    try {
      const response = await axiosInstance.post(url, data, config);
      return extractResponseContent(response.data);
    } catch (error) {
      throw handleError(error);
    }
  },

  async put(url, data = {}, config = {}) {
    try {
      const response = await axiosInstance.put(url, data, config);
      return extractResponseContent(response.data);
    } catch (error) {
      throw handleError(error);
    }
  },

  async patch(url, data = {}, config = {}) {
    try {
      const response = await axiosInstance.patch(url, data, config);
      return extractResponseContent(response.data);
    } catch (error) {
      throw handleError(error);
    }
  },

  async delete(url, config = {}) {
    try {
      const response = await axiosInstance.delete(url, config);
      return extractResponseContent(response.data);
    } catch (error) {
      throw handleError(error);
    }
  },

  async options(url, config = {}) {
    try {
      const response = await axiosInstance.options(url, config);
      return extractResponseContent(response.data);
    } catch (error) {
      throw handleError(error);
    }
  },

  // Convenience methods
  async getWithParams(url, params = {}, config = {}) {
    return this.get(url, { ...config, params });
  },

  async postForm(url, formData, config = {}) {
    const formConfig = {
      ...config,
      headers: {
        'Content-Type': 'multipart/form-data',
        ...config.headers
      }
    };
    return this.post(url, formData, formConfig);
  },

  /**
   * Enhanced webMethodCall with better error handling
   * Maintains compatibility with existing usage patterns
   */
  async webMethodCall(
    endpoint,
    method = 'GET',
    data = {},
    headers = {},
    options = {}
  ) {
    try {
      const config = {
        url: endpoint,
        method: method.toLowerCase(),
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          ...headers,
        },
        ...options,
      };

      if (method.toUpperCase() !== 'GET') {
        config.data = data;
      } else {
        config.params = data;
      }

      const response = await axiosInstance.request(config);
      return extractResponseContent(response.data);
    } catch (error) {
      // Handle specific legacy redirects
      if (error.response?.status === 301) {
        window.location.href = STATIC_URLS.SESSION_OUT;
        return;
      }
      throw handleError(error);
    }
  },

  // Utility methods
  getBaseURL() {
    return axiosInstance.defaults.baseURL;
  },

  getDefaultHeaders() {
    return axiosInstance.defaults.headers;
  },

  // Direct access to axios instance for advanced usage
  getInstance() {
    return axiosInstance;
  }
};

// Export singleton instance as default
export default axiosService; 
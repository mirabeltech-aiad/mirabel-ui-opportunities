import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import {
  getSessionValue,
  setSessionValue,
  isActiveSession,
  getUserInfo,
  resetSession,
  isSameSession,
} from "../utils/sessionHelpers";
import { AUTH_ERRORS, getMainLoginUrl, logout } from "../utils/authHelpers";
import { AUTH_API } from "@/utils/apiUrls";
import { useIdleDetectionWithWarning } from "@/features/Home/hooks/useIdleDetectionWithWarning";
import { getIdleDetectionPreferences } from "@/features/Home/services/idleDetectionService";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Get idle detection preferences
  const preferences = getIdleDetectionPreferences();
  
  // Initialize global idle detection using existing logout function
  const {
    showWarning,
    remainingTime,
    extendSession,
    closeWarning,
    enabled,
    timeout,
    warningTime
  } = useIdleDetectionWithWarning(
    preferences.timeout,
    preferences.enabled
  );

  // Initialize authentication state
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Check if session is active
        if (isActiveSession()) {
          const userInfo = getUserInfo();
          setUser(userInfo);
        } else {
          const clientDetails = localStorage.getItem("MMClientVars");
          if (clientDetails) {
            const sessionData = JSON.parse(clientDetails);
            if (sessionData.IsAuthenticated && !isSameSession()) {
              resetSession();
            }
          }
        }
      } catch (error) {
        console.error('AuthContext: Error during initialization:', error);
        setAuthError(AUTH_ERRORS.INVALID_TOKEN);
        resetSession();
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    // Storage event listener for cross-tab monitoring
    const handleStorageChange = (event) => {
      if (event.key === "MMClientVars") {
        setTimeout(() => {
          if (isActiveSession()) {
            const userInfo = getUserInfo();
            setUser(userInfo);
          } else {
            setUser(null);
          }
        }, 100);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Modified login function
  const login = useCallback(async (credentials) => {
    setIsAuthenticating(true);
    setAuthError(null);

    try {
      sessionStorage.setItem("auth_return_url", window.location.pathname);
      const returnUrl = window.location.href;
      const mainLoginUrl = getMainLoginUrl(returnUrl);
      window.location.href = mainLoginUrl;
    } catch (error) {
      setAuthError(error.message || AUTH_ERRORS.NETWORK_ERROR);
      setIsAuthenticating(false);
    }
  }, []);

  // Modified detectSession
  const detectSession = useCallback(() => {
    if (isActiveSession()) {
      const userInfo = getUserInfo();
      setUser(userInfo);
      return true;
    } else {
      const clientDetails = localStorage.getItem("MMClientVars");
      if (clientDetails) {
        const sessionData = JSON.parse(clientDetails);
        if (sessionData.IsAuthenticated) {
          if (!isSameSession()) {
            resetSession();
            setUser(null);
            return false;
          }
        }
      }
      setUser(null);
      return false;
    }
  }, []);

  // Logout
  const handleLogout = useCallback(() => {
    setUser(null);
    setAuthError(null);
    logout();
  }, []);

  // Refresh token
  const refreshToken = useCallback(async () => {
    try {
      const refreshToken = getSessionValue("RefreshToken");
      if (!refreshToken) {
        throw new Error("No refresh token available");
      }

      const response = await fetch(
        AUTH_API.REFRESH_TOKEN,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ refreshToken }),
        }
      );

      if (!response.ok) {
        throw new Error("Token refresh failed");
      }

      const data = await response.json();

      if (data.d?.Status === 200 && data.d?.Data?.AccessToken) {
        const newToken = data.d.Data.AccessToken;
        const newRefreshToken = data.d.Data.RefreshToken;

        setSessionValue("Token", newToken);
        if (newRefreshToken) {
          setSessionValue("RefreshToken", newRefreshToken);
        }
        return newToken;
      } else {
        throw new Error(data.d?.Message || "Token refresh failed");
      }
    } catch (error) {
      setAuthError(AUTH_ERRORS.REFRESH_FAILED);
      handleLogout();
      throw error;
    }
  }, [handleLogout]);

  // Clear error
  const clearError = useCallback(() => {
    setAuthError(null);
  }, []);

  // Check if user has specific permission
  const hasPermission = useCallback(
    (permission) => {
      if (!user) return false;
      // Add permission logic based on user data
      return true;
    },
    [user]
  );

  // Update user info
  const updateUser = useCallback((updates) => {
    setUser((prevUser) => ({
      ...prevUser,
      ...updates,
    }));
  }, []);

  const value = {
    user,
    isAuthenticated: !!user,
    isAuthenticating,
    authError,
    loading,
    login,
    logout: handleLogout,
    refreshToken,
    clearError,
    hasPermission,
    updateUser,
    detectSession,
    // Idle detection state
    idleDetection: {
      showWarning,
      remainingTime,
      extendSession,
      closeWarning,
      enabled,
      timeout,
      warningTime
    }
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

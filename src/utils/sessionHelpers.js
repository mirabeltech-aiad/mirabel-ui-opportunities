// Session management functions - matches mirabel.mm.ui/src/utilities/commonHelpers.js

import { isDevelopmentMode, sessionValues } from './developmentHelper';

// Get session value from MMClientVars
export const getSessionValue = function (key) {
    try {
        const MMClientVars = JSON.parse(localStorage.getItem("MMClientVars") || "{}");

        // In development mode, if the value is not found, use direct fallback
        if (isDevelopmentMode() && (!MMClientVars[key] || MMClientVars[key] === "")) {

            // Direct fallback values for development
            const devFallbacks = {
                "Email": "techsupport@magazinemanager.com",
                "UserID": "49",
                "Token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJMb2dnZWRJblVzZXJJRCI6IjQ5IiwiTG9nZ2VkSW5TaXRlQ2xpZW50SUQiOiI1IiwiTG9nZ2VkSW5TaXRlQ3VsdHVyZVVJIjoiZW4tVVMiLCJEYXRlVGltZSI6IjcvMy8yMDI1IDQ6NTQ6MDMgUE0iLCJMb2dnZWRJblNpdGVDdXJyZW5jeVN5bWJvbCI6IiQiLCJMb2dnZWRJblNpdGVEYXRlRm9ybWF0IjoiIiwiRG9tYWluIjoidGVjaCIsIkxvZ2dlZEluU2l0ZVRpbWVBZGQiOlsiMCIsIjAiXSwiU291cmNlIjoiVE1NIiwiRW1haWwiOiJ0ZWNoc3VwcG9ydEBtYWdhemluZW1hbmFnZXIuY29tIiwiSXNBUElVc2VyIjoiRmFsc2UiLCJuYmYiOjE3NTE1NjE2NDMsImV4cCI6MTk3MjMxMzY0MywiaWF0IjoxNzUxNTYxNjQzLCJpc3MiOiJNYWdhemluZU1hbmFnZXIiLCJhdWQiOiIqIn0.QistJdizz9HGKfmjPPAcRn_dDohuEVPljJpeBp1T3u4",
                "Domain": "mirabeldev",
                "ClientID": "5",
                "IsAuthenticated": true
            };

            return devFallbacks[key] || "";
        }

        return MMClientVars[key] || "";
    } catch (error) {
        if (isDevelopmentMode()) {
            // Basic fallback for Email in development
            if (key === "Email") {
                return "techsupport@magazinemanager.com";
            }
        }
        return "";
    }
};

// Set session value in MMClientVars
export const setSessionValue = function (key, value) {
    try {
        const MMClientVars = JSON.parse(localStorage.getItem("MMClientVars") || "{}");
        MMClientVars[key] = value;
        localStorage.setItem("MMClientVars", JSON.stringify(MMClientVars));
    } catch (error) {
        console.error("Error setting session value:", error);
    }
};

// Get session details
export const getSessionDetails = () => {
    try {
        const storedSession = JSON.parse(localStorage.getItem("MMClientVars") || "{}");

        // In development mode, merge with devHelper values for missing properties
        if (isDevelopmentMode()) {
            const mergedSession = { ...sessionValues, ...storedSession };
            return mergedSession;
        }

        return storedSession;
    } catch (error) {
        if (isDevelopmentMode()) {
            return sessionValues;
        }
        return {};
    }
};

// Set client session
export const setClientSession = (sessionData) => {
    try {
        localStorage.setItem("MMClientVars", JSON.stringify(sessionData));
    } catch (error) {
        console.error("Error setting client session:", error);
    }
};

// Reset session
export const resetSession = () => {
    try {
        localStorage.removeItem("MMClientVars");
        sessionStorage.removeItem("ClientID");
    } catch (error) {
        console.error("Error resetting session:", error);
    }
};

// Check if session is active
export const isActiveSession = () => {
    try {
        const MMClientVars = JSON.parse(localStorage.getItem("MMClientVars") || "{}");

        // Use same flexible authentication check as shouldRedirectToLogin
        const hasExplicitAuth = MMClientVars.IsAuthenticated === true ||
            MMClientVars.IsAuthenticated === 'true' ||
            MMClientVars.IsAuthenticated === 1;

        // If no explicit IsAuthenticated field, check if we have essential auth indicators
        const hasEssentialAuthData = MMClientVars.Email && MMClientVars.Token && MMClientVars.UserID;

        const isAuthenticated = hasExplicitAuth || hasEssentialAuthData;
        const isSame = isSameSession();

        return isAuthenticated && isSame;
    } catch (error) {
        console.error("Error checking active session:", error);
        return false;
    }
};

// Check if same session (cross-tab validation)
export const isSameSession = () => {
    try {
        const sessionClientID = sessionStorage.getItem("ClientID");
        const MMClientVars = JSON.parse(localStorage.getItem("MMClientVars") || "{}");
        const localStorageClientID = MMClientVars.ClientID;

        return sessionClientID === localStorageClientID;
    } catch (error) {
        console.error("Error checking same session:", error);
        return false;
    }
};

// Initialize session storage if not exists
export const initializeSessionStorage = () => {
    try {
        const MMClientVars = JSON.parse(localStorage.getItem("MMClientVars") || "{}");
        if (MMClientVars.ClientID && !sessionStorage.getItem("ClientID")) {
            sessionStorage.setItem("ClientID", MMClientVars.ClientID);
        }
    } catch (error) {
        console.error("Error initializing session storage:", error);
    }
};

// Check if user should be redirected to login (production only)
export const shouldRedirectToLogin = () => {
    // Never redirect in development mode
    if (isDevelopmentMode()) {
        return false;
    }

    try {
        const MMClientVars = localStorage.getItem("MMClientVars");

        // If no MMClientVars at all, redirect to login
        if (!MMClientVars) {
            return true;
        }
        const sessionData = JSON.parse(MMClientVars);

        const hasExplicitAuth = sessionData.IsAuthenticated === true ||
            sessionData.IsAuthenticated === 'true' ||
            sessionData.IsAuthenticated === 1;

        const hasEssentialAuthData = sessionData.Email && sessionData.Token && sessionData.UserID;

        const isAuthenticated = hasExplicitAuth || hasEssentialAuthData;

        if (!isAuthenticated) {
            return true;
        }

        if (!sessionData.Email) {
            return true;
        }

        if (!sessionData.Token) {
            return true;
        }

        // Check if session is active (cross-tab validation) - make this more robust
        const sessionClientID = sessionStorage.getItem("ClientID");
        const localStorageClientID = sessionData.ClientID;

        // If ClientID doesn't match, try to fix it instead of redirecting immediately
        if (sessionClientID !== localStorageClientID) {
            if (localStorageClientID) {
                sessionStorage.setItem("ClientID", localStorageClientID);
            } else {
                return true;
            }
        }
        return false;
    } catch (error) {
        return true;
    }
};

// Perform login redirect (production only)
export const performLoginRedirect = (returnUrl = null) => {
    // Never redirect in development mode
    if (isDevelopmentMode()) {
        return;
    }
    const baseUrl = window.location.origin;
    const loginUrl = `${baseUrl}/intranet/Login.aspx`;

    window.location.href = loginUrl;
};

// Enhanced authentication check that handles both development and production
export const checkAuthenticationStatus = async () => {
  
    try {
        // Import navigationService dynamically to avoid circular dependencies
        const { navigationService } = await import('../features/Homepage/services/navigationService');
        await navigationService.loadSessionDetails();
        console.log('✅ Session details loaded in development mode');
    } catch (error) {
        console.warn('⚠️ Could not load session details in development mode:', error);
    }

    if (isDevelopmentMode()) {
        // In development, always ensure session is availabl
        const existingSession = localStorage.getItem("MMClientVars");
        if (!existingSession) {
            setClientSession(sessionValues);
            sessionStorage.setItem("ClientID", sessionValues.ClientID);
        }
        return { authenticated: true, shouldRedirect: false, environment: 'development' };
    } else {
        // In production, check for valid authentication
     //   const shouldRedirect = shouldRedirectToLogin();
        const result = {
            authenticated: !shouldRedirect,
            shouldRedirect,
            environment: 'production',
            hasMMClientVars: localStorage.getItem("MMClientVars")
        };
        return result;
    }
};

// Get user information from session
export const getUserInfo = () => {
    try {
        const MMClientVars = JSON.parse(localStorage.getItem("MMClientVars") || "{}");

        // In development mode, merge with devHelper values for missing properties
        const sessionData = isDevelopmentMode() ? { ...sessionValues, ...MMClientVars } : MMClientVars;

        return {
            userId: sessionData.UserID || null,
            email: sessionData.Email || null,
            domain: sessionData.Domain || null,
            clientId: sessionData.ClientID || null,
            isApiUser: sessionData.IsAPIUser === "True" || false,
            userName: sessionData.UserName || null,
            fullName: sessionData.FullName || null,
            isAdmin: sessionData.IsAdmin || false,
            isSA: sessionData.IsSA === "true" || false,
            companyName: sessionData.CompanyName || null,
            token: sessionData.Token || null
        };
    } catch (error) {
        console.error("Error getting user info:", error);
        if (isDevelopmentMode()) {
            return {
                userId: sessionValues.UserID || null,
                email: sessionValues.Email || null,
                domain: sessionValues.Domain || null,
                clientId: sessionValues.ClientID || null,
                isApiUser: sessionValues.IsAPIUser === "True" || false,
                userName: sessionValues.UserName || null,
                fullName: sessionValues.FullName || null,
                isAdmin: sessionValues.IsAdmin || false,
                isSA: sessionValues.IsSA === "true" || false,
                companyName: sessionValues.CompanyName || null,
                token: sessionValues.Token || null
            };
        }
        return {
            userId: null,
            email: null,
            domain: null,
            clientId: null,
            isApiUser: false,
            userName: null,
            fullName: null,
            isAdmin: false,
            isSA: false,
            companyName: null,
            token: null
        };
    }
}; 
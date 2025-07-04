// Session management functions - matches mirabel.mm.ui/src/utilities/commonHelpers.js

import { isDevelopmentMode, sessionValues } from './developmentHelper';

// Get session value from MMClientVars
export const getSessionValue = function (key) {
    try {
        const MMClientVars = JSON.parse(localStorage.getItem("MMClientVars") || "{}");

        // In development mode, if the value is not found, use direct fallback
        if (isDevelopmentMode() && (!MMClientVars[key] || MMClientVars[key] === "")) {
            console.log(`🔍 Development: Using fallback value for ${key}`);

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
        console.error("Error getting session value:", error);
        if (isDevelopmentMode()) {
            console.log(`🔍 Development: Using fallback value after error for ${key}`);
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
            console.log('🔍 Development: Using merged session values');
            return mergedSession;
        }

        return storedSession;
    } catch (error) {
        console.error("Error getting session details:", error);
        if (isDevelopmentMode()) {
            console.log('🔍 Development: Using fallback session values after error');
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
        console.log("Session reset successfully");
    } catch (error) {
        console.error("Error resetting session:", error);
    }
};

// Check if session is active
export const isActiveSession = () => {
    try {
        const MMClientVars = JSON.parse(localStorage.getItem("MMClientVars") || "{}");
        const isAuthenticated = MMClientVars.IsAuthenticated === true;
        const isSame = isSameSession();

        // Debug logging
        console.log('🔍 Session Check:', {
            IsAuthenticated: isAuthenticated,
            IsSameSession: isSame,
            MMClientVarsExists: !!localStorage.getItem("MMClientVars"),
            SessionClientID: sessionStorage.getItem("ClientID"),
            LocalStorageClientID: MMClientVars.ClientID
        });

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

// Debug function to log session state
export const logSessionState = () => {
    try {
        const MMClientVars = JSON.parse(localStorage.getItem("MMClientVars") || "{}");
        console.log('📊 Session State:', {
            MMClientVars: MMClientVars,
            SessionClientID: sessionStorage.getItem("ClientID"),
            IsAuthenticated: MMClientVars.IsAuthenticated,
            Token: MMClientVars.Token ? `${MMClientVars.Token.substring(0, 10)}...` : 'None',
            ClientID: MMClientVars.ClientID,
            UserID: MMClientVars.UserID,
            Domain: MMClientVars.Domain
        });
    } catch (error) {
        console.error("Error logging session state:", error);
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
            console.log('🔐 Production: No MMClientVars found, redirecting to login');
            return true;
        }

        const sessionData = JSON.parse(MMClientVars);

        // If not authenticated or missing essential fields, redirect to login
        if (!sessionData.IsAuthenticated || !sessionData.Email || !sessionData.Token) {
            console.log('🔐 Production: Session not authenticated or missing essential fields, redirecting to login');
            return true;
        }

        // Check if session is active (cross-tab validation)
        if (!isSameSession()) {
            console.log('🔐 Production: Session validation failed (cross-tab), redirecting to login');
            return true;
        }

        return false;
    } catch (error) {
        console.error('Error checking authentication status:', error);
        console.log('🔐 Production: Error checking session, redirecting to login');
        return true;
    }
};

// Perform login redirect (production only)
export const performLoginRedirect = (returnUrl = null) => {
    // Never redirect in development mode
    if (isDevelopmentMode()) {
        console.log('🔧 Development: Login redirect skipped');
        return;
    }

    const currentUrl = returnUrl || window.location.href;
    const baseUrl = import.meta.env.REACT_APP_API_BASE_URL || window.location.origin;
    const loginUrl = `${baseUrl}/intranet/Login.aspx?ReturnUrl=${encodeURIComponent(currentUrl)}`;

    console.log('🔐 Production: Redirecting to login:', loginUrl);
    window.location.href = loginUrl;
};

// Enhanced authentication check that handles both development and production
export const checkAuthenticationStatus = () => {
    if (isDevelopmentMode()) {
        // In development, always ensure session is available
        console.log('🔧 Development: Ensuring session is available');
        const existingSession = localStorage.getItem("MMClientVars");
        if (!existingSession) {
            console.log('🔧 Development: Setting up development session');
            setClientSession(sessionValues);
            sessionStorage.setItem("ClientID", sessionValues.ClientID);
        }
        return { authenticated: true, shouldRedirect: false };
    } else {
        // In production, check for valid authentication
        const shouldRedirect = shouldRedirectToLogin();
        return { authenticated: !shouldRedirect, shouldRedirect };
    }
};

// Debug function to test authentication behavior in different environments
export const debugAuthenticationBehavior = () => {
    console.log('🧪 TESTING AUTHENTICATION BEHAVIOR');
    console.log('=====================================');

    // Step 1: Environment Detection
    const envResult = isDevelopmentMode();
    console.log('🌍 Environment Detection:');
    console.log('- isDevelopmentMode():', envResult);
    console.log('- Should use dev helpers:', envResult ? 'YES' : 'NO');
    console.log('- Should redirect to login:', envResult ? 'NO' : 'YES');

    // Step 2: Current Session Status
    console.log('\n📊 Current Session Status:');
    const hasMMClientVars = !!localStorage.getItem('MMClientVars');
    console.log('- MMClientVars exists:', hasMMClientVars);

    if (hasMMClientVars) {
        try {
            const sessionData = JSON.parse(localStorage.getItem('MMClientVars'));
            console.log('- IsAuthenticated:', sessionData.IsAuthenticated);
            console.log('- Has Email:', !!sessionData.Email);
            console.log('- Has Token:', !!sessionData.Token);
        } catch (e) {
            console.log('- Session data corrupted:', e.message);
        }
    }

    // Step 3: Test Authentication Check
    console.log('\n🔍 Authentication Check Test:');
    const authStatus = checkAuthenticationStatus();
    console.log('- checkAuthenticationStatus():', authStatus);

    // Step 4: Test Redirect Check
    console.log('\n🔄 Redirect Check Test:');
    const shouldRedirect = shouldRedirectToLogin();
    console.log('- shouldRedirectToLogin():', shouldRedirect);

    // Step 5: Simulate Missing Session (SAFE TEST)
    console.log('\n🚫 Testing Missing Session (simulated):');
    const originalSession = localStorage.getItem('MMClientVars');
    localStorage.removeItem('MMClientVars');

    const authStatusNoSession = checkAuthenticationStatus();
    const shouldRedirectNoSession = shouldRedirectToLogin();

    console.log('- Without session - checkAuthenticationStatus():', authStatusNoSession);
    console.log('- Without session - shouldRedirectToLogin():', shouldRedirectNoSession);

    // Restore session
    if (originalSession) {
        localStorage.setItem('MMClientVars', originalSession);
    }

    // Step 6: Summary and Recommendations
    console.log('\n📋 SUMMARY:');
    console.log('- Environment:', envResult ? '🔧 DEVELOPMENT' : '🏭 PRODUCTION/STAGING');
    console.log('- Current behavior correct:',
        envResult ?
            (authStatus.authenticated ? '✅ PASS' : '❌ FAIL') :
            (!shouldRedirect ? '✅ PASS' : '⚠️ Would redirect to login (correct)')
    );

    if (!envResult && hasMMClientVars && !shouldRedirect) {
        console.log('✅ PRODUCTION/STAGING: Authentication working correctly');
    } else if (!envResult && (!hasMMClientVars || shouldRedirect)) {
        console.log('🔄 PRODUCTION/STAGING: Would redirect to login (correct behavior)');
    } else if (envResult && authStatus.authenticated) {
        console.log('✅ DEVELOPMENT: Development session working correctly');
    } else {
        console.log('❌ UNEXPECTED BEHAVIOR - Check configuration');
    }

    return {
        environment: envResult ? 'development' : 'production',
        hasSession: hasMMClientVars,
        isAuthenticated: authStatus.authenticated,
        shouldRedirect: shouldRedirect,
        behaviorCorrect: envResult ? authStatus.authenticated : (shouldRedirect || !hasMMClientVars)
    };
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
            console.log('🔍 Development: Using fallback user info after error');
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
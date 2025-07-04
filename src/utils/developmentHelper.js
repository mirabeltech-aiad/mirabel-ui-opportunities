// Development helper utilities - matches mirabel.mm.ui pattern

// Development URL based on environment files (env-dev, env-stage, env-prod)
export const devURL = import.meta.env.REACT_APP_API_BASE_URL || 'https://mirabeldev.magazinemanager.com';

// Promise management for iframe communication
export const promises = {};

// Generate unique request ID
export const getValue = () => {
    return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
};

// Environment-aware session values for development
const getEnvironmentInfo = () => {
    const apiBaseUrl = import.meta.env.REACT_APP_API_BASE_URL || 'https://mirabeldev.magazinemanager.com';
    const urlObj = new URL(apiBaseUrl);
    const hostname = urlObj.hostname;
    const subdomain = hostname.split('.')[0];

    return {
        apiBaseUrl,
        hostname,
        subdomain,
        environment: import.meta.env.REACT_APP_ENVIRONMENT || 'development'
    };
};

// Hardcoded session values for development - now environment-aware
export const sessionValues = (() => {
    const envInfo = getEnvironmentInfo();

    return {
        "UserID": 23,
        "Email": "techsupport@magazinemanager.com",
        "IsAdmin": false,
        "IsAuthenticated": true, // Critical for authentication check
        "Token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJMb2dnZWRJblVzZXJJRCI6IjQ5IiwiTG9nZ2VkSW5TaXRlQ2xpZW50SUQiOiI1IiwiTG9nZ2VkSW5TaXRlQ3VsdHVyZVVJIjoiZW4tVVMiLCJEYXRlVGltZSI6IjcvMS8yMDI1IDg6Mzc6MjkgQU0iLCJMb2dnZWRJblNpdGVDdXJyZW5jeVN5bWJvbCI6IiQiLCJMb2dnZWRJblNpdGVEYXRlRm9ybWF0IjoiIiwiRG9tYWluIjoidGVjaCIsIkxvZ2dlZEluU2l0ZVRpbWVBZGQiOlsiMCIsIjAiXSwiU291cmNlIjoiVE1NIiwiRW1haWwiOiJ0ZWNoc3VwcG9ydEBtYWdhemluZW1hbmFnZXIuY29tIiwiSXNBUElVc2VyIjoiRmFsc2UiLCJuYmYiOjE3NTEzNTkwNDksImV4cCI6MTk3MjExMTA0OSwiaWF0IjoxNzUxMzU5MDQ5LCJpc3MiOiJNYWdhemluZU1hbmFnZXIiLCJhdWQiOiIqIn0.kHbiLOxU7W_6h5aIOMXCCWlpQ8znkIU3mnnU3hutG0Y",
        "IsSA": "false",
        "UserName": "Support Tech",
        "DisplayName": "Support,Tech",
        "UserNameID": "tsupport",
        "ClientID": "5",
        "Host": import.meta.env.REACT_APP_API_BASE_URL || envInfo.apiBaseUrl, // Use env var if available
        "Domain": envInfo.subdomain, // Now environment-aware
        "ContentVersion": "5.22.3",
        "AccessTokenTimeOut": "7/1/2032 4:54:03 PM",
        "IsMKMEnabled": "True",
        "CompanyName": `Mirabel Technologies, Inc. (${envInfo.environment.toUpperCase()})`, // Show environment
        "ProductType": "10178",
        "TimeAdd": "0",
        "PageList": "Invoices,Dashboards",
        "HelpSite": "https://help.mirabeltechnologies.com",
        "FullName": `Tech Support (${envInfo.environment})`, // Show environment
        "DepartmentID": "2",
        "PASubProductTypeId": "0",
        "PASubProductTypeName": "",
        "BSASubProductTypeId": "0",
        "BSASubProductTypeName": "",
        "CustomerPortalUrl": "http://portal.mirabeltechnologies.de",
        "CanSendCRMEmail": "true"
    };
})();

// Message handler for iframe communication
export const handleMessage = (event) => {
    try {
        // Only handle messages from the expected origin
        const expectedOrigin = new URL(devURL).origin;
        if (event.origin !== expectedOrigin) {
            return;
        }

        const data = event.data;

        // Handle iframe API responses (like mirabel.mm.ui pattern)
        if (data && data.requestId && promises[data.requestId]) {
            promises[data.requestId](data);
            delete promises[data.requestId];
            return;
        }

        if (data && data.type === 'MM_API_RESPONSE') {

            // Handle different types of responses
            if (data.method === 'login' || data.method === 'auth') {
                // Update session with real authentication data
                if (data.result && data.result.MMClientVars) {
                    localStorage.setItem("MMClientVars", JSON.stringify(data.result.MMClientVars));
                }
            }
        }
    } catch (error) {
        console.error('Development Helper: Error handling message', error);
    }
};

// Check if we're in development mode - STRICT CHECK for security
export const isDevelopmentMode = () => {
    // STRICT checks - must be explicitly development AND localhost
    const isLocalhost = window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1' ||
        window.location.hostname.startsWith('192.168.') ||
        window.location.hostname.endsWith('.local');

    const isExplicitDev = import.meta.env.REACT_APP_ENVIRONMENT === 'development';
    const isNodeDev = import.meta.env.NODE_ENV === 'development';

    // MUST be localhost AND have development indicators
    // When in doubt, treat as production for security
    const isDev = isLocalhost && (isExplicitDev || isNodeDev);

    // Debug logging
    console.log('🔍 Environment Check (STRICT):', {
        'NODE_ENV': import.meta.env.NODE_ENV,
        'REACT_APP_ENVIRONMENT': import.meta.env.REACT_APP_ENVIRONMENT,
        'hostname': window.location.hostname,
        'isLocalhost': isLocalhost,
        'isExplicitDev': isExplicitDev,
        'isNodeDev': isNodeDev,
        'isDevelopmentMode': isDev,
        'treatAsProduction': !isDev
    });

    return isDev;
};

// Initialize development environment
export const initializeDevelopmentEnvironment = () => {
    if (isDevelopmentMode()) {
        console.log(`🚧 Development Mode: ${getEnvironmentInfo().environment.toUpperCase()}`);
        console.log(`🌐 API Base URL: ${getEnvironmentInfo().apiBaseUrl}`);

        // Log initial session status
        logSessionStatus();

        // Set hardcoded session values if needed
        const existingSession = localStorage.getItem("MMClientVars");
        let shouldSetSession = false;

        if (!existingSession) {
            shouldSetSession = true;
            console.log('ℹ️  Development Helper: No existing session found');
        } else {
            try {
                const parsed = JSON.parse(existingSession);
                const existingToken = parsed.Token;

                const isValidToken = existingToken &&
                    existingToken.length > 20 &&
                    existingToken.includes('.') &&
                    !existingToken.includes('dev_token') &&
                    !existingToken.includes('placeholder');

                if (!isValidToken) {
                    shouldSetSession = true;
                    console.log('⚠️  Development Helper: Existing token is invalid/placeholder, replacing...');
                    console.log('🔑 Invalid Token:', existingToken);
                } else {
                    console.log('ℹ️  Development Helper: Using existing valid session');
                    console.log('🔑 Existing Token Available:', !!existingToken);
                }
            } catch (e) {
                shouldSetSession = true;
                console.error('❌ Error parsing existing session, resetting:', e);
            }
        }

        if (shouldSetSession) {
            // Force initialize session immediately
            localStorage.setItem("MMClientVars", JSON.stringify(sessionValues));
            sessionStorage.setItem("ClientID", sessionValues.ClientID);
            console.log('✅ Force initialized session with development values');
        }

        // Always ensure IsAuthenticated is true for development
        const currentSession = JSON.parse(localStorage.getItem("MMClientVars") || "{}");
        if (!currentSession.IsAuthenticated || !currentSession.Email) {
            // Merge with sessionValues to ensure all required fields are present
            const updatedSession = { ...sessionValues, ...currentSession };
            updatedSession.IsAuthenticated = true;
            localStorage.setItem("MMClientVars", JSON.stringify(updatedSession));
            console.log('✅ Updated session for development with all required fields');
        }

        // Initialize sessionStorage for cross-tab validation
        if (currentSession.ClientID && !sessionStorage.getItem("ClientID")) {
            sessionStorage.setItem("ClientID", currentSession.ClientID);
            console.log('✅ Set ClientID in sessionStorage for cross-tab validation');
        }

        // Make development utilities available globally
        if (typeof window !== 'undefined') {
            window.devHelper = {
                checkSession: logSessionStatus,
                initSession: forceInitializeSession,
                clearSession: clearSessionData,
                reload: () => window.location.reload(),
                switchEnv: switchDevelopmentEnvironment
            };

            console.log('🛠️ Development utilities available in console:');
            console.log('- devHelper.checkSession() - Check current session');
            console.log('- devHelper.initSession() - Force initialize session');
            console.log('- devHelper.clearSession() - Clear session data');
            console.log('- devHelper.reload() - Reload page');
            console.log('- devHelper.switchEnv(envName) - Switch environment');
        }
    }
};

// Enhanced session status logging
export const logSessionStatus = () => {
    if (!isDevelopmentMode()) return null;

    console.log('🔍 Session Status:');
    console.log('- Environment:', import.meta.env.NODE_ENV);
    console.log('- Location:', window.location.hostname);
    console.log('- isDevelopment:', isDevelopmentMode());
    console.log('- localStorage MMClientVars:', localStorage.getItem("MMClientVars"));
    console.log('- sessionStorage ClientID:', sessionStorage.getItem("ClientID"));

    // Get session values directly from localStorage to avoid dependency issues
    const sessionData = JSON.parse(localStorage.getItem("MMClientVars") || "{}");
    console.log('- Email:', sessionData.Email || 'Not found');
    console.log('- UserID:', sessionData.UserID || 'Not found');
    console.log('- Token:', sessionData.Token ? `${sessionData.Token.substring(0, 20)}...` : 'Not found');

    return {
        hasMMClientVars: !!localStorage.getItem("MMClientVars"),
        hasClientID: !!sessionStorage.getItem("ClientID"),
        hasEmail: !!sessionData.Email,
        hasUserID: !!sessionData.UserID,
        hasToken: !!sessionData.Token
    };
};

// Force initialize development session
export const forceInitializeSession = () => {
    if (!isDevelopmentMode()) return;

    console.log('🔧 Force initializing development session...');
    localStorage.setItem("MMClientVars", JSON.stringify(sessionValues));
    sessionStorage.setItem("ClientID", sessionValues.ClientID);
    console.log('✅ Session initialized with development values');
    return logSessionStatus();
};

// Clear all session data
export const clearSessionData = () => {
    if (!isDevelopmentMode()) return;

    console.log('🧹 Clearing all session data...');
    localStorage.removeItem("MMClientVars");
    localStorage.removeItem("TokenData");
    sessionStorage.clear();
    console.log('✅ Session cleared');
    return logSessionStatus();
};

// Create helper iframe for API communication
export const createHelperIframe = () => {
    if (isDevelopmentMode()) {
        const body = document.querySelector("body");
        const iframe = document.createElement("iframe");

        iframe.src = `${devURL}/intranet/Mirabel.MM.Web/Members/Home/ReactLocalHelper.aspx`;
        iframe.style.display = "none";
        iframe.id = "mmdeviframe";
        iframe.onload = () => {
            console.log('🔗 Development Helper: Helper iframe loaded');
        };

        body.appendChild(iframe);

        // Add message listener
        window.addEventListener("message", handleMessage);

        return () => {
            if (body.contains(iframe)) {
                body.removeChild(iframe);
            }
            window.removeEventListener("message", handleMessage);
        };
    }
    return null;
};

// Utility to check if window.top is accessible
export const isWindowTopAccessible = () => {
    try {
        return window.top && window.top.location && window.top.location.hostname;
    } catch {
        return false;
    }
};

// Load message localizer
export const loadMessageLocalizer = (callback, urlPrefix = "") => {
    // Re-use the Client Message from Home Page when available
    if (!isWindowTopAccessible() || !Object.prototype.hasOwnProperty.call(window.top, "MMClientMessage")) {
        const script = document.createElement("script");
        const sessionValue = JSON.parse(localStorage.getItem("MMClientVars") || "{}");
        const contentVersion = sessionValue.ContentVersion || "1.0.0";

        script.src = `${urlPrefix}/intranet/localizer.js.axd?v=${contentVersion}`;
        script.addEventListener("load", () => {
            callback && callback();
        });
        script.addEventListener("error", () => {
            callback && callback(); // Continue even if localizer fails
        });

        document.querySelector("body").appendChild(script);
    } else {
        callback && callback();
    }
};

// Development environment switcher
export const switchDevelopmentEnvironment = (envName) => {
    if (isDevelopmentMode()) {
        localStorage.removeItem("MMClientVars");
        localStorage.setItem("MM_ENVIRONMENT", envName);
        window.location.reload();
    }
};

// Log development information
export const logDevelopmentInfo = () => {
    if (isDevelopmentMode()) {
        const envInfo = getEnvironmentInfo();
        console.log('🚧 Development Environment Information:');
        console.log('- Environment:', envInfo.environment.toUpperCase());
        console.log('- API Base URL:', envInfo.apiBaseUrl);
        console.log('- Domain:', envInfo.hostname);
        console.log('- Subdomain:', envInfo.subdomain);
        console.log('- Session Values:', JSON.parse(localStorage.getItem("MMClientVars") || "{}"));
    }
}; 
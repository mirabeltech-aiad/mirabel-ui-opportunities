// Development helper utilities - matches mirabel.mm.ui pattern

// Development API Configuration - Core credentials for API calls
export const devApiConfig = {
    "baseUrl": "https://smoke-feature21.magazinemanager.com",
    "domain": "smoke-feature21",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJMb2dnZWRJblVzZXJJRCI6IjIzIiwiTG9nZ2VkSW5TaXRlQ2xpZW50SUQiOiIxMDAxNSIsIkxvZ2dlZEluU2l0ZUN1bHR1cmVVSSI6ImVuLVVTIiwiRGF0ZVRpbWUiOiI5LzgvMjAyNSA3OjQ2OjM3IEFNIiwiTG9nZ2VkSW5TaXRlQ3VycmVuY3lTeW1ib2wiOiIiLCJMb2dnZWRJblNpdGVEYXRlRm9ybWF0IjoiIiwiRG9tYWluIjoic21va2UtZmVhdHVyZTIxIiwiTG9nZ2VkSW5TaXRlVGltZUFkZCI6WyIwIiwiMCJdLCJTb3VyY2UiOiJUTU0iLCJFbWFpbCI6InNhQG1hZ2F6aW5lbWFuYWdlci5jb20iLCJJc0FQSVVzZXIiOiJGYWxzZSIsIkV4dGVybmFsQXV0aCI6IiIsIm5iZiI6MTc1NzMxNzU5NywiZXhwIjoxNzYwMzE3NTk3LCJpYXQiOjE3NTczMTc1OTcsImlzcyI6Ik1hZ2F6aW5lTWFuYWdlciIsImF1ZCI6IioifQ.cKagdODFU6uT0_5_G6j-EbMS8215bur2YkqWsxcilKo"
};
// export const devApiConfig = {
//     "baseUrl":  "http://localhost",
//     "domain": "localhost",
//     "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJMb2dnZWRJblVzZXJJRCI6IjEiLCJMb2dnZWRJblNpdGVDbGllbnRJRCI6Ijk5MjAiLCJMb2dnZWRJblNpdGVDdWx0dXJlVUkiOiJlbi11cyIsIkRhdGVUaW1lIjoiMzEtMDctMjAyNSAxMTo0OTowNSIsIkxvZ2dlZEluU2l0ZUN1cnJlbmN5U3ltYm9sIjoiIiwiTG9nZ2VkSW5TaXRlRGF0ZUZvcm1hdCI6IiIsIkRvbWFpbiI6ImxvY2FsaG9zdCIsIkxvZ2dlZEluU2l0ZVRpbWVBZGQiOlsiMCIsIjAiXSwiU291cmNlIjoiVE1NIiwiRW1haWwiOiJzYUBtYWdhemluZW1hbmFnZXIuY29tIiwiSXNBUElVc2VyIjoiRmFsc2UiLCJuYmYiOjE3NTM5NjI1NDUsImV4cCI6MTc1Njk2MjU0NSwiaWF0IjoxNzUzOTYyNTQ1LCJpc3MiOiJNYWdhemluZU1hbmFnZXIiLCJhdWQiOiIqIn0.oYMUH3ttGycmsJxUPZkc57kx-DEKbxuaZl4C_ipTPV8"
// };

// Development URL (legacy compatibility)
export const devURL = devApiConfig.Host;

// Promise management for iframe communication
export const promises = {};

// Generate unique request ID
export const getValue = () => {
    return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
};
// Development session values - references devApiConfig
export const sessionValues = {
    // Core API credentials - referenced from devApiConfig
    "UserID": 1,
    "Email": "sa@magazinemanager.com",
    "Token": devApiConfig.token,
    "Domain": devApiConfig.domain,
    "Host": devApiConfig.baseUrl,

    // Authentication & Session
    "AccessTokenTimeOut": "2025-09-04T01:47:49.87",
    "IsAuthenticated": false,
    "ChangePassword": false,

    // Client & Company Information
    "ClientID": 9920,
    "CompanyName": "Mirabel Development | Test site",
    "CultureUI": "en-us",
    "SiteType": "",
    "TimeAdd": 0,

    // Package & Product Configuration
    "PackageTypeID": 3,
    "ProductType": "10182",
    "PASubProductTypeId": 0,
    "PASubProductTypeName": "",
    "BSASubProductTypeId": 21,
    "BSASubProductTypeName": "Broadstreet",

    // Feature Flags & Permissions
    "IsMKMEnabled": true,
    "IsUserHasMKMAccess": true,
    "IsSiteDataPackEnabled": false,
    "IsUserHasDataPackAccess": false,
    "IsMirabelEmailServiceEnabled": false,
    "IsRepNotificationEnabled": false,
    "CanSendCRMEmail": true,

    // User Profile Information
    "UserName": "sa@magazinemanager.com",
    "EmployeeID": 1,
    "FirstName": "System",
    "LastName": "Administrator",
    "FullName": "System Administrator",
    "DisplayName": "System Administrator",
    "IsAdmin": true,
    "IsSA": true,
    "UserNameID": 1,
    "SalesRepName": "System Administrator",
    "DepartmentID": "1",

    // Content & Version
    "ContentVersion": null
};


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

// Check if we're in development mode - Vite specific
export const isDevelopmentMode = () => {
    // Vite provides import.meta.env.DEV for development detection
    const isViteDev = import.meta.env.DEV;
    const isDevMode = import.meta.env.MODE === 'development';
    // For Vite: Use DEV flag or development mode
    const isDev = (isViteDev || isDevMode);

    return isDev;
};

// Initialize development environment
export const initializeDevelopmentEnvironment = () => {
    if (isDevelopmentMode()) {
        // Set session data in localStorage
        localStorage.setItem("MMClientVars", JSON.stringify(sessionValues));
        sessionStorage.setItem("ClientID", sessionValues.ClientID);

        console.log('✅ Development session initialized');
    }
};


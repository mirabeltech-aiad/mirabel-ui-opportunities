// Development helper utilities - matches mirabel.mm.ui pattern

// Development API Configuration - Core credentials for API calls
export const devApiConfig = {
    "baseUrl":  "https://smoke-feature13.magazinemanager.com",
    "domain": "dev",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJMb2dnZWRJblVzZXJJRCI6IjEiLCJMb2dnZWRJblNpdGVDbGllbnRJRCI6IjEwMDA3IiwiTG9nZ2VkSW5TaXRlQ3VsdHVyZVVJIjoiZW4tVVMiLCJEYXRlVGltZSI6IjcvMzEvMjAyNSA3OjQ3OjQwIEFNIiwiTG9nZ2VkSW5TaXRlQ3VycmVuY3lTeW1ib2wiOiIiLCJMb2dnZWRJblNpdGVEYXRlRm9ybWF0IjoiIiwiRG9tYWluIjoic21va2UtZmVhdHVyZTEzIiwiTG9nZ2VkSW5TaXRlVGltZUFkZCI6WyIwIiwiMCJdLCJTb3VyY2UiOiJUTU0iLCJFbWFpbCI6InNhQG1hZ2F6aW5lbWFuYWdlci5jb20iLCJJc0FQSVVzZXIiOiJGYWxzZSIsIm5iZiI6MTc1Mzk0ODA2MCwiZXhwIjoxNzU2OTQ4MDYwLCJpYXQiOjE3NTM5NDgwNjAsImlzcyI6Ik1hZ2F6aW5lTWFuYWdlciIsImF1ZCI6IioifQ.bdt9ZIS2QIw4lZQh8Ju6ObwekJvPTiAlnLClAPxUWDQ"
};

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
    "UserID": 23,
    "Email": "techsupport@magazinemanager.com",
    "Token": devApiConfig.token,
    "Domain": devApiConfig.domain,
    "Host": devApiConfig.baseUrl,
    
    // Authentication flags
    "IsAuthenticated": true,
    "IsAdmin": false,
    "IsSA": "false",
    "IsChangePassword": "false",
    
    // User details
    "UserName": "Support Tech",
    "DisplayName": "Support,Tech", 
    "UserNameID": "tsupport",
    "FullName": "Tech Support (Development)",
    
    // Client configuration
    "ClientID": "5",
    "CompanyName": "Mirabel Technologies, Inc. (DEV)",
    "ContentVersion": "5.22.3",
    "ProductType": "10178",
    
    // Session settings
    "AccessTokenTimeOut": "1/30/2026 9:00:00 AM",
    "TimeAdd": "0",
    "DepartmentID": "2",
    
    // Feature flags
    "IsMKMEnabled": "True",
    "CanSendCRMEmail": "true",
    
    // URLs and external resources
    "PageList": "Invoices,Dashboards,Home",
    "HelpSite": "https://help.mirabeltechnologies.com",
    "CustomerPortalUrl": "http://portal.mirabeltechnologies.de",
    
    // Unused legacy fields
    "PASubProductTypeId": "0",
    "PASubProductTypeName": "",
    "BSASubProductTypeId": "0", 
    "BSASubProductTypeName": ""
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

 
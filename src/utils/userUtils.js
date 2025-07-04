import { getUserInfo } from './sessionHelpers';

// Dynamic user ID getter - always gets fresh value from JWT token
export const getCurrentUserId = () => {
    const userInfo = getUserInfo();
    return userInfo?.userId || 23; // Fallback to 23 for backward compatibility
};

// Dynamic user info getter
export const getCurrentUserInfo = () => {
    return getUserInfo();
};

// Get user email
export const getCurrentUserEmail = () => {
    const userInfo = getUserInfo();
    return userInfo?.email || null;
};

// Get user domain
export const getCurrentUserDomain = () => {
    const userInfo = getUserInfo();
    return userInfo?.domain || null;
};

// Get user client ID
export const getCurrentClientId = () => {
    const userInfo = getUserInfo();
    return userInfo?.clientId || null;
};

// Check if user is API user
export const isApiUser = () => {
    const userInfo = getUserInfo();
    return userInfo?.isApiUser || false;
};

// Backward compatibility exports
export const userId = getCurrentUserId();
export const getUserId = getCurrentUserId; 
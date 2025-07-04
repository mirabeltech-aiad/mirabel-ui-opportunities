import CryptoJS from "crypto-js";
import { isDevelopmentMode } from './developmentHelper';

// Authentication encryption key
export const authEncryptDecryptKey = "20SA16ED";

// Get the base path for the application
export const getBasePath = () => {
    // In development, use /ui60/ to match server configuration
    // In production, this should match your deployment configuration
    return '/ui60/';
};



// NOTE: Session management functions moved to sessionHelpers.js

// Encryption/Decryption utilities
export const encryptByDES = (message, key) => {
    try {
        const encrypted = CryptoJS.DES.encrypt(message, key).toString();
        return encrypted;
    } catch (error) {
        console.error("Encryption error:", error);
        return null;
    }
};

export const decrypt = (message, key) => {
    try {
        const bytes = CryptoJS.AES.decrypt(message, key);
        return bytes.toString(CryptoJS.enc.Utf8);
    } catch (error) {
        console.error("Decryption error:", error);
        return null;
    }
};

// Simplified token validation
export const isTokenValid = (token) => {
    if (!token) return false;

    try {
        // Basic JWT token validation
        const tokenParts = token.split('.');
        if (tokenParts.length !== 3) {
            // If not JWT format, check if it's a simple token (non-empty string)
            return token.length > 0;
        }

        const payload = JSON.parse(atob(tokenParts[1]));
        const currentTime = Math.floor(Date.now() / 1000);

        // Check if token is expired
        if (payload.exp && payload.exp < currentTime) {
            return false;
        }

        return true;
    } catch (error) {
        // If JWT parsing fails, treat as simple token
        return token && token.length > 0;
    }
};

// NOTE: Cross-tab session validation and session management functions moved to sessionHelpers.js



// Authentication error messages
export const AUTH_ERRORS = {
    TOKEN_EXPIRED: "Authentication token expired. Please login again.",
    INVALID_TOKEN: "Invalid authentication token.",
    REFRESH_FAILED: "Failed to refresh authentication token.",
    NETWORK_ERROR: "Network error during authentication."
};

// Security utilities
export const sanitizeInput = (input) => {
    if (typeof input !== 'string') return input;
    return input.replace(/[<>&"']/g, (char) => {
        const entityMap = {
            '<': '&lt;',
            '>': '&gt;',
            '&': '&amp;',
            '"': '&quot;',
            "'": '&#39;'
        };
        return entityMap[char];
    });
};

// Modified getMainLoginUrl to handle development mode
export const getMainLoginUrl = (returnUrl) => {
    // In development mode, don't redirect to login
    if (isDevelopmentMode()) {
        console.log('🔧 Development mode: Skipping login redirect');
        return returnUrl;
    }
    
    // Production behavior remains the same
    const mmDomain = import.meta.env.REACT_APP_API_BASE_URL || 'https://tech.magazinemanager.biz';
    const encodedReturnUrl = encodeURIComponent(returnUrl);
    return `${mmDomain}/intranet/Login.aspx?ReturnUrl=${encodedReturnUrl}`;
};

// Modified logout utility to handle development mode
export const logout = () => {
    // In development mode, just reset session without redirect
    if (isDevelopmentMode()) {
        import('./sessionHelpers.js').then(({ resetSession }) => {
            resetSession();
            console.log('🔧 Development mode: Session reset without redirect');
            window.location.reload(); // Optional: reload to reset app state
        });
        return;
    }

    // Production behavior remains the same
    import('./sessionHelpers.js').then(({ resetSession }) => {
        resetSession();
        const returnUrl = window.location.href;
        const mainLoginUrl = getMainLoginUrl(returnUrl);
        window.location.href = mainLoginUrl;
    });
};                                                                                                                                                                                                                             
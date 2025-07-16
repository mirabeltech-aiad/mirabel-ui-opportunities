import CryptoJS from "crypto-js";
import { isDevelopmentMode } from './developmentHelper';

export const authEncryptDecryptKey = "20SA16ED";

export const getBasePath = () => {
    return '/ui60/';
};

export const encryptByDES = (message, key) => {
    try {
        const encrypted = CryptoJS.DES.encrypt(message, key).toString();
        return encrypted;
    } catch (error) {
        return null;
    }
};

export const decrypt = (message, key) => {
    try {
        const bytes = CryptoJS.AES.decrypt(message, key);
        return bytes.toString(CryptoJS.enc.Utf8);
    } catch (error) {
        return null;
    }
};

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
    if (isDevelopmentMode()) {
        return returnUrl;
    }

    // Use the current domain from environment or fallback to current origin
    const mmDomain = import.meta.env.REACT_APP_API_BASE_URL || window.location.origin;
    const encodedReturnUrl = encodeURIComponent(returnUrl);
    // Match legacy ASP.NET path: /intranet/Members/Home/Login.aspx
    return `${mmDomain}/intranet/Members/Home/Login.aspx?ReturnUrl=${encodedReturnUrl}`;
};

// Modified logout utility to handle development mode
export const logout = () => {
    // In development mode, just reset session without redirect
    if (isDevelopmentMode()) {
        import('./sessionHelpers.js').then(({ resetSession }) => {
            resetSession();
            window.location.reload();
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
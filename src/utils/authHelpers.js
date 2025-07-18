import CryptoJS from "crypto-js";
import { isDevelopmentMode } from './developmentHelper';

export const authEncryptDecryptKey = "20SA16ED";
export const crmEncryptDecryptKey = "$%x@#~$a";
export const enkey = "C6mL09K3Y";

export const getBasePath = () => {
    return '/ui60/';
};

export const encryptByDES = (message, key) => {
    try {
        let keyHex = CryptoJS.enc.Utf8.parse(key);
        let ivHex = CryptoJS.enc.Utf8.parse(key);
        keyHex = CryptoJS.SHA1(keyHex);
        ivHex = CryptoJS.SHA1(ivHex);
        // CryptoJS use CBC as the default mode, and Pkcs7 as the default padding scheme
        var encrypted = CryptoJS.DES.encrypt(message, keyHex, {
            mode: CryptoJS.mode.CBC,
            iv: ivHex,
            padding: CryptoJS.pad.Pkcs7,
        });
        return encrypted.toString();
    } catch {
        return "";
    }
};

export const encrypt = (message, key) => {
    try {
        let keyHex = CryptoJS.enc.Utf8.parse(key);
        let ivHex = CryptoJS.enc.Utf8.parse(key);
        keyHex = CryptoJS.SHA1(keyHex);
        ivHex = CryptoJS.SHA1(ivHex);
        var encrypted = CryptoJS.DES.encrypt(message, keyHex, {
            mode: CryptoJS.mode.CBC,
            iv: ivHex,
            padding: CryptoJS.pad.Pkcs7,
        });
        return encrypted.toString();
    } catch {
        return "";
    }
};

export const decrypt = (message, key) => {
    try {
        let keyHex = CryptoJS.enc.Utf8.parse(key);
        let ivHex = CryptoJS.enc.Utf8.parse(key);
        keyHex = CryptoJS.SHA1(keyHex);
        ivHex = CryptoJS.SHA1(ivHex);
        var decrypted = CryptoJS.DES.decrypt(message, keyHex, {
            mode: CryptoJS.mode.CBC,
            iv: ivHex,
            padding: CryptoJS.pad.Pkcs7,
        });
        return decrypted.toString(CryptoJS.enc.Utf8);
    } catch {
        return "";
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

// Logout utility that redirects to legacy logout URL
export const logout = () => {
    // In development mode, just reload
    if (isDevelopmentMode()) {
        window.location.reload();
        return;
    }

    // Redirect to legacy logout URL which handles all cleanup
    window.location.href = '/intranet/Members/Home/Logout.aspx';
};                                                                                                                                                                                                                             
import { getSessionValue } from './sessionHelpers';
import { isDevelopmentMode } from './developmentHelper';

// Auth error constants
export const AUTH_ERRORS = {
  INVALID_SESSION: 'Invalid session',
  TOKEN_EXPIRED: 'Token expired',
  UNAUTHORIZED: 'Unauthorized access',
  LOGIN_REQUIRED: 'Login required'
};

// Encryption/decryption key for auth operations
export const authEncryptDecryptKey = "20SA16ED";
export const crmEncryptDecryptKey = "$%x@#~$a";


/**
 * Get the main login URL with return URL parameter
 * @param {string} returnUrl - URL to redirect to after login
 * @returns {string} Complete login URL
 */
export const getMainLoginUrl = (returnUrl = window.location.href) => {
  const baseUrl = window.location.origin;
  const encodedReturnUrl = encodeURIComponent(returnUrl);
  return `${baseUrl}/login.aspx?ReturnUrl=${encodedReturnUrl}`;
};

/**
 * Simple encryption function for auth data
 * @param {string} text - Text to encrypt
 * @returns {string} Encrypted text
 */
export const encrypt = (text) => {
  if (!text) return '';
  
  try {
    // Simple base64 encoding with key (not secure, just for obfuscation)
    const combined = authEncryptDecryptKey + text;
    return btoa(combined);
  } catch (error) {
    console.error('Encryption error:', error);
    return text;
  }
};

/**
 * Simple decryption function for auth data
 * @param {string} encryptedText - Text to decrypt
 * @returns {string} Decrypted text
 */
export const decrypt = (encryptedText) => {
  if (!encryptedText) return '';
  
  try {
    // Simple base64 decoding with key removal
    const decoded = atob(encryptedText);
    if (decoded.startsWith(authEncryptDecryptKey)) {
      return decoded.substring(authEncryptDecryptKey.length);
    }
    return decoded;
  } catch (error) {
    console.error('Decryption error:', error);
    return encryptedText;
  }
};

/**
 * Logout function - clears session and redirects
 * @param {string} returnUrl - Optional return URL after logout
 */
export const logout = (returnUrl = null) => {
  try {
    // Clear all session data
    localStorage.removeItem('MMClientVars');
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userInfo');
    
    // Clear session storage
    sessionStorage.clear();
    
    // In development mode, just reload
    if (isDevelopmentMode()) {
      console.log('🔧 Auth: Development mode - reloading instead of redirect');
      window.location.reload();
      return;
    }
    
    // Redirect to logout page in production
    const logoutUrl = returnUrl 
      ? `/intranet/Members/Home/Logout.aspx?ReturnUrl=${encodeURIComponent(returnUrl)}`
      : '/intranet/Members/Home/Logout.aspx';
    
    console.log('🔄 Auth: Redirecting to logout:', logoutUrl);
    window.location.href = logoutUrl;
  } catch (error) {
    console.error('Logout error:', error);
    // Fallback to hard refresh
    window.location.reload();
  }
};

/**
 * Check if user is authenticated
 * @returns {boolean} True if user is authenticated
 */
export const isAuthenticated = () => {
  try {
    const sessionData = getSessionValue('SessionID');
    const userEmail = getSessionValue('Email');
    
    return !!(sessionData && userEmail);
  } catch (error) {
    console.error('Auth check error:', error);
    return false;
  }
};

/**
 * Get current user's authentication status
 * @returns {object} Auth status object
 */
export const getAuthStatus = () => {
  return {
    isAuthenticated: isAuthenticated(),
    sessionId: getSessionValue('SessionID'),
    userId: getSessionValue('UserID'),
    email: getSessionValue('Email'),
    fullName: getSessionValue('FullName')
  };
};
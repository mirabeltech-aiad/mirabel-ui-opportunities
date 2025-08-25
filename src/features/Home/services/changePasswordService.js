import { encrypt, authEncryptDecryptKey } from '../../../utils/authHelpers';
import { STATIC_URLS } from '../../../utils/apiUrls';

/**
 * Change Password Service
 * Handles URL generation and logic for password change functionality
 */
export const changePasswordService = {
  /**
   * Constants for change password functionality
   */
  CHANGEPASSWORD_PASSWORDWEAK: 'PASSWORDWEAK', // Matches backend constant

  /**
   * Generate change password URL with encrypted parameters
   * Matches the backend logic exactly
   * @param {string} email - User email
   * @param {string} changePasswordValue - The ChangePassword value from session
   * @param {string} cultureUI - Culture UI setting
   * @returns {string} The complete change password URL
   */
  generateChangePasswordUrl: (email, changePasswordValue, cultureUI = 'en-US') => {
    try {
      if (!email) {
        console.error('Email is required for change password URL generation');
        return null;
      }

      // Encrypt the email (loginId) using the same encryption as backend
      const encryptedLoginId = encrypt(email, authEncryptDecryptKey);
      
      // Determine reset type based on change password value
      // If ChangePassword === 'PASSWORDWEAK', then rtype = "true", otherwise "false"
      const resetTypeValue = changePasswordValue === changePasswordService.CHANGEPASSWORD_PASSWORDWEAK ? "true" : "false";
      
      // Build the URL with query parameters matching backend logic
      const url = `${STATIC_URLS.CHANGE_PASSWORD}?loginId=${encryptedLoginId}&enabled=true&rtype=${resetTypeValue}&CUI=${cultureUI}`;
      
      
      return url;
    } catch (error) {
      console.error('Error generating change password URL:', error);
      return null;
    }
  },

  /**
   * Check if change password is required based on session data
   * @param {Object} sessionData - Session data from localStorage
   * @returns {boolean} Whether change password is required
   */
  isChangePasswordRequired: (sessionData) => {
    return (
      sessionData?.ChangePassword != null &&
      (sessionData.ExternalAuth === null || sessionData.ExternalAuth === '')
    );
  },  

  /**
   * Get change password data from session
   * @returns {Object|null} Change password data or null
   */
  getChangePasswordData: () => {
    try {
      const sessionData = localStorage.getItem('MMClientVars'); 
      if (!sessionData) {
        return null;
      }

      const parsed = JSON.parse(sessionData);
      
      if (!changePasswordService.isChangePasswordRequired(parsed)) {
        return null;
      }

      return {
        changePassword: parsed.ChangePassword,
        email: parsed.Email,
        cultureUI: parsed.cultureUI || 'en-US'
      };
    } catch (error) {
      console.error('Error getting change password data:', error);
      return null;
    }
  }
};

export default changePasswordService; 
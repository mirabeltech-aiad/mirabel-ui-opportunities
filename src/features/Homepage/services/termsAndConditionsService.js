import httpClient from '../../../services/httpClient';
import { 
  API_MM_AGREEMENTS_BYUSER_GET, 
  API_MM_AGREEMENTS_ACCEPT_POST 
} from '../../../config/apiUrls';
import { getUserInfo } from '../../../utils/sessionHelpers';

/**
 * Service for handling Terms and Conditions operations
 */
export const termsAndConditionsService = {
  /**
   * Get agreement text for the current user
   * @returns {Promise<string>} The agreement text
   */
  async getAgreementText() {
    try {
      const userInfo = getUserInfo();
      const clientId = userInfo?.clientId;
      const userId = userInfo?.userId;
      
      if (!clientId || !userId) {
        throw new Error('Session data not available');
      }

      const response = await httpClient.get(
        `${API_MM_AGREEMENTS_BYUSER_GET}${clientId}/${userId}`
      );
      
      return response.data;
    } catch (error) {
      console.error('Error fetching agreement text:', error);
      throw error;
    }
  },

  /**
   * Accept the agreement for the current user
   * @returns {Promise<boolean>} Success status
   */
  async acceptAgreement() {
    try {
      const userInfo = getUserInfo();
      const clientId = userInfo?.clientId;
      const userId = userInfo?.userId;
      
      if (!clientId || !userId) {
        throw new Error('Session data not available');
      }

      const response = await httpClient.post(
        `${API_MM_AGREEMENTS_ACCEPT_POST}${clientId}/${userId}`
      );
      
      return response.data;
    } catch (error) {
      console.error('Error accepting agreement:', error);
      throw error;
    }
  }
}; 
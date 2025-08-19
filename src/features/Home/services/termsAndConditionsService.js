import axiosService from '../../../services/axiosService';
import { TERMS_API } from '../../../utils/apiUrls';
import { getUserInfo,getSessionData } from '../../../utils/sessionHelpers';

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
      const sessionData = getSessionData();
      const clientId = sessionData.ClientID;
      const userId = sessionData.UserID;
      
      if (!clientId || !userId) {
         throw new Error('Session data not available');
      }

      const response = await axiosService.get(
        `${TERMS_API.AGREEMENTS_BY_USER}${clientId}/${userId}`
      );
      
      // Extract the agreement text from the response structure
      // AxiosService already extracts content: { Status: "Success", Data: "<html>..." }
      return response.Data || '';
    } catch (error) {
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

      const response = await axiosService.post(
        `${TERMS_API.AGREEMENTS_ACCEPT}${clientId}/${userId}`
      );
      
      return response;
    } catch (error) {
      throw error;
    }
  }
}; 
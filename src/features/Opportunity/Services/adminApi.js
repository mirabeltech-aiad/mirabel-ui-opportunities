import axiosService from '@/services/axiosService.js';
import { getCurrentUserId } from '@/utils/userUtils';
import { API_URLS } from '@/utils/apiUrls';
const axiosInstance = axiosService;
class AdminApi {
  // Method for fetching business units from master data
  async getBusinessUnits() {
    console.log('Fetching business units from master data');
    try {
      const response = await axiosInstance.get(API_URLS.ADMIN.BUSINESS_UNITS);
      console.log('AdminApi - Business Units API Response:', response);
      return response; // Return extracted content
    } catch (error) {
      console.error('AdminApi - Failed to fetch business units:', error);
      throw error;
    }
  }

  // Method for fetching products
  async getProducts() {
    console.log('Fetching products from master data');
    try {
      const response = await axiosInstance.get(API_URLS.ADMIN.PRODUCTS_MASTER);
      console.log('AdminApi - Products API Response:', response);
      return response; // Return extracted content
    } catch (error) {
      console.error('AdminApi - Failed to fetch products:', error);
      throw error;
    }
  }

  // Method for fetching products by criteria
  async getProductsByCriteria(businessUnitIds = "") {
    console.log('Fetching products by criteria with business unit IDs:', businessUnitIds);
    try {
      const payload = {
        BusinessUnitIDs: businessUnitIds,
        IsApplySecurity: 1
      };
      
      const response = await axiosInstance.post(API_URLS.ADMIN.PRODUCTS_BY_CRITERIA, payload);
      console.log('AdminApi - Products by Criteria API Response:', response);
      
      // With the axios interceptor, response now contains the extracted content
      // So we return response directly (which is the original response.content)
      return response;
    } catch (error) {
      console.error('AdminApi - Failed to fetch products by criteria:', error);
      throw error;
    }
  }

  // Method for fetching user accounts for dropdowns
  async getUserAccounts() {
    console.log('Fetching user accounts for dropdowns');
    try {
      const response = await axiosInstance.get(API_URLS.USER.ACCOUNTS_MASTER(getCurrentUserId()));
      console.log('AdminApi - User Accounts API Response:', response);
      return response; // Return extracted content
    } catch (error) {
      console.error('AdminApi - Failed to fetch user accounts:', error);
      throw error;
    }
  }

  // Method for fetching opportunity stages
  async getOpportunityStages() {
    console.log('Fetching opportunity stages from admin API');
    try {
      const response = await axiosInstance.get(API_URLS.ADMIN.OPPORTUNITY_STAGES);
      console.log('AdminApi - Stages API Response:', response);
      return response; // Return extracted content
    } catch (error) {
      console.error('AdminApi - Failed to fetch stages:', error);
      throw error;
    }
  }
}

export default new AdminApi();

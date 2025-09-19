import axiosService from '@/services/axiosService.js';
import { API_URLS } from '@/utils/apiUrls';
const axiosInstance = axiosService;
class ProposalsApi {
  // Method for fetching linked proposals with parameters
  async getLinkedProposals(params = {}) {
    console.log('Fetching linked proposals with params:', params);
    
    // If no params provided, use the original endpoint
    if (Object.keys(params).length === 0) {
      return axiosInstance.get(API_URLS.PROPOSALS.BY_CRITERIA);
    }
    
    // Use POST method when parameters are provided
    return axiosInstance.post(API_URLS.PROPOSALS.BY_CRITERIA, params);
  }
}

export default new ProposalsApi();

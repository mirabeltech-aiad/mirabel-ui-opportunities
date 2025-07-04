
import httpClient from './httpClient';

class ProposalsApi {
  // Method for fetching linked proposals with parameters
  async getLinkedProposals(params = {}) {
    console.log('Fetching linked proposals with params:', params);
    
    // If no params provided, use the original endpoint
    if (Object.keys(params).length === 0) {
      return httpClient.get('/services/production/proposals/bycriteria/ALL');
    }
    
    // Use POST method when parameters are provided
    return httpClient.post('/services/production/proposals/bycriteria/ALL', params);
  }
}

export default new ProposalsApi();

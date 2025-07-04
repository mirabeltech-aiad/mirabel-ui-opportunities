import httpClient, { userId } from '@/services/httpClient';

class ViewsApi {
  // Method for fetching saved views for opportunities
  async getSavedViews() {
    console.log('Fetching saved views for opportunities');
    return httpClient.get('/services/AdvSearches/Views//1/0/1');
  }

  // Method for fetching saved views for proposals
  async getProposalViews() {
    console.log('Fetching saved views for proposals');
    return httpClient.get('/services/AdvSearches/Views//1/0/2');
  }

  // Method for fetching available columns for Add View (opportunities)
  async getAvailableColumns() {
    console.log('Fetching available columns for Add View (opportunities)');
    return httpClient.get('/services/AdvSearches/Views/Column/EMPTY/1');
  }

  // Method for fetching available columns for Add View (proposals)
  async getProposalAvailableColumns() {
    console.log('Fetching available columns for Add View (proposals)');
    return httpClient.get('/services/AdvSearches/Views/Column/Production/1');
  }

  // Method for getting view details by ID
  async getViewDetails(viewId) {
    console.log('Fetching view details for view ID:', viewId);
    return httpClient.get(`/services/AdvSearches/Views/1/${viewId}`);
  }

  // Method for saving a custom view
  async saveCustomView(viewData) {
    console.log('Saving custom view:', viewData);
    return httpClient.post('/services/AdvSearches/Views/', viewData);
  }

  // Method for updating a view when selected
  async updateView(viewData) {
    console.log('Updating view:', viewData);
    return httpClient.post('/services/AdvSearches/Views/Update', viewData);
  }

  // Method for deleting a proposal view - Updated to use DELETE method
  async deleteProposalView(viewId) {
    console.log('=== VIEWSAPI: DELETE PROPOSAL VIEW ===');
    console.log('ViewsApi: Deleting proposal view with ID:', viewId);
    console.log('ViewsApi: Using DELETE method to endpoint:', `/services/crm/contacts/search/ListViewItem/${viewId}/${userId}/1`);
    
    try {
      const response = await httpClient.delete(`/services/crm/contacts/search/ListViewItem/${viewId}/${userId}/1`);
      console.log('ViewsApi: Delete response received:', response);
      return response;
    } catch (error) {
      console.error('ViewsApi: Delete request failed:', error);
      throw error;
    }
  }
}

export default new ViewsApi();

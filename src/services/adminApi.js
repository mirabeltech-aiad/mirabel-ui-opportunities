import httpClient, {userId} from './httpClient';

class AdminApi {
  // Method for fetching business units from master data
  async getBusinessUnits() {
    console.log('Fetching business units from master data');
    try {
      const response = await httpClient.get('/services/admin/BusinessUnits/ByCriteria/true/-1');
      console.log('AdminApi - Business Units API Response:', response);
      return response;
    } catch (error) {
      console.error('AdminApi - Failed to fetch business units:', error);
      throw error;
    }
  }

  // Method for fetching products
  async getProducts() {
    console.log('Fetching products from master data');
    try {
      const response = await httpClient.get('/services/Admin/Products/Master/-1/true/-1/1');
      console.log('AdminApi - Products API Response:', response);
      return response;
    } catch (error) {
      console.error('AdminApi - Failed to fetch products:', error);
      throw error;
    }
  }

  // Method for fetching products by criteria
  async getProductsByCriteria(businessUnitIds = "") {
    console.log('Fetching products by criteria with business unit IDs:', businessUnitIds);
    const payload = {
      BusinessUnitIDs: businessUnitIds,
      IsApplySecurity: 1
    };
    return httpClient.post('/services/Admin/Products/ByCriteria/', payload);
  }

  // Method for fetching user accounts for dropdowns
  async getUserAccounts() {
    console.log('Fetching user accounts for dropdowns');
    try {
      const response = await httpClient.get(`/services/User/Accounts/Master/${userId}/false/true`);
      console.log('AdminApi - User Accounts API Response:', response);
      return response;
    } catch (error) {
      console.error('AdminApi - Failed to fetch user accounts:', error);
      throw error;
    }
  }

  // Method for fetching opportunity stages
  async getOpportunityStages() {
    console.log('Fetching opportunity stages from admin API');
    try {
      const response = await httpClient.get('/services/Admin/Opportunities/Stage/');
      console.log('AdminApi - Stages API Response:', response);
      return response;
    } catch (error) {
      console.error('AdminApi - Failed to fetch stages:', error);
      throw error;
    }
  }
}

export default new AdminApi();

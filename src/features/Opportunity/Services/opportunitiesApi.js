import httpClient, { userId } from './httpClient';

class OpportunitiesApi {
  // Method for updating opportunity
  async updateOpportunity(opportunityData) {
    console.log('OpportunitiesApi: Making POST request to /services/Opportunities');
    console.log('OpportunitiesApi: Payload being sent:', opportunityData);
    
    const response = await httpClient.post('/services/Opportunities', opportunityData);
    
    console.log('OpportunitiesApi: Response received from /services/Opportunities:', response);
    return response;
  }

  // Method for creating opportunity (Add Mode)
  async createOpportunity(opportunityData) {
    console.log('OpportunitiesApi: Creating new opportunity with POST request to /services/Opportunities');
    console.log('OpportunitiesApi: Create opportunity payload being sent:', opportunityData);
    
    const response = await httpClient.post('/services/Opportunities', opportunityData);
    
    console.log('OpportunitiesApi: Create opportunity response received:', response);
    return response;
  }

  // Method for updating opportunity stage
  async updateOpportunityStage(stageId, opportunityId) {
    console.log('OpportunitiesApi: Updating opportunity stage for ID:', opportunityId, 'to stage:', stageId);
    const endpoint = `/Services/Opportunities/Field/PipelineStageID/${opportunityId}/0/${userId}/Insert`;
    
    const response = await httpClient.post(endpoint, stageId);
    
    console.log('OpportunitiesApi: Stage update response received:', response);
    return response;
  }

  // Method for fetching opportunity details by ID
  async getOpportunityDetails(opportunityId) {
    console.log('Fetching opportunity details for ID:', opportunityId);
    return httpClient.get(`/services/Opportunities/${opportunityId}`);
  }

  // Method for fetching opportunity history/audit trail
  async getOpportunityHistory(opportunityId) {
    console.log('Fetching opportunity history for ID:', opportunityId);
    return httpClient.get(`/services/Opportunities/History/${opportunityId}/10/1`);
  }

  // Method for fetching opportunity types
  async getOpportunityTypes() {
    console.log('Fetching opportunity types');
    try {
      const response = await httpClient.get('/services/Admin/Opportunities/Type');
      console.log('OpportunitiesApi - Opportunity Types API Response:', response);
      return response;
    } catch (error) {
      console.error('OpportunitiesApi - Failed to fetch opportunity types:', error);
      throw error;
    }
  }

  // Method for fetching opportunity loss reasons
  async getOpportunityLossReasons() {
    console.log('Fetching opportunity loss reasons');
    try {
      const response = await httpClient.get('/services/Admin/Opportunities/lossreason/');
      console.log('OpportunitiesApi - Loss Reasons API Response:', response);
      return response;
    } catch (error) {
      console.error('OpportunitiesApi - Failed to fetch loss reasons:', error);
      throw error;
    }
  }

  // Method for fetching opportunity stages
  async getOpportunityStages() {
    console.log('Fetching opportunity stages');
    try {
      const response = await httpClient.get('/services/Admin/Opportunities/Stage/');
      console.log('OpportunitiesApi - Stages API Response:', response);
      return response;
    } catch (error) {
      console.error('OpportunitiesApi - Failed to fetch stages:', error);
      throw error;
    }
  }
}

export default new OpportunitiesApi();

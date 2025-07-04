import httpClient, { userId } from '@/services/httpClient';

class PredictiveAnalyticsService {
  constructor() {
    this.baseURL = httpClient.baseURL;
  }

  async getPredictiveAnalyticsData(params = {}) {
    try {
      const payload = {
        spName: 'uspCDCSync_PredictiveAnalyticsGet',
        isMMDatabase: false,
        spParam: params
      };

      console.log('Calling Predictive Analytics API with payload:', payload);
      
      const response = await httpClient.post('services/admin/common/production/executesp/', payload);
      
      console.log('Predictive Analytics API response:', response);
      
      return response;
    } catch (error) {
      console.error('Predictive Analytics Service Error:', error);
      throw error;
    }
  }

  async getPredictiveAnalyticsWithFilters(
    period = 'this-quarter',
    selectedRep = 'all',
    customDateRange = null,
    selectedProduct = 'all',
    selectedBusinessUnit = 'all'
  ) {
    const params = {
      DateRange: period,
      SelectedRep: selectedRep !== 'all' ? selectedRep : 'all',
      SelectedProduct: selectedProduct !== 'all' ? selectedProduct : 'all',
      SelectedBusinessUnit: selectedBusinessUnit !== 'all' ? selectedBusinessUnit : 'all',
      UserID: userId
    };

    return this.getPredictiveAnalyticsData(params);
  }
}

export default new PredictiveAnalyticsService();

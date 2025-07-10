import AxiosService from '@/services/AxiosService';

/**
 * Dashboard service for fetching dashboard data from the API
 */
export const dashboardService = {
  /**
   * Fetch available dashboards from the API
   * @returns {Promise<Array>} Array of dashboard objects
   */
  getDashboards: async () => {
    try {
      const response = await AxiosService.get('/services/User/Dashboards/false');
      
      // Check if response has the expected structure
      if (response?.content?.Status === 'Success' && response?.content?.List) {
        return response.content.List;
      }
      
      // Fallback: check if data is directly in response.data
      if (response?.data?.content?.Status === 'Success' && response?.data?.content?.List) {
        return response.data.content.List;
      }
      
      console.warn('Unexpected API response structure:', response);
      return [];
    } catch (error) {
      console.error('Error fetching dashboards:', error);
      
      // Return mock data for development/fallback
      return [
        {
          ID: 2,
          DashBoardName: "Sales Dashboard",
          URL: "/ui/User/AnalyticsDashboard?Id={#Sales_DashboardID#}&pageSource=homepage",
          IsDefault: true,
          IsActive: true
        },
        {
          ID: 3,
          DashBoardName: "Audience",
          URL: "/DashBoard.aspx?ISMKM=1",
          IsDefault: false,
          IsActive: true
        }
      ];
    }
  },

  /**
   * Get the default dashboard from the list
   * @param {Array} dashboards - Array of dashboard objects
   * @returns {Object|null} Default dashboard object or null
   */
  getDefaultDashboard: (dashboards) => {
    return dashboards.find(dashboard => dashboard.IsDefault === true) || dashboards[0] || null;
  },

  /**
   * Get active dashboards only
   * @param {Array} dashboards - Array of dashboard objects
   * @returns {Array} Array of active dashboard objects
   */
  getActiveDashboards: (dashboards) => {
    return dashboards.filter(dashboard => dashboard.IsActive === true);
  }
};

export default dashboardService; 
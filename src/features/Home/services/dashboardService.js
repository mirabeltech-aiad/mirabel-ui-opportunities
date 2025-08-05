import axiosService from '../../../services/axiosService';
import { DASHBOARD_API } from '../../../utils/apiUrls';

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
      const response = await axiosService.get(DASHBOARD_API.USER_DASHBOARDS);
      if (response?.Status === 'Success' && response?.List) {
        return response.List;
      }else{
        return [];
      }      
    } catch (error) {
      console.error('Error fetching dashboards:', error);
      return [];
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
  },

  /**
   * Save active dashboard to API
   * @param {string} endpoint - API endpoint for saving active dashboard
   * @returns {Promise} API response
   */
  saveActiveDashboard: async (endpoint) => {
    try {
      const response = await axiosService.post(endpoint);
      return response;
    } catch (error) {
      console.error('Error saving active dashboard:', error);
      throw error;
    }
  }
};

export default dashboardService; 
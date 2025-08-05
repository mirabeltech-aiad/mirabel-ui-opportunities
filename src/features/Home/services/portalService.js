import axiosService from '../../../services/axiosService';
import { PORTAL_API } from '../../../utils/apiUrls';
import { getSessionData } from '@/utils/sessionHelpers';

/**
 * Portal service for fetching portal data from the API
 */
export const portalService = {
  /**
   * Get portal details for user - mirrors C# CreateAllPortals API call
   * @param {number} userId - User ID (RepID)
   * @returns {Promise<Array>} Array of portal objects
   */
  getPortalDetails: async (employeeId) => {
    try {
      const response = await axiosService.get(`${PORTAL_API.USER_WIDGETS_GET_DETAILS}${employeeId}/${PORTAL_API.GET_TITLES}/-1`);
      if (response?.Status === 'Success' && response?.List) {
        return response.List;
      } else {
        return [];
      }
    } catch (error) {
      console.error('Error fetching portal details:', error);
      return [];
    }
  },

  /**
   * Get portal URL for specific portal index
   * @param {number} portalIndex - Portal index
   * @returns {string} Portal URL
   */
  getPortalUrl: (portalIndex) => {
    return `/intranet/Members/Home/Dashboard.aspx?PortalIndex=${portalIndex}`;
  },

  /**
   * Create portal menu item object
   * @param {Object} portal - Portal object from API
   * @returns {Object} Portal menu item object
   */
  createPortalMenuItem: (portal) => {
    return {
      id: `portal${portal.PortalIndex}`,
      title: portal.Title,
      url: portalService.getPortalUrl(portal.PortalIndex),
      type: 'iframe',
      closable: true,
      icon: '📊',
      isPortal: true,
      portalIndex: portal.PortalIndex
    };
  }
};

export default portalService; 
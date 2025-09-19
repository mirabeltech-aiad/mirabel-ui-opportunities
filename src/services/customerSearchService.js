import axiosService from './axiosService.js';
import { getUserInfo } from '../utils/sessionHelpers';
import { API_CRM_CONTACTS_SEARCH_QUICK } from '../utils/apiUrls';

/**
 * Customer Search Service for quick customer lookup
 * Matches the legacy ASP.NET ContactsQuickSearch functionality
 */
export const customerSearchService = {
  /**
   * Quick search for customers/contacts
   * @param {string} searchQuery - Search term (minimum 3 characters)
   * @param {number} page - Page number (default: 1)
   * @param {number} start - Start index (default: 0)
   * @param {number} limit - Number of results (default: 20)
   * @returns {Promise<Array>} Array of customer search results
   */
  async quickSearch(searchQuery, page = 1, start = 0, limit = 20) {
    try {
      // Get user ID from session (matching legacy behavior)
      const userInfo = getUserInfo();
      const userId = userInfo?.userId;
      
      if (!userId) {
        throw new Error('User session not available');
      }

      if (!searchQuery || searchQuery.trim().length < 3) {
        return [];
      }

      // Create request body matching ContactQuickSearchDTO structure
      const requestData = {
        SearchQuery: searchQuery.trim(),
        UserID: userId
      };

      const response = await axiosService.post(API_CRM_CONTACTS_SEARCH_QUICK, requestData);
      
      // Handle different response formats (simplified with automatic content extraction)
      let contacts = [];
      if (response?.List) {
        // Direct List format (content automatically extracted by axiosService)
        contacts = response.List;
      } else if (response?.d?.List) {
        // Legacy format with 'd' wrapper
        contacts = response.d.List;
      } else if (Array.isArray(response)) {
        // Direct array format  
        contacts = response;
      } else {
        // Fallback - empty array
        contacts = [];
      }
      
      // Filter out inactive contacts (matching legacy behavior)
      const activeContacts = contacts.filter(contact => !contact.InActive) || [];
      
      return activeContacts;
    } catch (error) {
      console.error('CustomerSearchService: API call failed:', error);
      throw error;
    }
  },

  /**
   * Search customers by representative ID
   * @param {number} repId - Representative ID
   * @returns {Promise<Array>} Array of customers for the rep
   */
  async searchByRep(repId) {
    try {
      if (!repId || isNaN(repId)) {
        return [];
      }

      const response = await axiosService.get(`/crm/contacts/search/byrep/${repId}`);
      return response.List || [];
    } catch (error) {
      console.error('Error searching customers by rep:', error);
      return [];
    }
  },

  /**
   * Get customer details by ID
   * @param {number} customerId - Customer ID
   * @returns {Promise<Object>} Customer details
   */
  async getCustomerById(customerId) {
    try {
      if (!customerId || isNaN(customerId)) {
        throw new Error('Invalid customer ID');
      }

      const response = await axiosService.get(`/crm/contacts/${customerId}`);
      return response;
    } catch (error) {
      console.error('Error getting customer by ID:', error);
      throw error;
    }
  }
}; 
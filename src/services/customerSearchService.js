import httpClient from './httpClient';
import { getUserInfo } from '@/utils/sessionHelpers';
import { API_CRM_CONTACTS_SEARCH_QUICK } from '@/config/apiUrls';

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
      const params = new URLSearchParams({
        searchQuery: searchQuery.trim(),
        page: page.toString(),
        start: start.toString(),
        limit: limit.toString()
      });

      const response = await httpClient.get(`${API_CRM_CONTACTS_SEARCH_QUICK}?${params}`);
      
      if (response && response.data) {
        return response.data;
      }
      
      return [];
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

      const response = await httpClient.get(`/crm/contacts/search/byrep/${repId}`);
      return response.data?.List || [];
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

      const response = await httpClient.get(`/crm/contacts/${customerId}`);
      return response.data;
    } catch (error) {
      console.error('Error getting customer by ID:', error);
      throw error;
    }
  }
}; 
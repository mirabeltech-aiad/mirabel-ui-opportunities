import { getReportsDashboard, postReportsDashboard } from './reportsApi.js';

/**
 * Service class for handling reports operations
 */
class ReportsService {
  constructor() {
    this.isLoading = false;
    this.error = null;
  }

  /**
   * Fetch reports dashboard data
   * @returns {Promise<Array>} Array of reports
   */
  async fetchReports() {
    this.isLoading = true;
    this.error = null;
    
    try {
      const data = await getReportsDashboard();
      this.isLoading = false;
      return data;
    } catch (error) {
      this.isLoading = false;
      this.error = error;
      throw error;
    }
  }

  /**
   * Update report star status
   * @param {Object} payload - The payload for star toggle
   * @returns {Promise<Object>} API response
   */
  async updateReportStar(payload) {
    this.isLoading = true;
    this.error = null;
    
    try {
      const response = await postReportsDashboard(payload);
      this.isLoading = false;
      return response;
    } catch (error) {
      this.isLoading = false;
      this.error = error;
      throw error;
    }
  }

  /**
   * Reorder reports
   * @param {Array} payload - Array of reports with updated sort order
   * @returns {Promise<Object>} API response
   */
  async reorderReports(payload) {
    this.isLoading = true;
    this.error = null;
    
    try {
      const response = await postReportsDashboard(payload);
      this.isLoading = false;
      return response;
    } catch (error) {
      this.isLoading = false;
      this.error = error;
      throw error;
    }
  }

  /**
   * Get current loading state
   * @returns {boolean} Loading state
   */
  getLoadingState() {
    return this.isLoading;
  }

  /**
   * Get current error state
   * @returns {Error|null} Error state
   */
  getErrorState() {
    return this.error;
  }
}

// Export singleton instance
export const reportsService = new ReportsService(); 
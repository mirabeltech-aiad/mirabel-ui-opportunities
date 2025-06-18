
/**
 * API service for reports functionality
 */
import { API_CONFIG, ENDPOINTS } from '@/config/api.js';

/**
 * Fetch all reports from the API
 * @returns {Promise<Array>} Array of report objects
 */
export const fetchReports = async () => {
  try {
    const response = await fetch(`${API_CONFIG.baseURL}${ENDPOINTS.reports}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching reports:', error);
    throw error;
  }
};

/**
 * Search reports by query
 * @param {string} query - Search query
 * @returns {Promise<Array>} Array of matching report objects
 */
export const searchReports = async (query) => {
  try {
    const response = await fetch(`${API_CONFIG.baseURL}${ENDPOINTS.search}?q=${encodeURIComponent(query)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error searching reports:', error);
    throw error;
  }
};

/**
 * Toggle favorite status of a report
 * @param {number} reportId - ID of the report
 * @param {boolean} isStarred - New starred status
 * @returns {Promise<Object>} Updated report object
 */
export const toggleReportFavorite = async (reportId, isStarred) => {
  try {
    const response = await fetch(`${API_CONFIG.baseURL}${ENDPOINTS.favorites}/${reportId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ isStarred }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error toggling report favorite:', error);
    throw error;
  }
};

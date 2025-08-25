import axiosService from '@/services/axiosService';
import { getCurrentUserId } from '@/utils/userUtils';
import { API_URLS } from '@/utils/apiUrls';
const axiosInstance = axiosService;
class ViewsApi {
  // Method for fetching saved views for opportunities
  async getSavedViews() {

    const response = await axiosInstance.get(API_URLS.VIEWS.SAVED_VIEWS);
    return response;
  }

  // Method for fetching saved views for proposals
  async getProposalViews() {

    const response = await axiosInstance.get(API_URLS.VIEWS.PROPOSAL_VIEWS);
    return response;
  }

  // Method for fetching available columns for Add View (opportunities)
  async getAvailableColumns() {

    const response = await axiosInstance.get(API_URLS.VIEWS.AVAILABLE_COLUMNS);
    return response;
  }

  // Method for getting default columns (IsDefault=true) for new views
  async getDefaultColumns() {
    try {
      const response = await axiosInstance.get(API_URLS.VIEWS.AVAILABLE_COLUMNS);
      const allColumns = response.content || [];
      
      // Filter columns where IsDefault is true
      const defaultColumns = allColumns.filter(column => column.IsDefault === true);
      
      console.log('ViewsApi: All available columns:', allColumns);
      console.log('ViewsApi: Filtered default columns:', defaultColumns);
      
      return {
        ...response,
        content: defaultColumns,
        defaultColumns: defaultColumns // Additional property for easy access
      };
    } catch (error) {
      console.error('ViewsApi: Failed to fetch default columns:', error);
      throw error;
    }
  }

  // Method for getting columns separated into available and default lists for Add View UI
  async getColumnsForAddView() {
    try {
      const response = await axiosInstance.get(API_URLS.VIEWS.AVAILABLE_COLUMNS);
      const allColumns = response.content || [];
      
      // Separate columns into default (selected) and non-default (available)
      const defaultColumns = allColumns.filter(column => column.IsDefault === true);
      const availableColumns = allColumns.filter(column => column.IsDefault !== true);
      
      console.log('ViewsApi: Processing columns for Add View UI');
      console.log('ViewsApi: Default columns (selected list):', defaultColumns);
      console.log('ViewsApi: Available columns (available list):', availableColumns);
      
      return {
        success: true,
        allColumns: allColumns,
        selectedColumns: defaultColumns, // For the selected/default list
        availableColumns: availableColumns, // For the available list
        response: response
      };
    } catch (error) {
      console.error('ViewsApi: Failed to fetch columns for Add View:', error);
      return {
        success: false,
        selectedColumns: [],
        availableColumns: [],
        error: error.message
      };
    }
  }

  // Method for fetching available columns for Add View (proposals)
  async getProposalAvailableColumns() {

    const response = await axiosInstance.get(API_URLS.VIEWS.PROPOSAL_AVAILABLE_COLUMNS);
    return response;
  }

  // Method for getting view details by ID
  async getViewDetails(viewId) {

    const response = await axiosInstance.get(API_URLS.VIEWS.VIEW_DETAILS(viewId));
    return response;
  }

  // Method for saving a custom view
  async saveCustomView(viewData) {

    const response = await axiosInstance.post(API_URLS.VIEWS.SAVE_CUSTOM_VIEW, viewData);
    return response;
  }

  // Method for updating a view when selected
  async updateView(viewData) {

    const response = await axiosInstance.post(API_URLS.VIEWS.UPDATE_VIEW, viewData);
    return response;
  }

  // Method for deleting an opportunity view
  async deleteOpportunityView(viewId) {

    try {
      const userId = getCurrentUserId();
      const response = await axiosInstance.delete(API_URLS.VIEWS.DELETE_PROPOSAL_VIEW(viewId, userId));

      return response;
    } catch (error) {
      console.error('ViewsApi: Delete request failed:', error);
      throw error;
    }
  }

  // Method for deleting a proposal view - Updated to use DELETE method
  async deleteProposalView(viewId) {

    try {
      const userId = getCurrentUserId();
      const response = await axiosInstance.delete(API_URLS.VIEWS.DELETE_PROPOSAL_VIEW(viewId, userId));

      return response;
    } catch (error) {
      console.error('ViewsApi: Delete request failed:', error);
      throw error;
    }
  }

  // Method for getting user's default page view (based on documentation)
  async getUserPageView(userId, pageView) {
    try {
      const response = await axiosInstance.get(`/bl/rep/getUserPageView/${userId}/${pageView}`);
      return response;
    } catch (error) {
      console.error('ViewsApi: Failed to get user page view:', error);
      // Return a fallback response if the API doesn't exist
      return {
        views: [],
        defaultPageviewID: -1
      };
    }
  }

  // Method for saving user's page view preference (based on documentation)
  async saveUserPageView(payload) {
    try {
      const response = await axiosInstance.post('/bl/rep/saveUserPageView', payload);
      return response;
    } catch (error) {
      console.error('ViewsApi: Failed to save user page view:', error);
      throw error;
    }
  }

  // Method for getting page settings (based on documentation)
  async getPageSettings(pageTypeId, viewId = -1) {
    try {
      const response = await axiosInstance.get(`/services/Reports/Settings/${pageTypeId}/${viewId}`);
      return response;
    } catch (error) {
      console.error('ViewsApi: Failed to get page settings:', error);
      // Return a fallback response
      return {
        ShowType: 1 // Default to show results directly
      };
    }
  }

  // Method for getting header fields view ID (based on documentation)
  async getHeaderFieldsViewId(pageType, productType) {
    try {
      const response = await axiosInstance.get(`/services/common/HeaderFieldsViewId/${pageType}/${productType}`);
      return response;
    } catch (error) {
      console.error('ViewsApi: Failed to get header fields view ID:', error);
      // Return a fallback response with default view ID
      return {
        content: {
          Value: -1 // Default view ID
        }
      };
    }
  }
}

export default new ViewsApi();

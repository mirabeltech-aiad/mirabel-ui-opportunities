import AxiosService from '@/services/AxiosService';
import { apiCall } from '@/services/httpClient';

/**
 * Navigation service for fetching dynamic navigation menus from the API
 */
export const navigationService = {
  /**
   * Base domain for navigation URLs
   */
  BASE_DOMAIN: 'https://smoke-feature13.magazinemanager.com',

  /**
   * Transform API response data into MMnewclientvars format
   * @param {Object} apiResponse - The raw API response
   * @returns {Object} Transformed data in the desired format
   */
  transformSessionData: (apiResponse) => {
    try {
      const content = apiResponse.data?.content || apiResponse.content || apiResponse;
      
      // Extract data from various nested objects
      const sessionDetails = content.SessionDetails || {};
      const authInfo = content.AuthenticationInfo || {};
      const claims = authInfo.Claims || {};
      const clientDetails = sessionDetails.ClientsDetails?.[0] || {};
      const clientInfo = clientDetails.ClientInformation || {};
      const dataPackDetails = clientDetails.DataPackDetails || {};
      const tokenInfo = sessionDetails.Token || {};
      
      // Extract user ID - try multiple sources
      const userId = content.UserId || claims.LoggedInUserID || clientDetails.EmployeeId || 1;
      
      // Extract email - try multiple sources
      const email = sessionDetails.UserName || claims.Email || "sa@magazinemanager.com";
      
      // Extract domain information
      const domain = claims.Domain || clientInfo.ClientSubDomain || "smoke-feature13";
      const host = clientInfo.ClientAddress || `${domain}.magazinemanager.com`;
      
      // Extract token information
      const accessToken = tokenInfo.AccessToken || "";
      const tokenExpiry = tokenInfo.AccessTokenExpiredTime || "";
      
      // Extract client information
      const clientId = content.ClientId || claims.LoggedInSiteClientID || clientInfo.ClientID || "10007";
      const companyName = clientInfo.Name || "Mirabel Development | Home Page Migration to ReactJs | Test site";
      
      // Extract package information
      const packageTypeId = dataPackDetails.PackageTypeID || 1;
      const isMKMEnabled = dataPackDetails.IsMKMEnabled || false;
      
      // Determine admin status - could be derived from various sources
      // For now, we'll default to true for SA users, false otherwise
      const isAdmin = email.toLowerCase().includes('sa@') || email.toLowerCase().includes('admin');
      const isSA = isAdmin ? "true" : "false";
      
      // Create the transformed data object
      const transformedData = {
        "UserID": userId,
        "Email": email,
        "IsAdmin": isAdmin,
        "IsAuthenticated": true, // Add this for compatibility
        "Token": accessToken,
        "IsSA": isSA,
        "UserName": isAdmin ? "Administrator System" : "User",
        "DisplayName": isAdmin ? "Administrator,System" : "User,Name",
        "UserNameID": isAdmin ? "sadministrator" : "user",
        "ClientID": clientId.toString(),
        "Host": host,
        "Domain": domain,
        "ContentVersion": Date.now().toString(), // Use current timestamp
        "AccessTokenTimeOut": tokenExpiry,
        "IsMKMEnabled": isMKMEnabled ? "True" : "False",
        "CompanyName": companyName,
        "ProductType": packageTypeId === 1 ? "10178" : packageTypeId.toString(),
        "PackageTypeID": packageTypeId.toString(), // Add this for dashboard logic
        "TimeAdd": (clientInfo.TimeAdd || 0).toString(),
        "PageList": "", // Default empty
        "HelpSite": "https://helpwp.emailnow.info",
        "FullName": isAdmin ? "System Administrator" : "User Name",
        "DepartmentID": "1",
        "PASubProductTypeId": "0",
        "PASubProductTypeName": "",
        "BSASubProductTypeId": "21",
        "BSASubProductTypeName": "Broadstreet",
        "CustomerPortalUrl": "http://tier1-portal.mirabeltechnologies.com",
        "CanSendCRMEmail": "true"
      };
      
      console.log('🔄 Transformed session data:', transformedData);
      return transformedData;
      
    } catch (error) {
      console.error('❌ Error transforming session data:', error);
      
      // Return fallback data structure
     
    }
  },

  /**
   * Fetch navigation data from the API
   * @param {number} userId - User ID (default: 1)
   * @param {number} siteId - Site ID (default: 0)
   * @returns {Promise<Array>} Array of navigation menu objects
   */
  fetchNavigationData: async (userId = 1, siteId = 0) => {
    try {
        //// First, load session details and store in localStorage
        //await navigationService.loadSessionDetails();
      
      // Then fetch navigation menus
      const response = await apiCall(`/services/admin/navigations/users/${userId}/${siteId}`, 'GET');     
      // Check if response has the expected structure
      if (response?.content?.List) {
        const menus = response.content.List;
        return navigationService.processNavigationMenus(menus);
      }
      
      // Fallback: check if data is directly in response.data
      if (response?.data?.content?.List) {
        const menus = response.data.content.List;
        return navigationService.processNavigationMenus(menus);
      }
      
      // Additional fallback: check if response is directly an array
      if (Array.isArray(response)) {
        return navigationService.processNavigationMenus(response);
      }
      return [];
    } catch (error) {
      console.error('Error fetching navigation data:', error);
      
      // Return mock navigation data for development/fallback
      return navigationService.getMockNavigationData();
    }
  },

  /**
   * Load session details and store in localStorage with transformed format
   * @returns {Promise<Object>} Session details response
   */
  loadSessionDetails: async () => {
    try {
      console.log('🔄 Loading session details...');
      const response = await AxiosService.get('https://smoke-feature13.magazinemanager.com/services/admin/common/SessionDetailsGet');
      
      console.log('📊 Raw session API response:', response);
      
      // Transform the response data into the desired format
      const transformedData = navigationService.transformSessionData(response);
      
      // Store transformed data in localStorage with key 'MMnewclientvars'
      localStorage.setItem('MMnewclientvars', JSON.stringify(transformedData));
      console.log('✅ Session details transformed and stored in localStorage as MMnewclientvars');
      console.log('📝 Stored data:', transformedData);
      
      // Also update the existing MMClientVars for backward compatibility
      const existingClientVars = localStorage.getItem('MMClientVars');
      if (existingClientVars) {
        try {
          const existing = JSON.parse(existingClientVars);
          const updatedClientVars = { ...existing, ...transformedData };
          localStorage.setItem('MMClientVars', JSON.stringify(updatedClientVars));
          console.log('🔄 Updated MMClientVars for backward compatibility');
        } catch (e) {
          console.warn('⚠️ Could not update MMClientVars:', e);
        }
      } else {
        // Create MMClientVars if it doesn't exist
        localStorage.setItem('MMClientVars', JSON.stringify(transformedData));
        console.log('➕ Created MMClientVars with transformed data');
      }
      
      return transformedData;
    } catch (error) {
      console.error('❌ Failed to load session details:', error);
      
      // Store fallback data
      const fallbackData = navigationService.transformSessionData({});
      localStorage.setItem('MMnewclientvars', JSON.stringify(fallbackData));
      console.log('🔄 Stored fallback session data');
      
      throw error;
    }
  },

  /**
   * Process and organize navigation menus into hierarchical structure
   * @param {Array} menus - Raw menu data from API
   * @returns {Array} Processed menu structure
   */
  processNavigationMenus: (menus) => {
    if (!Array.isArray(menus)) {
      return [];
    }

    // Sort menus by SortOrder
    const sortedMenus = menus.sort((a, b) => (a.SortOrder || 0) - (b.SortOrder || 0));

    // Separate parent and child menus
    const parentMenus = sortedMenus.filter(menu => menu.ParentID === -1 || menu.ParentID === null);
    const childMenus = sortedMenus.filter(menu => menu.ParentID !== -1 && menu.ParentID !== null);

    // Transform and attach children to their parents
    const processedMenus = parentMenus.map(parent => ({
      id: parent.ID,
      title: parent.Caption,
      url: parent.URL,
      sortOrder: parent.SortOrder,
      isAdmin: parent.IsAdmin,
      isNewWindow: parent.IsNewWindow,
      isVisible: parent.IsVisible,
      icon: parent.Icon,
      toolTip: parent.ToolTip,
      children: childMenus
        .filter(child => child.ParentID === parent.ID)
        .map(child => ({
          id: child.ID,
          title: child.Caption,
          url: child.URL,
          sortOrder: child.SortOrder,
          isAdmin: child.IsAdmin,
          isNewWindow: child.IsNewWindow,
          isVisible: child.IsVisible,
          icon: child.Icon,
          toolTip: child.ToolTip,
          fullUrl: navigationService.getFullUrl(child.URL)
        })),
      fullUrl: navigationService.getFullUrl(parent.URL)
    }));

    return processedMenus;
  },

  /**
   * Get full URL by combining base domain with relative URL
   * @param {string} relativeUrl - Relative URL from API
   * @returns {string} Full URL
   */
  getFullUrl: (relativeUrl) => {
    if (!relativeUrl || relativeUrl === '') {
      return '';
    }
    
    // If already a full URL, return as is
    if (relativeUrl.startsWith('http://') || relativeUrl.startsWith('https://')) {
      return relativeUrl;
    }
    
    // Combine with base domain
    const baseUrl = navigationService.BASE_DOMAIN;
    const url = relativeUrl.startsWith('/') ? relativeUrl : `/${relativeUrl}`;
    return `${baseUrl}${url}`;
  },

  /**
   * Get mock navigation data for development/fallback
   * @returns {Array} Mock navigation menu structure
   */
  getMockNavigationData: () => {
    return [
      {
        id: 1,
        title: 'Management',
        url: '',
        sortOrder: 1,
        isAdmin: true,
        isNewWindow: false,
        isVisible: true,
        icon: '⚙️',
        toolTip: 'Management tools and settings',
        children: [
          {
            id: 11,
            title: 'User Management',
            url: '/admin/users',
            sortOrder: 1,
            isAdmin: true,
            isNewWindow: false,
            isVisible: true,
            icon: '👥',
            toolTip: 'Manage users',
            fullUrl: `${navigationService.BASE_DOMAIN}/admin/users`
          },
          {
            id: 12,
            title: 'System Settings',
            url: '/admin/settings',
            sortOrder: 2,
            isAdmin: true,
            isNewWindow: false,
            isVisible: true,
            icon: '🔧',
            toolTip: 'System configuration',
            fullUrl: `${navigationService.BASE_DOMAIN}/admin/settings`
          }
        ],
        fullUrl: ''
      },
      {
        id: 2,
        title: 'Reports',
        url: '/reports',
        sortOrder: 2,
        isAdmin: false,
        isNewWindow: false,
        isVisible: true,
        icon: '📊',
        toolTip: 'View reports and analytics',
        children: [
          {
            id: 21,
            title: 'Sales Reports',
            url: '/reports/sales',
            sortOrder: 1,
            isAdmin: false,
            isNewWindow: false,
            isVisible: true,
            icon: '💰',
            toolTip: 'Sales analytics',
            fullUrl: `${navigationService.BASE_DOMAIN}/reports/sales`
          },
          {
            id: 22,
            title: 'User Analytics',
            url: '/reports/users',
            sortOrder: 2,
            isAdmin: false,
            isNewWindow: false,
            isVisible: true,
            icon: '📈',
            toolTip: 'User behavior analytics',
            fullUrl: `${navigationService.BASE_DOMAIN}/reports/users`
          }
        ],
        fullUrl: `${navigationService.BASE_DOMAIN}/reports`
      },
      {
        id: 3,
        title: 'Tools',
        url: '/tools',
        sortOrder: 3,
        isAdmin: false,
        isNewWindow: false,
        isVisible: true,
        icon: '🛠️',
        toolTip: 'Utility tools',
        children: [],
        fullUrl: `${navigationService.BASE_DOMAIN}/tools`
      }
    ];
  },

  /**
   * Filter visible menus based on user permissions
   * @param {Array} menus - Navigation menus
   * @param {boolean} isAdmin - Whether user is admin
   * @returns {Array} Filtered menus
   */
  filterVisibleMenus: (menus, isAdmin = false) => {
    return menus.filter(menu => {
      if (!menu.IsVisible) return false;
      if (menu.IsAdmin && !isAdmin) return false;
      
      // Filter children as well
      if (menu.children) {
        menu.children = menu.children.filter(child => {
          if (!child.IsVisible) return false;
          if (child.IsAdmin && !isAdmin) return false;
          return true;
        });
      }
      
      return true;
    });
  },

  /**
   * Get session details from localStorage (MMnewclientvars)
   * @returns {Object|null} Session details or null
   */
  getSessionDetails: () => {
    try {
      const sessionData = localStorage.getItem('MMnewclientvars');
      return sessionData ? JSON.parse(sessionData) : null;
    } catch (error) {
      console.error('Error parsing session data:', error);
      return null;
    }
  },

  /**
   * Update session data in localStorage
   * @param {Object} updates - Updates to apply to session data
   * @returns {Object} Updated session data
   */
  updateSessionData: (updates) => {
    try {
      const existing = navigationService.getSessionDetails() || {};
      const updated = { ...existing, ...updates };
      localStorage.setItem('MMnewclientvars', JSON.stringify(updated));
      
      // Also update MMClientVars for backward compatibility
      localStorage.setItem('MMClientVars', JSON.stringify(updated));
      
      console.log('✅ Session data updated:', updated);
      return updated;
    } catch (error) {
      console.error('❌ Error updating session data:', error);
      return null;
    }
  }
};

export default navigationService; 
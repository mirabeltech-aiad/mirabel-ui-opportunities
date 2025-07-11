import AxiosService from '@/services/AxiosService';

/**
 * Navigation service for fetching dynamic navigation menus from the API
 */
export const navigationService = {
  /**
   * Base domain for navigation URLs
   */
  BASE_DOMAIN: 'https://smoke-feature13.magazinemanager.com',

  /**
   * Fetch navigation data from the API
   * @param {number} userId - User ID (default: 1)
   * @param {number} siteId - Site ID (default: 0)
   * @returns {Promise<Array>} Array of navigation menu objects
   */
  fetchNavigationData: async (userId = 1, siteId = 0) => {
    try {
      // First, load session details and store in localStorage
      await navigationService.loadSessionDetails();

      // Then fetch navigation menus
      const response = await AxiosService.get(`/services/admin/navigations/users/${userId}/${siteId}`);
      
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
      
      console.warn('Unexpected navigation API response structure:', response);
      return [];
    } catch (error) {
      console.error('Error fetching navigation data:', error);
      
      // Return mock navigation data for development/fallback
      return navigationService.getMockNavigationData();
    }
  },

  /**
   * Load session details and store in localStorage
   * @returns {Promise<Object>} Session details response
   */
  loadSessionDetails: async () => {
    try {
      console.log('Loading session details...');
      const response = await AxiosService.get('https://smoke-feature13.magazinemanager.com/services/admin/common/SessionDetailsGet');
      
      // Store response in localStorage with key 'MMnewclientvars'
      const sessionData = response.content || response;
      localStorage.setItem('MMnewclientvars', JSON.stringify(sessionData));
      console.log('Session details loaded and stored in localStorage');
      
      return sessionData;
    } catch (error) {
      console.error('Failed to load session details:', error);
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

    // Attach children to their parents
    const processedMenus = parentMenus.map(parent => ({
      ...parent,
      children: childMenus
        .filter(child => child.ParentID === parent.ID)
        .map(child => ({
          ...child,
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
        ID: 1,
        ParentID: -1,
        Caption: 'Management',
        URL: '',
        SortOrder: 1,
        IsAdmin: true,
        IsNewWindow: false,
        IsVisible: true,
        Icon: '⚙️',
        ToolTip: 'Management tools and settings',
        children: [
          {
            ID: 11,
            ParentID: 1,
            Caption: 'User Management',
            URL: '/admin/users',
            SortOrder: 1,
            IsAdmin: true,
            IsNewWindow: false,
            IsVisible: true,
            Icon: '👥',
            ToolTip: 'Manage users',
            fullUrl: `${navigationService.BASE_DOMAIN}/admin/users`
          },
          {
            ID: 12,
            ParentID: 1,
            Caption: 'System Settings',
            URL: '/admin/settings',
            SortOrder: 2,
            IsAdmin: true,
            IsNewWindow: false,
            IsVisible: true,
            Icon: '🔧',
            ToolTip: 'System configuration',
            fullUrl: `${navigationService.BASE_DOMAIN}/admin/settings`
          }
        ],
        fullUrl: ''
      },
      {
        ID: 2,
        ParentID: -1,
        Caption: 'Reports',
        URL: '/reports',
        SortOrder: 2,
        IsAdmin: false,
        IsNewWindow: false,
        IsVisible: true,
        Icon: '📊',
        ToolTip: 'View reports and analytics',
        children: [
          {
            ID: 21,
            ParentID: 2,
            Caption: 'Sales Reports',
            URL: '/reports/sales',
            SortOrder: 1,
            IsAdmin: false,
            IsNewWindow: false,
            IsVisible: true,
            Icon: '💰',
            ToolTip: 'Sales analytics',
            fullUrl: `${navigationService.BASE_DOMAIN}/reports/sales`
          },
          {
            ID: 22,
            ParentID: 2,
            Caption: 'User Analytics',
            URL: '/reports/users',
            SortOrder: 2,
            IsAdmin: false,
            IsNewWindow: false,
            IsVisible: true,
            Icon: '📈',
            ToolTip: 'User behavior analytics',
            fullUrl: `${navigationService.BASE_DOMAIN}/reports/users`
          }
        ],
        fullUrl: `${navigationService.BASE_DOMAIN}/reports`
      },
      {
        ID: 3,
        ParentID: -1,
        Caption: 'Tools',
        URL: '/tools',
        SortOrder: 3,
        IsAdmin: false,
        IsNewWindow: false,
        IsVisible: true,
        Icon: '🛠️',
        ToolTip: 'Utility tools',
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
   * Get session details from localStorage
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
  }
};

export default navigationService; 
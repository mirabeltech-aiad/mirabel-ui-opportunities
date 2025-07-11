import AxiosService from '@/services/AxiosService';
import { apiCall } from '@/services/httpClient';

/**
 * Navigation service for fetching dynamic navigation menus from the API
 */
export const navigationService = {
  /**
   * Base domain for navigation URLs
   */
  BASE_DOMAIN: 'http://localhost',

  /**
   * Fetch navigation data from the API
   * @param {number} userId - User ID (default: 1)
   * @param {number} siteId - Site ID (default: 0)
   * @returns {Promise<Array>} Array of navigation menu objects
   */
  fetchNavigationData: async (userId = 1, siteId = 0) => {
    try {
        //// First, load session details and store in localStorage
        await navigationService.loadSessionDetails();
      
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
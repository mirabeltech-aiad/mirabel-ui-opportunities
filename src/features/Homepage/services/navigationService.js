const API_BASE_URL = 'https://smoke-feature13.magazinemanager.com';
const BEARER_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJMb2dnZWRJblVzZXJJRCI6IjEiLCJMb2dnZWRJblNpdGVDbGllbnRJRCI6IjEwMDA3IiwiTG9nZ2VkSW5TaXRlQ3VsdHVyZVVJIjoiZW4tVVMiLCJEYXRlVGltZSI6IjcvMTEvMjAyNSA4OjMyOjA5IEFNIiwiTG9nZ2VkSW5TaXRlQ3VycmVuY3lTeW1ib2wiOiIiLCJMb2dnZWRJblNpdGVEYXRlRm9ybWF0IjoiIiwiRG9tYWluIjoic21va2UtZmVhdHVyZTEzIiwiTG9nZ2VkSW5TaXRlVGltZUFkZCI6WyIwIiwiMCJdLCJTb3VyY2UiOiJUTU0iLCJFbWFpbCI6InNhQG1hZ2F6aW5lbWFuYWdlci5jb20iLCJJc0FQSVVzZXIiOiJGYWxzZSIsIm5iZiI6MTc1MjIyMjcyOSwiZXhwIjoxNzU1MjIyNzI5LCJpYXQiOjE3NTIyMjI3MjksImlzcyI6Ik1hZ2F6aW5lTWFuYWdlciIsImF1ZCI6IioifQ.rw8UiRrkZqv0Axe2HtPXjLNELWJ9Bw81LnshJgTxiXc';

class NavigationService {
  constructor() {
    this.baseUrl = API_BASE_URL;
    this.token = BEARER_TOKEN;
  }

  async fetchNavigationData(userId = 1, siteId = 0) {
    try {
      const response = await fetch(
        `${this.baseUrl}/services/admin/navigations/users/${userId}/${siteId}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${this.token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.content?.Status === 'Success' && data.content?.List) {
        return this.processNavigationData(data.content.List);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Error fetching navigation data:', error);
      throw error;
    }
  }

  processNavigationData(navigationList) {
    // Create a map of all navigation items by ID
    const navigationMap = new Map();
    navigationList.forEach(item => {
      navigationMap.set(item.ID, {
        id: item.ID,
        parentId: item.ParentID,
        title: item.Caption,
        url: item.URL,
        sortOrder: item.SortOrder,
        isAdmin: item.IsAdmin,
        isNewWindow: item.IsNewWindow,
        isVisible: item.IsVisible,
        icon: item.Icon,
        toolTip: item.ToolTip,
        accessLevel: item.AccessLevel,
        moveLevel: item.MoveLevel,
        urlSource: item.URLSource
      });
    });

    // Build hierarchical structure
    const topLevelMenus = [];
    const subMenus = new Map();

    navigationList.forEach(item => {
      const menuItem = navigationMap.get(item.ID);
      
      if (item.ParentID === -1) {
        // Top level menu
        topLevelMenus.push(menuItem);
      } else {
        // Sub menu
        if (!subMenus.has(item.ParentID)) {
          subMenus.set(item.ParentID, []);
        }
        subMenus.get(item.ParentID).push(menuItem);
      }
    });

    // Sort top level menus by SortOrder
    topLevelMenus.sort((a, b) => a.sortOrder - b.sortOrder);

    // Add submenus to their parent menus
    topLevelMenus.forEach(menu => {
      if (subMenus.has(menu.id)) {
        menu.submenu = subMenus.get(menu.id).sort((a, b) => a.sortOrder - b.sortOrder);
      }
    });

    return topLevelMenus;
  }

  // Helper method to get full URL for navigation items
  getFullUrl(relativeUrl) {
    if (!relativeUrl) return '';
    
    // If it's already a full URL, return as is
    if (relativeUrl.startsWith('http://') || relativeUrl.startsWith('https://')) {
      return relativeUrl;
    }
    
    // Otherwise, prepend the base URL
    return `${this.baseUrl}${relativeUrl}`;
  }
}

export default new NavigationService(); 
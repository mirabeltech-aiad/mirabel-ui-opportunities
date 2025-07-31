/**
 * Page Navigation Utilities
 * Provides helper functions for managing page navigation across the application
 */

let navigationActions = null;

/**
 * Initialize page navigation helpers with actions from HomeContext
 * @param {object} actions - Actions object from HomeContext
 */
export const initializePageNavigation = (actions) => {
  navigationActions = actions;
  
  // Make navigation functions globally available for legacy integration
  if (typeof window !== 'undefined') {
    // Global function to open a new tab (matching legacy ASP.NET pattern)
    window.openTabByUrl = (title, url) => {
      if (navigationActions) {
        const fullUrl = url.startsWith('http') ? url : `${window.location.origin}${url}`;
        navigationActions.addTab({
          title,
          url: fullUrl,
          type: 'iframe',
          icon: '🌐',
          closable: true,
        });
      }
    };
    
    // Global function to set active tab
    window.setActiveTab = (tabId) => {
      if (navigationActions) {
        navigationActions.setActiveTab(tabId);
      }
    };
    
    // Global function to close tab
    window.closeTab = (tabId) => {
      if (navigationActions) {
        navigationActions.closeTab(tabId);
      }
    };
    
    // Global function to refresh current tab
    window.refreshCurrentTab = () => {
      if (navigationActions) {
        // This would need to be implemented based on the current active tab
        console.log('Refresh current tab requested');
      }
    };
    
    // Global function to get navigation state
    window.getNavigationState = () => {
      if (navigationActions) {
        return {
          hasActions: true,
          actionsAvailable: Object.keys(navigationActions)
        };
      }
      return { hasActions: false };
    };
    
    console.log('📱 Page navigation helpers initialized globally');
  }
};

/**
 * Cleanup page navigation helpers
 */
export const cleanupPageNavigation = () => {
  navigationActions = null;
  
  // Remove global functions
  if (typeof window !== 'undefined') {
    delete window.openTabByUrl;
    delete window.setActiveTab;
    delete window.closeTab;
    delete window.refreshCurrentTab;
    delete window.getNavigationState;
    
    console.log('📱 Page navigation helpers cleaned up');
  }
};

/**
 * Get current navigation actions (for internal use)
 * @returns {object|null} Navigation actions or null if not initialized
 */
export const getNavigationActions = () => {
  return navigationActions;
};

/**
 * Check if navigation is initialized
 * @returns {boolean} True if navigation is initialized
 */
export const isNavigationInitialized = () => {
  return navigationActions !== null;
};

/**
 * Open a tab programmatically (internal helper)
 * @param {object} tabConfig - Tab configuration
 * @param {string} tabConfig.title - Tab title
 * @param {string} tabConfig.url - Tab URL
 * @param {string} tabConfig.type - Tab type (default: 'iframe')
 * @param {string} tabConfig.icon - Tab icon (default: '🌐')
 * @param {boolean} tabConfig.closable - Whether tab is closable (default: true)
 */
export const openTab = (tabConfig) => {
  if (!navigationActions) {
    console.warn('Navigation not initialized - cannot open tab');
    return;
  }
  
  const {
    title,
    url,
    type = 'iframe',
    icon = '🌐',
    closable = true
  } = tabConfig;
  
  navigationActions.addTab({
    title,
    url,
    type,
    icon,
    closable
  });
};

/**
 * Navigate to a URL in the current window or open in new tab
 * @param {string} url - URL to navigate to
 * @param {object} options - Navigation options
 * @param {boolean} options.newTab - Open in new tab (default: true)
 * @param {string} options.title - Title for new tab
 */
export const navigateTo = (url, options = {}) => {
  const { newTab = true, title = 'Page' } = options;
  
  if (newTab && navigationActions) {
    openTab({ title, url });
  } else {
    window.location.href = url;
  }
};
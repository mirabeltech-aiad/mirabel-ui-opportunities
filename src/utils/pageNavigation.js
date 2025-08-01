/**
 * Page Navigation Helpers
 * These functions are exposed on window.top for use by other React applications (Feature apps)
 * to open pages either in new browser tabs or in the Shell app's tab system
 */


/**
 * Opens a page in a new browser tab
 * @param {string} url - The URL to open
 * @param {string} pageTitle - Title for the page (not used for browser tabs)
 * @param {boolean} isQueryStrValEncoded - Whether query string values are encoded (not used)
 * @param {boolean} addTabAfterActiveTab - Whether to add tab after active tab (not used)
 * @returns {Window} The new window object
 */
export const openPage = (url, pageTitle, isQueryStrValEncoded, addTabAfterActiveTab) => {
  console.log('openPage called with:', { url, pageTitle, isQueryStrValEncoded, addTabAfterActiveTab });
  
  if (!url) {
    console.warn('openPage: No URL provided');
    return null;
  }
  
  // Simple window.open for new browser tab
  const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
  
  if (!newWindow) {
    console.error('openPage: Failed to open new window (popup blocked?)');
  }
  
  return newWindow;
};

/**
 * Opens a page in the Shell app's tab system using IframeContainer
 * @param {string} url - The URL to open in iframe
 * @param {string} pageTitle - Title for the tab
 * @param {boolean} isQueryStrValEncoded - Whether query string values are encoded (not used)
 * @param {boolean} addTabAfterActiveTab - Whether to add tab after active tab (future enhancement)
 * @returns {Object} Tab information
 */
export const openPageInNextTab = (url, pageTitle, isQueryStrValEncoded, addTabAfterActiveTab) => {
  console.log('openPageInNextTab called with:', { url, pageTitle, isQueryStrValEncoded, addTabAfterActiveTab });
  
  if (!url) {
    console.warn('openPageInNextTab: No URL provided');
    return null;
  }
  
  // Get the tab system actions from the global context
  if (window.homeActions && window.homeActions.addTab) {
    const tabData = {
      title: pageTitle || 'New Tab',
      url: url,
      type: 'iframe',
      icon: '🌐',
      closable: true
    };
    
    // Add the tab using the home context actions
    window.homeActions.addTab(tabData);
    
    console.log('openPageInNextTab: Added tab successfully:', tabData);
    
    return {
      success: true,
      tabId: tabData.id,
      title: tabData.title,
      url: tabData.url
    };
  } else {
    console.error('openPageInNextTab: Home actions not available, falling back to openPage');
    // Fallback to opening in new browser tab
    return openPage(url, pageTitle, isQueryStrValEncoded, addTabAfterActiveTab);
  }
};

/**
 * Initializes the page navigation helpers by exposing them on window.top
 * This should be called when the Shell app loads
 * @param {Object} homeActions - The actions object from HomeContext
 */
export const initializePageNavigation = (homeActions) => {
  console.log('Initializing page navigation helpers');

  // Store home actions globally for access by the helper functions
  window.homeActions = homeActions;
  
  // Expose functions on window.top for Feature apps to use
  if (window.top) {
    window.top.openPage = openPage;
    window.top.openPageInNextTab = openPageInNextTab;
    window.top.isWindowTopAccessible = isWindowTopAccessible;
    
    console.log('Page navigation helpers exposed on window.top');
  } else {
    console.warn('window.top not available, cannot expose navigation helpers');
  }

  // Load the localizer script
  loadLocalizerScript();
};

/**
 * Loads the localizer script with the correct domain path
 */
const loadLocalizerScript = async () => {
  try {
    const version = '1.0.0';
    console.log("📦 Loading localizer script with Content Version:", version);

    const script = document.createElement("script");
    
    // Get the complete domain and remove everything after /ui60
    const currentUrl = window.location.href;
    const ui60Index = currentUrl.indexOf('/ui60');
    // Remove '/ui60' from the URL if present, to get the base domain path
    const baseUrl = ui60Index !== -1 ? currentUrl.substring(0, ui60Index) : window.location.origin;
    script.src = `${baseUrl}/intranet/localizer.js.axd?v=${version}`;
    script.async = true;
    console.log('script', script);
    
    document.head.appendChild(script);
    console.log("✅ Localizer script loaded successfully");

  } catch (err) {
    console.error("❌ Failed to load localizer script:", err);
  }
};
export const isWindowTopAccessible = () => {
  try {
    // Try to access window.top and a property on it
    if (window.top && window.top !== window) {
      // Try to access a property to test if it's really accessible
      window.top.location.href;
      return true;
    }
    return false;
  } catch (error) {
    // If we get a security error, window.top is not accessible
    return false;
  }
};

/**
 * Safely gets window.top if accessible
 * @returns {Window|null} window.top if accessible, null otherwise
 */
export const getTopWindow = () => {
  if (isWindowTopAccessible()) {
    return window.top;
  }
  return null;
}; 
/**
 * Cleans up the page navigation helpers
 * This should be called when the Shell app unmounts
 */
export const cleanupPageNavigation = () => {
  console.log('Cleaning up page navigation helpers');
  
  if (window.top) {
    delete window.top.openPage;
    delete window.top.openPageInNextTab;
    delete window.top.isWindowTopAccessible;
  }
  
  delete window.homeActions;
}; 

